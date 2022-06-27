const multer = require('multer')
const fs = require('fs')
var path = require('path');

module.exports = app => {

    const getAllDataOfAnimalById = async (req, res) => {
        const idAnimal = req.params.id ? req.params.id : res.status(400).send('Identificação do animal não informada')

        await app.db('animals')
            .where({ id: idAnimal })
            .first()
            .then(async (animal) => {
                animal.aproximateAge = await estimateAge(animal.dateOfBirth)
                animal.imagesURL = await getAllAnimalPictures(idAnimal)
                animal.veterinaryCare = await getVeterinaryCare(idAnimal)
                animal.rescue = await getRescue(idAnimal)
                animal.extraInfo = await getExtraInfo(idAnimal)
                // console.log(animal.rescue)
                res.status(200).send(animal)
            })
            .catch(err => {
                console.log(err)
                // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                res.status(500).send(err)
            })
    }

    const estimateAge = (dateOfBirth) => {
        let differenceInMonths = parseInt((Date.parse(new Date()) - Date.parse(dateOfBirth)) / 1000 / 60 / 60 / 24 / 30)

        console.log(differenceInMonths) //TODO

        if (differenceInMonths <= 1) {
            return 'Alguns dias'
        }

        if (differenceInMonths > 1 && differenceInMonths <= 12) {
            return `${differenceInMonths} meses`
        }

        if (parseInt(differenceInMonths > 12) == 1) {
            return `1 ano`
        } else {
            return `${parseInt(differenceInMonths / 12)} anos`
        }
    }

    const getVeterinaryCare = async (idAnimal) => {
        return await app.db('veterinary-cares')
            .where({ animalId: idAnimal })
            .then(async veterinaryCare => {
                // veterinaryCare.costsVeterinaries = await getCostsVeterinaries(veterinaryCare.id) TODO // Os custos serão ancorados ao relatório
                return veterinaryCare
            })
            .catch(err => {
                console.log(err)
                // // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                throw err
            })
    }

    /* const getCostsVeterinaries = async (veterinaryCareId) => {
        return await app.db('costs-veterinaries')
            .where({ veterinaryCareId: veterinaryCareId })
            .then(costsVeterinaries => costsVeterinaries)
            .catch(err => {
                console.log(err)
                throw err
            })
    } */

    const getRescue = async (animalId) => {
        return await app.db('rescues')
            .where({ animalId: animalId })
            .first()
            .then(rescue => rescue)
            .catch(err => {
                console.log(err)
                // // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                throw err
            })
    }

    const getExtraInfo = async (animalId) => {
        let extraInfo = {}
        extraInfo.adopted = await app.db('adoptions')
            .where({ animalId: animalId })
            .first()
            .then(adopted => adopted ? true : false)
            .catch(err => {
                console.log(err)
                // // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
            })

        extraInfo.temporaryHome = await app.db('temporary-homes')
            .where({ animalId: animalId })
            .first()
            .then(temporaryHome => temporaryHome ? true : false)
            .catch(err => {
                console.log(err)
                // // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
            })

        extraInfo.availableToAdoption = await app.db('animals') // TODO Como saber se ele é disponível para a adpção
            .select('availableForAdoption')
            .where({ id: animalId })
            .first()
            .then(({ availableForAdoption }) => availableForAdoption ? true : false)
            .catch(err => {
                console.log(err)
                // // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
            })


        return extraInfo
    }

    const getAnimalById = async (req, res) => {
        const idAnimal = req.params.id ? req.params.id : res.status(400).send('Identificação do animal não informada')

        console.log(idAnimal)

        await app.db('animals')
            .where({ id: idAnimal })
            .first()
            .then(async (animal) => {
                console.log(animal)
                animal.aproximateAge = await estimateAge(animal.dateOfBirth)
                animal.imagesURL = await getAllAnimalPictures(idAnimal)
                // console.log(animal)
                res.status(200).send(animal)
            })
            .catch(err => {
                console.log(err)
                // // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                res.status(500).send(err)
            })
    }

    const getAllAnimalPictures = async (idAnimal) => {
        return await app.db('animal-pictures')
            .select('id', 'imageURL')
            .where({ animalId: idAnimal })
            .then(imagesURL => imagesURL)
            .catch(err => {
                console.log(err)
                // // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                throw err
            })
    }

    //TODO alimentar relatório de erros

    const getAnimals = async (req, res) => {

        await app.db('animals')
            .select('id', 'name', 'breed', 'specie', 'dateOfBirth', 'sex')
            .then(async (animals) => {
                animals = await estimateAllAges(animals)
                animals = await getAnimalMainPicture(animals)
                return res.status(200).send(animals)
            })
            .catch(err => {
                console.log(err)
                // // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                return res.status(500).send()
            })
    }

    const getAnimalsAvailableForAdoption = async (req, res) => { //TODO implementar paginação..
        let adoptedAnimalsId = await getAdoptedAnimals()
        adoptedAnimalsId = await convertToArray(adoptedAnimalsId)

        await app.db('animals')
            .select('id', 'name', 'breed', 'specie', 'dateOfBirth', 'sex')
            .where({ availableForAdoption: 1 })
            .whereNotIn('id', adoptedAnimalsId)
            .then(async (animals) => {
                animals = await estimateAllAges(animals)
                animals = await getAnimalMainPicture(animals)
                return res.status(200).send(animals)
            })
            .catch(err => {
                console.log(err)
                // // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                return res.status(500).send()
            })
    }

    const getAdoptedAnimals = async () => {
        return await app.db('adoptions')
            .select('animalId')
            .then(adoptedAnimals => adoptedAnimals)
            .catch(err => console.log('Nenhum animal foi adotado!'))
    }

    const convertToArray = async (adoptedAnimals) => {
        return adoptedAnimals.map(({ animalId }) => animalId)
    }

    const estimateAllAges = async (animals) => {
        for (animal of animals) {
            animal.aproximateAge = await estimateAge(animal.dateOfBirth)
        }
        return animals
    }

    const getAnimalMainPicture = async (animals) => {
        for (animal of animals) {
            // console.log(animal.id)
            // console.log(animal)
            await app.db('animal-pictures')
                .select('imageURL')
                .where({ animalId: animal.id })
                .first()
                .then(imageURL => animal.imageURL = imageURL ? imageURL.imageURL : null)
                .catch(err => {
                    console.log(err)
                    // // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                    throw 'Erro o obter imagem do animal'
                    // res.status(500).send(err)
                })
        }

        return animals
    }

    const getAnimalSelectOptions = async (req, res) => {
        const animalPreviousSelected = req.query.animalPreviousSelected && req.query.animalPreviousSelected

        await app.db('animals')
            .select('id', 'name', 'breed')
            .orderBy('name')
            .then(async (animals) => {
                let adoptedAnimals = await adoptedAnimalsId()
                let temporaryHomeAnimals = await temporaryHomeAnimalsId()
                animals = await animals.filter(animal => !adoptedAnimals.includes(animal.id) || animal.id == animalPreviousSelected)
                animals = await animals.filter(animal => !temporaryHomeAnimals.includes(animal.id))
                res.status(200).send(animals)
            })
            .catch(err => {
                console.log(err)
                // // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                res.status(500).send(err)
            })
    }

    const adoptedAnimalsId = async () => {
        return await app.db('adoptions')
            .select('animalId')
            .then(animalsId => animalsId.map(({ animalId }) => animalId))
            .catch(err => {
                console.log(err)
                // // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                res.status(500).send(err)
            })
    }

    const temporaryHomeAnimalsId = async () => {
        return await app.db('temporary-homes')
            .select('animalId')
            .then(animalsId => animalsId.map(({ animalId }) => animalId))
            .catch(err => {
                console.log(err)
                // // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                res.status(500).send(err)
            })
    }

    const save = async (req, res) => {
        const { existsOrError, objectIsNull } = app.api.validation

        const animal = await objectIsNull(req.body.animal) ? res.status(400).send('Dados do animal não informados') : req.body.animal
        const veterinaryCare = await objectIsNull(req.body.veterinaryCare) ? res.status(400).send('Dados do cuidado veterinário não informados') : req.body.veterinaryCare
        const rescue = await objectIsNull(req.body.rescue) ? res.status(400).send('Dados do resgate não informados') : req.body.rescue

        try {
            existsOrError(animal.name, 'Nome não informado')
            existsOrError(animal.color, 'Cor não informada')
            existsOrError(animal.specie, 'Espécie não informado')
            existsOrError(animal.dateOfBirth, 'Data de nascimento não informada')
            existsOrError(animal.breed, 'Raça não informado')
            existsOrError(animal.sex, 'Sexo não informado')

            if (!animal.id) {
                existsOrError(veterinaryCare.dateOfVeterinaryCare, 'Data do cuidado veterinário não informado')
                existsOrError(veterinaryCare.totalCostOfTreatment, 'Custo total do cuidado veterinário não informado')
                existsOrError(veterinaryCare.veterinaryName, 'Nome do veterinário não informado')
            }
        } catch (err) {
            return res.status(400).send(err)
        }

        animal.dateOfBirth = new Date(animal.dateOfBirth)

        if (!animal.id) {
            const animalId = await app.db('animals')
                .insert(animal)
                .then(id => {
                    console.log('Success => Animal')
                    return id[0]
                })
                .catch(err => {
                    console.log(err)
                    // // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                    res.status(500).send('Erro ao cadastrar animal')
                })

            veterinaryCare.dateOfVeterinaryCare = new Date(veterinaryCare.dateOfVeterinaryCare)

            const veterinaryCareId = await app.db('veterinary-cares')
                .insert({ ...veterinaryCare, animalId: animalId })
                .then(id => {
                    console.log('Success => Cuidado veterinário')
                    return id[0]
                })
                .catch(err => {
                    console.log(err)
                    // // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                    res.status(500).send('Erro ao cadastrar cuidado veterinário')
                })

            rescue.dateOfRescue = new Date(rescue.dateOfRescue)

            await app.db('rescues')
                .insert({ ...rescue, veterinaryCareId, animalId })
                .then(id => console.log('Success => Resgate'))
                .catch(err => {
                    console.log(err)
                    // // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                    res.status(500).send('Erro ao cadastrar resgate')
                })

            await res.status(200).json(animalId)
        } else {
            console.log('edit')
            delete animal.aproximateAge
            delete animal.imagesURL
            delete animal.extraInfo

            await app.db('animals')
                .update(animal)
                .where({ id: animal.id })
                .then(id => {
                    console.log('Success => Animal')
                })
                .catch(err => {
                    console.log(err)
                    // // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                    res.status(500).send('Erro ao cadastrar animal')
                })

            rescue.dateOfRescue = new Date(rescue.dateOfRescue)

            await app.db('rescues')
                .update(rescue)
                .where({ id: rescue.id })
                .then(_ => console.log('Success => Resgate'))
                .catch(err => {
                    console.log(err)
                    // // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                    res.status(500).send('Erro ao cadastrar resgate')
                })

            await res.status(200).json(animal.id)
        }
    }

    const savePicture = async (req, res) => {

        const storage = multer.diskStorage({ // Objeto para configurar a pasta de salvamento e o nome 
            destination: function (req, file, callback) {
                callback(null, './_animalPictures') // Pasta de destino
            },
            filename: function (req, file, callback) {
                callback(null, `${Date.now()}_${file.originalname}`)
            }
        })

        const upload = multer({ storage }).single('animalPicture')

        upload(req, res, err => {
            if (err) {
                return res.end('Erro ao fazer upload da(s) imagem(s)')
            }

            let animalPicture = {
                imageURL: req.file.filename,
                animalId: req.body.animalId
            }

            console.log(animalPicture.filename)

            app.db('animal-pictures')
                .select('imageURL')
                .where({ animalId: animalPicture.animalId })
                .then(async (imagesURL) => {

                    console.log(imagesURL)

                    if (imagesURL.length > 0) {
                        await deleteSavedFiles(imagesURL)

                        await app.db('animal-pictures')
                            .select('imageURL')
                            .where({ animalId: animalPicture.animalId })
                            .del()
                            .then(_ => console.log('Registros deletados!'))
                            .catch(err => {
                                console.log(err)
                                // // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                                console.log('Erro ao remover registros anteriores')
                            })
                        console.log('Registros anteriores deletados')

                    }

                    await app.db('animal-pictures')
                        .insert(animalPicture)
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
            await deleteFile(`${__dirname}/../_animalPictures/${imageURL.imageURL}`)
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

    const removeAnimal = async (req, res) => {
        const idAnimal = req.params.id ? req.params.id : res.status(400).send('Identificação do animal não informada')

        let animalsId = idAnimal.split(',')
        console.log(animalsId)

        animalsId.forEach(async (idAnimal) => {
            await app.db('animals')
                .where({ id: idAnimal })
                .del()
                .then(_ => console.log(`Animal de id: ${idAnimal} deletado`))
                .catch(err => {
                    console.log(err)
                    // // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                    res.status(500).send('Ocorreu um erro ao deletar animal')
                })

            await app.db('animal-pictures')
                .select('imageURL')
                .where({ animalId: idAnimal })
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

            await app.db('animal-pictures')
                .select('imageURL')
                .where({ animalId: idAnimal })
                .del()
                .then(_ => console.log('Registros deletados!'))
                .catch(err => {
                    console.log(err)
                    // // app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                    console.log('Erro ao remover registros anteriores')
                })
        })

        res.status(200).send('Animal removido com sucesso!')
    }

    return { getAnimalById, getAllDataOfAnimalById, getAnimals, getAnimalsAvailableForAdoption, getAnimalSelectOptions, save, savePicture, removeAnimal }
}