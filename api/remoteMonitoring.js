const multer = require('multer')
const path = require('path')

module.exports = app => {

    const { showLog, showAndRegisterError } = app.api.commonFunctions
    const { isValidId } = app.api.validation

    const getRemoteMonitoringsByAdoption = async (req, res) => {
        const adoptionId = isValidId(req.params.adoptionId) && req.params.adoptionId
        if (!adoptionId) return res.status(400).send('Não foi possível identificar a adoção!')

        showLog(adoptionId)

        await app.db('remote-monitorings')
            .where({ adoptionId })
            .then(async (remoteMonitorings) => {
                showLog(remoteMonitorings)
                const remoteMonitoringsWithPictures = await getPictures(remoteMonitorings)
                return res.status(200).send(remoteMonitoringsWithPictures)
            })
            .catch(err => {
                showAndRegisterError(err, path.basename(__filename))
                return res.status(500).send(err)
            })
    }

    const getPictures = async (remoteMonitorings) => {
        for (remoteMonitoring of remoteMonitorings) {
            remoteMonitoring.imagesURL = []
            remoteMonitoring.imagesURL = await app.db('remote-monitoring-pictures')
                .where({ remoteMonitoringId: remoteMonitoring.id })
                .then(imageURL => {
                    return imageURL.map(imageURL => imageURL.imageURL)
                })
                .catch(err => {
                    showAndRegisterError(err, path.basename(__filename))
                    showLog('Erro ao obter imagens de monitoramento')
                })
        }

        return remoteMonitorings
    }

    const save = async (req, res) => {
        const { existsOrError, objectIsNull } = app.api.validation

        const remoteMonitoring = !objectIsNull(req.body.remoteMonitoring) && req.body.remoteMonitoring
        if (!remoteMonitoring) return res.status(400).send('Dados do monitoramento remoto não informados!')

        remoteMonitoring.date = new Date()

        try {
            existsOrError(remoteMonitoring.date, 'Data não informada!')
            existsOrError(remoteMonitoring.observations, 'Observações não informadas!')
            existsOrError(remoteMonitoring.adoptionId, 'Adoção não informada!')
        } catch (err) {
            return res.status(400).send(err)
        }

        await app.db('remote-monitorings')
            .insert(remoteMonitoring)
            .then(id => res.status(200).json(id[0]))
            .catch(err => {
                showAndRegisterError(err, path.basename(__filename))
                return res.status(500).send('Erro ao cadastrar monitoramento remoto')
            })
    }

    const savePicture = async (req, res) => {

        const storage = multer.diskStorage({ // Objeto para configurar a pasta de salvamento e o nome 
            destination: function (req, file, callback) {
                callback(null, './_remoteMonitoringPictures') // Pasta de destino
            },
            filename: function (req, file, callback) {
                callback(null, `${Date.now()}_${file.originalname}`)
            }
        })

        const upload = multer({ storage }).single('remoteMonitoringPicture')

        upload(req, res, err => {
            if (err) {
                return res.end('Erro ao fazer upload da(s) imagem(s)')
            }

            showLog(req.body)

            let remoteMonitoringPicture = {
                imageURL: req.file.filename,
                remoteMonitoringId: req.body.remoteMonitoringId
            }

            app.db('remote-monitoring-pictures')
                .insert(remoteMonitoringPicture)
                .then(_ => res.status(204).send())
                .catch(err => {
                    showAndRegisterError(err, path.basename(__filename))
                    return res.status(500).send(err)
                })
        })
    }

    const removeRemoteMonitoring = async (req, res) => {
        const { validateRequestDataForDelete, deleteFromDatabase, deleteFromPictureDatabase } = app.api.requests

        const target = 'monitoramento remoto'
        const targetTable = 'remote-monitorings'
        const secondaryTarget = 'imagens'
        const secondaryTargetTable = 'remote-monitoring-pictures'
        const fieldNameWhere = 'remoteMonitoringId'
        let validIds

        try {
            validIds = await validateRequestDataForDelete(req, target)
        } catch (err) {
            return res.status(400).send(err)
        }

        const unlinkedPicture = await deleteFromPictureDatabase(validIds, secondaryTargetTable, fieldNameWhere)
        const executed = await deleteFromDatabase(validIds, target, targetTable) && await deleteFromDatabase(validIds, secondaryTarget, secondaryTargetTable, fieldNameWhere)

        if (executed && unlinkedPicture) {
            return res.status(204).send()
        } else {
            return res.status(500).send(`Ocorreu um erro ao deletar ${target}!`)
        }
    }
    return { getRemoteMonitoringsByAdoption, save, savePicture, removeRemoteMonitoring }
}

// 150 -> 