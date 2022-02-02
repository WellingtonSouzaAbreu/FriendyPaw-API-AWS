const path = require('path')

module.exports = app => {

    const getRescue = async(req,res) => {
        const animalId = req.params.animalId ? req.params.animalId : res.status(400).send('Animal não identificado')

        await app.db('rescues')
            .where({animalId: animalId})
            .first()
            .then(rescue => res.status(200).send(rescue))
            .catch(err => {
                console.log(err)
                app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                res.status(500).send(err)
            })
    }

    const update = async (req, res) => {
        const { existsOrError, objectIsNull } = app.api.validation

        console.log(req.body.rescue)

        const rescue = await objectIsNull(req.body.rescue) ? res.status(400).send('Dados do resgate não informados') : req.body.rescue
        rescue.animalId = req.params.animalId ? req.params.animalId : res.status(400).send('Animal não identificado')
        
        let collaboratorsId = rescue.collaboratorsId
        delete rescue.collaboratorsId

        try {
            existsOrError(rescue.dateOfRescue, 'Data não informado')
            existsOrError(rescue.address, 'Endereço não informado')
            existsOrError(rescue.animalId, 'Animal não informado')
            existsOrError(rescue.veterinaryCareId, 'Cuidado veterinário não informado')
        } catch (err) {
            return res.status(400).send(err)
        }

        rescue.dateOfRescue = new Date(rescue.dateOfRescue)

        let idRescue
        await app.db('rescues')
            .update(rescue)
            .where({id: rescue.id})
            .then(id => /* idRescue = id[0] */ res.status(200).send())
            .catch(err => {
                console.log(err)
                app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                res.status(500).send()
            })

        /* let collaboratorsData = []
        for (collaboratorId of collaboratorsId) {
            collaboratorsData.push({ collaboratorId: collaboratorId, rescueId: idRescue })
        }

        if (collaboratorsData.length < 1) {
            res.status(204).send()
        } else {
            await app.db('collaborators-involveds-in-rescue')
                .insert(collaboratorsData)
                .then(_ => res.status(204).send())
                .catch(err => {
                    console.log(err)
                    app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                    res.status(500).send('Erro ao cadastrar collaboradores envolvidos no resgate')
                })
        } */

    }

    return {getRescue, update }
}

