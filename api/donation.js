const path = require('path')

module.exports = app => {

    const getDonations = async (req, res) => {
        let name = req.query.name ? req.query.name.toLowerCase() : ''
        let page = !!req.query.page ? req.query.page : 0
        let rowsPerPage = req.query.rowsPerPage ? req.query.rowsPerPage : 10

        let offset = page > 0 ? (page * rowsPerPage) + 1 : page * rowsPerPage
        let limit = parseInt(rowsPerPage) + 1 // Deixar o paginator ativo

        /* console.log(`Limit: ${limit}`)
        console.log(`Offset: ${offset}`) */

        await app.db('donations')
            .where('name'.toLowerCase(), 'like', `%${name}%`)
            .offset(offset)
            .limit(limit)
            .then(donations => {
                console.log(donations)
                res.status(200).send(donations)
            })
            .catch(err => {
                console.log(err)
                app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                res.status(500).send(err)
            })
    }

    const changeStateOfDonation = async (req, res) => {
        const donationState = req.params.state == 'true' ? 1 : 0

        console.log(donationState)

        await app.db('donations')
            .update({ donationReceived: donationState })
            .where({ id: req.params.id })
            .then(_ => res.status(200).send())
            .catch(err => {
                console.log(err)
                app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                res.status(500).send(err)
            })
    }

    const numberOfDonationsReceived = async (req, res) => {
        const donationTypes = ['money', 'portion', 'medicines', 'others']

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
                console.log(err)
                app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                res.status(500).send(err)
            })

        return count
    }

    const save = async (req, res) => {
        const { existsOrError, objectIsNull } = app.api.validation

        let donation = await objectIsNull(req.body) ? res.status(400).send('Dados da doação não informados') : req.body

        const userId = req.user.id
        console.log(donation)
        donation.date = donation.data ? new Date(donation.date) : new Date()

        if (!donation.donationType) donation.donationType = 'others'

        try {

            if (!donation.cellNumber || !donation.name) {
                await app.db('users')
                    .select('name', 'cellNumber')
                    .where({ id: userId })
                    .then(([userData]) => donation = { ...donation, ...userData })
                    .catch(err => {
                        console.log(err)
                        app.api.bugReport.writeInBugReport(err, path.basename(__filename))
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
                    console.log(err)
                    app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                    res.status(500).send()
                })
        } else {
            console.log('ToEdit')
            console.log(donation)
            await app.db('donations')
                .update(donation)
                .where({ id: donation.id })
                .then(_ => res.status(204).send())
                .catch(err => {
                    console.log(err)
                    app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                    res.status(500).send('Erro ao cadastrar doação')
                })
        }
    }

    const removeDonation = async (req, res) => {
        const idDonation = req.params.id ? req.params.id : res.status(400).send('Identificação da publicação não informada')

        let donationsId = idDonation.split(',')

        donationsId.forEach(async (idDonation) => {
            await app.db('donations')
                .where({ id: idDonation })
                .del()
                .then(_ => console.log(`Doação de id: ${idDonation} deletada`))
                .catch(err => {
                    console.log(err)
                    app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                    res.status(500).send('Ocorreu um erro ao deletar doação')
                })
        })

        res.status(200).send('Doações removidas com sucesso!')
    }


    return { getDonations, changeStateOfDonation, numberOfDonationsReceived, save, removeDonation }
}