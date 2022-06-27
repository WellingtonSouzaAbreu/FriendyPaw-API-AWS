const path = require('path')

module.exports = app => {
    const { existsOrError, objectIsNull, isNumber , isValidId} = app.api.validation
    const { showLog, showAndRegisterError, convertStringToDate, convertStringWithCommaToArray } = app.api.commonFunctions

    const getVeterinaryCareById = async (req, res) => {
        const idVeterinaryCare = isValidId(req.params.id) && req.params.id
        if (!idVeterinaryCare) return res.status(400).send('Não foi possível encontrar o cuidado veterinário selecionado!')

        await app.db('veterinary-cares')
            .where({ id: idVeterinaryCare })
            .first()
            .then(veterinaryCare => res.status(200).json(veterinaryCare))
            .catch(err => {
                showAndRegisterError(err, path.basename(__filename))
                return res.status(500).send('Ocorreu um erro ao obter cuidado veterinário!')
            })
    }

    const save = async (req, res) => {
        const veterinaryCare = !objectIsNull(req.body.veterinaryCare) && req.body.veterinaryCare
        if (!veterinaryCare) return res.status(400).send('Dados do cuidado veterinário não informados!')

        try {
            existsOrError(veterinaryCare.veterinaryName, 'Nome do veterinário não informado!')
            existsOrError(veterinaryCare.totalCostOfTreatment, 'Custo total do tratamento não informado!')
            existsOrError(veterinaryCare.dateOfVeterinaryCare, 'Data não informada!')
            if (!isNumber(veterinaryCare.totalCostOfTreatment)) throw 'Informe um valor numérico nos custos veterinários!'

        } catch (err) {
            showAndRegisterError(err, path.basename(__filename))
            return res.status(400).send(err)
        }

        veterinaryCare.dateOfVeterinaryCare = convertStringToDate(veterinaryCare.dateOfVeterinaryCare)

        await app.db('veterinary-cares')
            .insert(veterinaryCare)
            .then(_ => res.status(204).send())
            .catch(err => {
                showAndRegisterError(err, path.basename(__filename))
                return res.status(500).send('Ocorreu um erro ao cadastrar cuidado veterinário!')
            })
    }

    const update = async (req, res) => {
        const veterinaryCare = !objectIsNull(req.body.veterinaryCare) && req.body.veterinaryCare
        if (!veterinaryCare) return res.status(400).send('Dados do cuidado veterinário não informados!')

        try {
            existsOrError(veterinaryCare.id, 'Não foi possível identificar o cuidado veterinário atual!')
            existsOrError(isValidId(veterinaryCare.id), 'Identificador inválido!')
        } catch (err) {
            return res.status(400).send(err)
        }

        veterinaryCare.dateOfVeterinaryCare = convertStringToDate(veterinaryCare.dateOfVeterinaryCare)

        await app.db('veterinary-cares')
            .update(veterinaryCare)
            .where({ id: veterinaryCare.id })
            .then(_ => res.status(204).send())
            .catch(err => {
                showAndRegisterError(err, path.basename(__filename))
                return res.status(500).send('Ocorreu um erro ao atualizar cuidado veterinário!')
            })
    }

    const removeVeterinaryCare = async (req, res) => {
        const idVeterinaryCare = req.params.id && req.params.id
        if (!idVeterinaryCare) return res.status(400).send('Identificação do cuidado veterinário não informado!')

        let veterinaryCaresId = convertStringWithCommaToArray(idVeterinaryCare)

        const validIds = veterinaryCaresId.filter(id => isValidId(id))
        if(!validIds.length) return res.status(400).send('Não foi informado nenhum identificador válido!')

        validIds.forEach(async (id) => {
            await app.db('veterinary-cares')
                .where({ id })
                .del()
                .then(_ => showLog(`Cuidado veterinário de id: ${id} deletado`))
                .catch(err => {
                    showAndRegisterError(err, path.basename(__filename))
                    return res.status(500).send('Ocorreu um erro ao deletar cuidado veterinário!')
                })
        })

        return res.status(204).send()
    }
    return {
        getVeterinaryCareById,
        save,
        update,
        removeVeterinaryCare
    }
}

// 67 -> 