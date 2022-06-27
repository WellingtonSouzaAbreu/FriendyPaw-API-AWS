const { response } = require('express')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

module.exports = app => {

    const getPublicationById = async (req, res) => {
        const idPublication = req.params.id ? req.params.id : res.status(400).send('Identificação da publicação não informada')

        await app.db('publications')
            .where({ id: idPublication })
            .first()
            .then(async (publication) => {
                publication.imagesURL = await getAllPulicationPictures(idPublication)
                res.status(200).send(publication)
            })
            .catch(err => {
                console.log(err)
                // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                res.status(500).send(err)
            })
    }

    const getAllPulicationPictures = async (idPublication) => {
        return await app.db('publications-pictures')
            .select('id', 'imageURL')
            .where({ publicationId: idPublication })
            .then(imagesURL => imagesURL)
            .catch(err => {
                console.log(err)
                // // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                throw err
            })
    }

    const getPublications = async (req, res) => {
        await app.db('publications')
            .then(publications => res.status(200).send(publications))
            .catch(err => {
                console.log(err)
                // // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                res.status(500).send(err)
            })
    }

    const getPublicationsSummarized = async (req, res) => {
        let title = req.query.title ? req.query.title.toLowerCase() : ''
        let page = !!req.query.page ? req.query.page : 0
        let rowsPerPage = req.query.rowsPerPage ? req.query.rowsPerPage : 10

        console.log(req.query)

        let offset = page > 0 ? (page * rowsPerPage) + 1 : page * rowsPerPage
        let limit = parseInt(rowsPerPage) + 1 // Deixar o paginator ativo

        console.log(`Limit: ${limit}`)
        console.log(`Offset: ${offset}`)

        await app.db('publications')
            .select('id', 'title', 'startDateTime', 'publicationType')
            .where('title'.toLowerCase(), 'like', `%${title}%`)
            .offset(offset)
            .limit(limit)
            .then(publications => res.status(200).send(publications))
            .catch(err => {
                console.log(err)
                // // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                res.status(500).send(err)
            })
    }

    const getEvents = async (req, res) => {
        await app.db('publications')
            .where({ publicationType: 'event' })
            .where('endDateTime', '>', new Date(new Date().getTime() - 3600000))
            .orderBy('startDateTime')
            .then(async events => {
                console.log(events)
                events = await browseEvents(events)
                res.status(200).send(events)
            })
            .catch(err => {
                console.log(err)
                // // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                res.status(500).send(err)
            })
    }

    const browseEvents = async (events) => {
        for (let event of events) {
            event.imagesURL = await getAllPulicationPictures(event.id)
        }
        return events
    }

    const getDones = async (req, res) => {
        await app.db('publications')
            .select('id', 'title', 'startDateTime', 'history', 'reasonRescue', 'animalName')
            .where({ publicationType: 'done' })
            .where('endDateTime', '>', new Date(new Date().getTime() - 3600000))
            .orderBy('startDateTime')
            .then(async dones => {
                dones = await browseDones(dones)
                console.log(dones)
                res.status(200).send(dones)
            })
            .catch(err => {
                console.log(err)
                // // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                res.status(500).send(err)
            })
    }

    const browseDones = async (dones) => {
        for (done of dones) {
            done.imagesURL = await getAllPulicationPictures(done.id)
        }
        return dones
    }

    const save = async (req, res) => {
        const { existsOrError, objectIsNull } = app.api.validation

        const publication = await objectIsNull(req.body.publication) ? res.status(400).send('Dados da publicação não informados') : req.body.publication

        publication.startDateTime = new Date((new Date((publication.startDateTime.split('Z')[0])).getTime()) - 14400000)// Subtraindo 4 horas
        publication.endDateTime = new Date((new Date((publication.endDateTime.split('Z')[0])).getTime()) - 14400000)// Subtraindo 4 horas

        try {
            existsOrError(publication.startDateTime, 'Data de inicio da publicação não informada')
            existsOrError(publication.endDateTime, 'Data de encerramento da publicação não informada')
            existsOrError(publication.publicationType, 'Tipo de publicação não informada')
            existsOrError(publication.title, 'Título não informado')

            if (publication.publicationType == 'event') {
                existsOrError(publication.description, 'Descrição não informada')
                existsOrError(publication.city, 'Cidade não informada')
                existsOrError(publication.district, 'Bairro não informado')
                existsOrError(publication.address, 'Endereço não informado')
            } else {
                existsOrError(publication.animalName, 'Nome do animal não informado')
                existsOrError(publication.history, 'História não informada')
                existsOrError(publication.reasonRescue, 'Razão do resgate não informada')
            }
        } catch (err) {
            return res.status(400).send(err)
        }

        console.log(publication)

        if (!publication.id) {
            await app.db('publications')
                .insert(publication)
                .then(id => res.status(200).json(id[0]))
                .catch(err => {
                    console.log(err)
                    // // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                    res.status(500).send('Erro ao cadastrar publicação')
                })
        } else {
            await app.db('publications')
                .update(publication)
                .where({ id: publication.id })
                .then(id => res.status(200).json(publication.id))
                .catch(err => {
                    console.log(err)
                    // // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                    res.status(500).send('Erro ao cadastrar publicação')
                })
        }
    }

    const savePicture = async (req, res) => {

        const storage = multer.diskStorage({ // Objeto para configurar a pasta de salvamento e o nome 
            destination: function (req, file, callback) {
                callback(null, './_publicationPictures') // Pasta de destino
            },
            filename: function (req, file, callback) {
                callback(null, `${Date.now()}_${file.originalname}`)
            }
        })

        const upload = multer({ storage }).single('publicationPicture')

        upload(req, res, err => {
            if (err) {
                return res.end('Erro ao fazer upload da(s) imagem(s)')
            }
            console.log(req.file)

            let publicationPicture = {
                imageURL: req.file.filename,
                publicationId: req.body.publicationId
            }

            //Deletar as ultimas publication-pictures 
            app.db('publications-pictures')
                .select('imageURL')
                .where({ publicationId: publicationPicture.publicationId })
                .then(async (imagesURL) => {

                    console.log(imagesURL)

                    if (imagesURL.length > 0) {
                        await deleteSavedFiles(imagesURL)

                        await app.db('publications-pictures')
                            .select('imageURL')
                            .where({ publicationId: publicationPicture.publicationId })
                            .del()
                            .then(_ => console.log('Registros deletados!'))
                            .catch(err => {
                                console.log(err)
                                // // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                                console.log('Erro ao remover registros anteriores')
                            })
                        console.log('Registros anteriores deletados')

                    }

                    await app.db('publications-pictures')
                        .insert(publicationPicture)
                        .then(_ => res.status(204).send())
                        .catch(err => {
                            console.log(err)
                            // // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                            res.status(500).send(err)
                        })
                })
                .catch(err => {
                    console.log(err)
                    // // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                })
        })
    }

    const deleteSavedFiles = async (imagesURL) => {
        for (imageURL of imagesURL) {
            await deleteFile(`${__dirname}/../_publicationPictures/${imageURL.imageURL}`)
        }
    }

    const deleteFile = (filePath) => {
        fs.unlink(filePath, (err) => {
            if (!err) {
                console.log('Arquivo deletado com sucesso!');
            } else {
                console.log(err)
                // // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                console.log('Erro ao deletar arquivo.');
            }
        })
    }

    const removePublication = async (req, res) => {
        const idPublication = req.params.id ? req.params.id : res.status(400).send('Identificação da publicação não informada')

        let publicationsId = idPublication.split(',')

        publicationsId.forEach(async (idPublication) => {
            await app.db('publications')
                .where({ id: idPublication })
                .del()
                .then(_ => console.log(`Publicação de id: ${idPublication} deletada`))
                .catch(err => {
                    console.log(err)
                    // // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                    res.status(500).send('Ocorreu um erro ao deletar publicação')
                })

            await app.db('publications-pictures')
                .select('imageURL')
                .where({ publicationId: idPublication })
                .then(async imagesURL => {
                    if (imagesURL.length > 0) {
                        await deleteSavedFiles(imagesURL)
                    }
                })
                .catch(err => {
                    console.log(err)
                    // // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                    console.log('Erro ao remover imagens anteriores')
                })

            await app.db('publications-pictures')
                .select('imageURL')
                .where({ publicationId: idPublication })
                .del()
                .then(_ => console.log('Registros deletados!'))
                .catch(err => {
                    console.log(err)
                    // // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                    console.log('Erro ao remover registros anteriores')
                })
        })

        await res.status(200).send('Publicações removidas com sucesso!')

    }

    return { getPublicationById, getPublications, getPublicationsSummarized, getEvents, getDones, save, savePicture, removePublication }
}