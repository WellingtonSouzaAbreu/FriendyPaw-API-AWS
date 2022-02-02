const path = require('path')

module.exports = app => {

    const getVisitsByAdoption = async (req, res) => {
        await app.db('visits')
            .where({ adoptionId: req.params.idAdoption })
            .then(visits => {
                res.status(200).send(visits)
            })
            .catch(err => {
                console.log(err)
                app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                res.status(500).send(err)
            })
    }

    const save = async (req, res) => {
        const { existsOrError, objectIsNull } = app.api.validation

        const visit = await objectIsNull(req.body.visit) ? res.status(400).send('Dados da visita não informados') : req.body.visit

        try {
            existsOrError(visit.report, 'Relatório não informado')
            existsOrError(visit.adoptionId, 'Adoção não informada')
            existsOrError(visit.date, 'Data não informada')
        } catch (err) {
            return res.status(400).send(err)
        }

        visit.date = new Date(visit.date)

        await app.db('visits')
            .insert(visit)
            .then(_ => res.status(204).send())
            .catch(err => {
                console.log(err)
                app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                res.status(500).send('Erro ao cadastrar visita')
            })
    }

    const removeVisit = async (req, res) => {
        const idVisit = req.params.id ? req.params.id : res.status(400).send('Identificação da visita não informada')

        let visitsId = idVisit.split(',')
        console.log(visitsId)

        visitsId.forEach(async (idVisit) => {
            await app.db('visits')
                .where({ id: idVisit })
                .del()
                .then(_ => console.log(`Visita de id: ${idVisit} deletado`))
                .catch(err => {
                    console.log(err)
                    app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                    res.status(500).send('Ocorreu um erro ao deletar visit')
                })
        })

        res.status(200).send('Animal removido com sucesso!')
    }

    return { getVisitsByAdoption, save, removeVisit }
}