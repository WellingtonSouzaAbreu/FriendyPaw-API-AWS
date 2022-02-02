const path = require('path')

module.exports = app => {

    const getComplaints = async (req, res) => {
        let city = req.query.city ? req.query.city.toLowerCase() : ''
        let page = !!req.query.page ? req.query.page : 0
        let rowsPerPage = req.query.rowsPerPage ? req.query.rowsPerPage : 10

        let offset = page > 0 ? (page * rowsPerPage) + 1 : page * rowsPerPage
        let limit = parseInt(rowsPerPage) + 1 // Deixar o paginator ativo

        console.log(`Limit: ${limit}`)
        console.log(`Offset: ${offset}`)

        await app.db('complaints')
            .where('city'.toLowerCase(), 'like', `%${city}%`)
            .offset(offset)
            .limit(limit)
            .then(complaints => res.status(200).send(complaints))
            .catch(err => {
                console.log(err)
                app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                res.status(500).send(err)
            })
    }

    const changeStateOfComplaint = async (req, res) => {
        const id = req.params.id
        const verified = req.params.state == 'true' ? 1 : 0

        console.log(id + ' - ' + verified)

        await app.db('complaints')
            .update({ verified: verified })
            .where({ id: id })
            .then(_ => res.status(200).send())
            .catch(err => {
                console.log(err)
                app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                res.status(500).send(err)
            })
    }

    const save = async (req, res) => {
        const { existsOrError, objectIsNull } = app.api.validation

        const complaint = await objectIsNull(req.body.complaint) ? res.status(400).send('Dados da denúncia não informados') : req.body.complaint
        complaint.date = new Date()

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
                console.log(err)
                app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                res.status(500).send('Erro ao cadastrar denúncia')
            })
    }

    const removeComplaint = async (req, res) => {
        const idComplaint = req.params.id ? req.params.id : res.status(400).send('Identificação da denúncia não informada')

        let complaintsId = idComplaint.split(',')

        complaintsId.forEach(async (idComplaint) => {
            await app.db('complaints')
                .where({ id: idComplaint })
                .del()
                .then(_ => console.log(`Denúncia de id: ${idComplaint} deletada`))
                .catch(err => {
                    console.log(err)
                    app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                    res.status(500).send('Ocorreu um erro ao deletar Denúncia')
                })
        })

        res.status(200).send('Denúncias removidas com sucesso!')
    }

    return { getComplaints, changeStateOfComplaint, save, removeComplaint }
}