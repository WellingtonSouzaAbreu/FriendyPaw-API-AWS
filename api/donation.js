const path = require('path')
const { user } = require('../apiTestConfig/dataTest')

module.exports = app => {
    const { showLog, showAndRegisterError } = app.api.commonFunctions
    const { isValidId } = app.api.validation

    const getDonations = async (req, res) => {
        let name = req.query.name ? req.query.name.toLowerCase() : ''
        let page = !!req.query.page ? req.query.page : 0
        let rowsPerPage = req.query.rowsPerPage ? req.query.rowsPerPage : 10

        let offset = page > 0 ? (page * rowsPerPage) + 1 : page * rowsPerPage
        let limit = parseInt(rowsPerPage) + 1 // Deixar o paginator ativo

        /* showLog(`Limit: ${limit}`)
        showLog(`Offset: ${offset}`) */

        await app.db('donations')
            .where('name'.toLowerCase(), 'like', `%${name}%`)
            .offset(offset)
            .limit(limit)
            .then(donations => {
                return res.status(200).send(donations)
            })
            .catch(err => {
                showAndRegisterError(err, path.basename(__filename))
                return res.status(500).send(err)
            })
    }

    const getDonationById = async (req, res) => {
        const idDonation = isValidId(req.params.id) && req.params.id
        if (!idDonation) return res.status(400).send('Não foi possível localizar doação!')

        await app.db('donations')
            .first()
            .where({ id: idDonation })
            .then(donation => res.status(200).json(donation))
            .catch(err => {
                showAndRegisterError(err, path.basename(__filename))
                return res.status(500).send('Ocorreu um erro ao obter os dados da doação!')
            })
    }

    const changeStateOfDonation = async (req, res) => {
        const idDonation = isValidId(req.params.id) && req.params.id
        if (!idDonation) return res.status(400).send('Não foi possível localizar doação!')

        if (req.params.state != 'true' && req.params.state != 'false') return res.status(400).send('Não foi informado um estado válido para a verificação da doação!')
        const donationReceived = req.params.state == 'true' ? 1 : 0

        await app.db('donations')
            .update({ donationReceived })
            .where({ id: idDonation })
            .then(_ => res.status(200).send())
            .catch(err => {
                showAndRegisterError(err, path.basename(__filename))
                return res.status(500).send(err)
            })
    }

    const numberOfDonationsReceived = async (req, res) => {
        const donationTypes = ['money', 'portion', 'medicines', 'others']

        await res.status(200).send('test')
        let donationsReceived = await mapDonationTypes(donationTypes)
        donationsReceivedObject = await donationsReceived.reduce((total, current) => {
            return { ...total, ...current } // Transforma array em objeto
        }, {})

        await res.status(200).send(donationsReceivedObject)
    }

    const mapDonationTypes = async (donationTypes) => {
        return await Promise.all(donationTypes.map(async donationType => {
            const count = await countDonationType(donationType)
            return { [donationType]: count }
        }))
    }

    const countDonationType = async (donationType) => {
        const count = await app.db('donations')
            .count(`donationType as ${donationType}`)
            .where({ donationType: donationType })
            // .where({ donationReceived: 1 }) TODO Somente doações recebidas ou todas?
            .then(([count]) => count[donationType])
            .catch(err => {
                showAndRegisterError(err, path.basename(__filename))
                return res.status(500).send(err)
            })

        return count
    }

    const save = async (req, res) => {
        const { existsOrError, objectIsNull } = app.api.validation

        let donation = !objectIsNull(req.body) && req.body // TODO This is a only place where not use a object in the body request  
        if (!donation) return res.status(400).send('Dados da doação não informados!')

        const userId = isValidId(req.user.id) && req.user.id
        if (!userId) return res.status(400).send('Não foi possível identificar seus dados!')

        donation.date = donation.date ? new Date(donation.date) : new Date()
        if (!donation.donationType) donation.donationType = 'others'

        try {
            if (!donation.cellNumber || !donation.name) {
                await app.db('users')
                    .select('name', 'cellNumber')
                    .where({ id: userId })
                    .then(([userData]) => donation = { ...donation, ...userData })
                    .catch(err => {
                        showAndRegisterError(err, path.basename(__filename))
                        throw 'Ocorreu um erro ao consultar dados do usuário!'
                    })
            }

            existsOrError(donation.name, 'Nome do doador não informado!')
            existsOrError(donation.cellNumber, 'Celular do doador não informado!')
            existsOrError(donation.date, 'Data não informada!')
            existsOrError(donation.description, 'Descrição não informada!')
        } catch (err) {
            return res.status(400).send(err)
        }

        if (!donation.id) {
            await app.db('donations')
                .insert(donation)
                .then(_ => res.status(204).send())
                .catch(err => {
                    showAndRegisterError(err, path.basename(__filename))
                    return res.status(500).send()
                })
        } else {
            await app.db('donations')
                .update(donation)
                .where({ id: donation.id })
                .then(_ => res.status(204).send())
                .catch(err => {
                    showAndRegisterError(err, path.basename(__filename))
                    return res.status(500).send('Erro ao cadastrar doação')
                })
        }
    }

    const removeDonation = async (req, res) => {
        const { validateRequestDataForDelete, deleteFromDatabase } = app.api.requests

        const target = 'doação'
        const targetTable = 'donations'
        let validIds

        try {
            validIds = await validateRequestDataForDelete(req, target)
        } catch (err) {
            return res.status(400).send(err)
        }

        const executed = await deleteFromDatabase(validIds, target, targetTable)

        if (executed) {
            return res.status(204).send()
        } else {
            return res.status(500).send(`Ocorreu um erro ao deletar ${target}!`)
        }
    }


    return { getDonations, getDonationById, changeStateOfDonation, numberOfDonationsReceived, save, removeDonation }
}

// 172 -> 