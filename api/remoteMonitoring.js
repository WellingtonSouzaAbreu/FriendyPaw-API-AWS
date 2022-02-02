const multer = require('multer')
const fs = require('fs')
const path = require('path')

module.exports = app => {

    const getRemoteMonitoringsByAdoption = async (req, res) => {
        const idAdoption = req.params.idAdoption
        console.log(idAdoption)

        await app.db('remote-monitorings')
            .where({ adoptionId: idAdoption })
            .then(async (remoteMonitorings) => {
                console.log(remoteMonitorings)
                const remoteMonitoringsWithPictures = await getPictures(remoteMonitorings)
                return res.status(200).send(remoteMonitoringsWithPictures)
            })
            .catch(err => {
                console.log(err)
                app.api.bugReport.writeInBugReport(err, path.basename(__filename))
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
                    console.log(err)
                    app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                    console.log('Erro ao obter imagens de monitoramento')
                })
        }

        return remoteMonitorings
    }

    const save = async (req, res) => {
        const { existsOrError, objectIsNull } = app.api.validation

        const remoteMonitoring = await objectIsNull(req.body.remoteMonitoring) ? res.status(400).send('Dados do monitoramento remoto não informados') : req.body.remoteMonitoring
        remoteMonitoring.date = new Date()


        try {
            existsOrError(remoteMonitoring.date, 'Data não informada')
            existsOrError(remoteMonitoring.observations, 'Observações não informadas')
            existsOrError(remoteMonitoring.adoptionId, 'Adoção não informada')
        } catch (err) {
            return res.status(400).send(err)
        }

        await app.db('remote-monitorings')
            .insert(remoteMonitoring)
            .then(id => res.status(200).json(id[0]))
            .catch(err => {
                console.log(err)
                app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                res.status(500).send('Erro ao cadastrar monitoramento remoto')
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

            console.log(req.body)

            let remoteMonitoringPicture = {
                imageURL: req.file.filename,
                remoteMonitoringId: req.body.remoteMonitoringId
            }

            app.db('remote-monitoring-pictures')
                .insert(remoteMonitoringPicture)
                .then(_ => res.status(204).send())
                .catch(err => {
                    console.log(err)
                    app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                    res.status(500).send(err)
                })
        })
    }

    const removeRemoteMonitoring = async (req, res) => {
        const idRemoteMonitoring = req.params.id ? req.params.id : res.status(400).send('Identificação do monitoramento remoto não informada')

        let remoteMonitoringsId = idRemoteMonitoring.split(',')
        console.log(remoteMonitoringsId)

        remoteMonitoringsId.forEach(async (idRemoteMonitoring) => {
            await app.db('remote-monitorings')
                .where({ id: idRemoteMonitoring })
                .del()
                .then(_ => console.log(`Monitoramento remoto de id: ${idRemoteMonitoring} deletado`))
                .catch(err => {
                    console.log(err)
                    app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                    res.status(500).send('Ocorreu um erro ao deletar monitoramento remoto')
                })

            await app.db('remote-monitoring-pictures')
                .select('imageURL')
                .where({ remoteMonitoringId: idRemoteMonitoring })
                .then(async imagesURL => {
                    if (imagesURL.length > 0) {
                        await deleteSavedFiles(imagesURL)
                    }
                })
                .catch(err => {
                    console.log(err)
                    app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                    console.log('Erro ao remover imagens anteriores')
                })

            await app.db('remote-monitoring-pictures')
                .select('imageURL')
                .where({ remoteMonitoringId: idRemoteMonitoring })
                .del()
                .then(_ => console.log('Registros deletados!'))
                .catch(err => {
                    console.log(err)
                    app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                    console.log('Erro ao remover registros anteriores')
                })
        })

        res.status(200).send('Monitoramento remoto removido com sucesso!')
    }

    const deleteSavedFiles = async (imagesURL) => {
        for (imageURL of imagesURL) {
            await deleteFile(`${__dirname}/../_remoteMonitoringPictures/${imageURL.imageURL}`)
        }
    }

    const deleteFile = (filePath) => {
        fs.unlink(filePath, (err) => {
            if (!err) {
                console.log('Arquivo deletado com sucesso!');
            } else {
                console.log(err)
                app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                console.log('Erro ao deletar arquivo.');
            }
        })
    }

    return { getRemoteMonitoringsByAdoption, save, savePicture, removeRemoteMonitoring }
}