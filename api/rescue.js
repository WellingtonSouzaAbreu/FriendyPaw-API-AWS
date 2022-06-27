const path = require('path')

module.exports = app => {
    const { showAndRegisterError } = app.api.commonFunctions
    const { isValidId } = app.api.validation

    const getRescueByAnimalId = async (req, res) => {
        const animalId = isValidId(req.params.animalId) && req.params.animalId
        if (!animalId) return res.status(400).send('Animal não identificado!')

        await app.db('rescues')
            .where({ animalId })
            .first()
            .then(rescue => res.status(200).send(rescue))
            .catch(err => {
                showAndRegisterError(err, path.basename(__filename))
                return res.status(500).send(err)
            })
    }

    const update = async (req, res) => {
        const { existsOrError, objectIsNull } = app.api.validation
        const { convertStringToDate } = app.api.commonFunctions

        const rescue = !objectIsNull(req.body.rescue) && req.body.rescue
        if (!rescue) return res.status(400).send('Dados do resgate não informados!')

        if (!isValidId(rescue.animalId)) rescue.animalId = req.params.animalId

        delete rescue.collaboratorsId

        try {
            existsOrError(rescue.dateOfRescue, 'Data não informado!')
            existsOrError(rescue.address, 'Endereço não informado!')
            existsOrError(isValidId(rescue.animalId), 'Animal não informado!')
            existsOrError(isValidId(rescue.veterinaryCareId), 'Cuidado veterinário não informado!')
        } catch (err) {
            showAndRegisterError(err, path.basename(__filename))
            return res.status(400).send(err)
        }

        rescue.dateOfRescue = convertStringToDate(rescue.dateOfRescue)

        console.log('rescue.id: ' + rescue.id)
        console.log('rescue.animalId: ' + rescue.animalId)

        if (rescue.id) {
            await app.db('rescues')
                .update(rescue)
                .where({ id: rescue.id })
                .then(_ => res.status(204).send())
                .catch(err => {
                    showAndRegisterError(err, path.basename(__filename))
                    return res.status(500).send()
                })
        } else {
            await app.db('rescues')
                .update(rescue)
                .where({ animalId: rescue.animalId }) // UNIQUE
                .then(_ => res.status(204).send())
                .catch(err => {
                    showAndRegisterError(err, path.basename(__filename))
                    return res.status(500).send()
                })
        }
    }

    return { getRescueByAnimalId, update }
}

// 73 -> 69