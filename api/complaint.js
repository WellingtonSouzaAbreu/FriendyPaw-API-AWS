const path = require('path')

module.exports = app => {

    const { showLog, showAndRegisterError } = app.api.commonFunctions
    const { isValidId } = app.api.validation

    const getComplaints = async (req, res) => {
        let city = req.query.city ? req.query.city.toLowerCase() : ''
        let page = !!req.query.page ? req.query.page : 0
        let rowsPerPage = req.query.rowsPerPage ? req.query.rowsPerPage : 10

        let offset = page > 0 ? (page * rowsPerPage) + 1 : page * rowsPerPage
        let limit = parseInt(rowsPerPage) + 1 // Deixar o paginator ativo

        // showLog(`Limit: ${limit}`)
        // showLog(`Offset: ${offset}`)

        await app.db('complaints')
            .where('city'.toLowerCase(), 'like', `%${city}%`)
            .offset(offset)
            .limit(limit)
            .then(complaints => res.status(200).send(complaints))
            .catch(err => {
                showAndRegisterError(err, path.basename(__filename))
                return res.status(500).send(err)
            })
    }

    const getComplaintById = async (req, res) => {
        const idComplaint = isValidId(req.params.id) && req.params.id
        if (!idComplaint) return res.status(400).send('Não foi possível localizar denúncia!')

        await app.db('complaints')
            .first()
            .where({ id: idComplaint })
            .then(complaint => res.status(200).json(complaint))
            .catch(err => {
                showAndRegisterError(err, path.basename(__filename))
                return res.status(500).send('Ocorreu um erro ao obter os dados da denúncia!')
            })
    }

    const changeStateOfComplaint = async (req, res) => {
        const idComplaint = isValidId(req.params.id) && req.params.id
        if (!idComplaint) return res.status(400).send('Não foi possível localizar denúncia!')

        if (req.params.state != 'true' && req.params.state != 'false') return res.status(400).send('Não foi informado um estado válido para a verificação de denúncia!')
        const verified = req.params.state == 'true' ? 1 : 0

        await app.db('complaints')
            .update({ verified: verified })
            .where({ id: idComplaint })
            .then(_ => res.status(200).send())
            .catch(err => {
                showAndRegisterError(err, path.basename(__filename))
                return res.status(500).send(err)
            })
    }

    const save = async (req, res) => {
        const { existsOrError, objectIsNull } = app.api.validation

        const complaint = !objectIsNull(req.body.complaint) && req.body.complaint
        if (!complaint) return res.status(400).send('Dados da denúncia não informados!')

        complaint.date = complaint.date && new Date()

        try {
            existsOrError(complaint.description, 'Descrição não informado!')
            existsOrError(complaint.address, 'Endereço não informada!')
            existsOrError(complaint.complaintType, 'Motivo da denúncia não informado!')
            existsOrError(complaint.city, 'Cidade não informada!')
            existsOrError(complaint.district, 'Bairro não informado!')
            existsOrError(complaint.date, 'Data não informada!')
        } catch (err) {
            return res.status(400).send(err)
        }

        await app.db('complaints')
            .insert(complaint)
            .then(_ => res.status(204).send())
            .catch(err => {
                showAndRegisterError(err, path.basename(__filename))
                return res.status(500).send('Erro ao cadastrar denúncia!')
            })
    }

    const removeComplaint = async (req, res) => {
        const { validateRequestDataForDelete, deleteFromDatabase } = app.api.requests

        const target = 'denúncia'
        const targetTable = 'complaints'
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

    return { getComplaints, getComplaintById, changeStateOfComplaint, save, removeComplaint }
}


// 93 -> 