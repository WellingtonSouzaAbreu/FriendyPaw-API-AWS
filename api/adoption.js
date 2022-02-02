const path = require('path')

module.exports = app => {

    const getAdoptions = async (req, res) => {
        let animalName = req.query.animalName ? req.query.animalName.toLowerCase() : ''
        let page = !!req.query.page ? req.query.page : 0
        let rowsPerPage = req.query.rowsPerPage ? req.query.rowsPerPage : 10

        let offset = page > 0 ? (page * rowsPerPage) + 1 : page * rowsPerPage
        let limit = parseInt(rowsPerPage) + 1 // Deixar o paginator ativo

        // console.log(`Limit: ${limit}`)
        // console.log(`Offset: ${offset}`)

        await app.db('adoptions')
            .select('adoptions.id', 'adoptions.dateAdoption', 'adoptions.collaboratorId', 'adoptions.animalId', 'adoptions.userId', 'animals.name as animalName', 'animals.specie', 'animals.color', 'animals.sex', 'animals.breed', 'animals.dateOfBirth', 'animals.castrated', 'animals.othersCharacteristics', 'collaborators.name as collaboratorName', 'users.name as adopterName', 'users.address', 'users.houseNumber', 'users.email', 'users.phone', 'users.cellNumber', 'users.city', 'users.district')
            .innerJoin('collaborators', 'adoptions.collaboratorId', '=', 'collaborators.id')
            .innerJoin('animals', 'adoptions.animalId', '=', 'animals.id')
            .innerJoin('users', 'adoptions.userId', '=', 'users.id')
            .where('animals.name'.toLowerCase(), 'like', `%${animalName}%`)
            .offset(offset)
            .limit(limit)
            .then(async (adoptions) => {
                adoptions.aproximateAge = await estimateAllAges(adoptions)
                adoptions = await walkAnimals(adoptions)
                return res.status(200).send(adoptions)
            })
            .catch(err => {
                console.log(err)
                app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                return res.status(500).send(err)
            })
    }

    const walkAnimals = async (adoptions) => {
        for (adoption of adoptions) {
            adoption.animalImageURL = await getMainAnimalPicture(adoption.animalId)
        }
        return adoptions
    }

    const estimateAllAges = async (adoptionAnimal) => {
        for (animal of adoptionAnimal) {
            animal.aproximateAge = await estimateAge(animal.dateOfBirth)
        }
        return adoptionAnimal
    }


    const estimateAge = async(dateOfBirth) => {
        let differenceInMonths = parseInt((Date.parse(new Date()) - Date.parse(dateOfBirth)) / 1000 / 60 / 60 / 24 / 30)

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

    const getMainAnimalPicture = async (idAnimal) => {
        return await app.db('animal-pictures')
            .select('imageURL')
            .first()
            .where({ animalId: idAnimal })
            .then(imagesURL => imagesURL.imageURL)
            .catch(err => {
                console.log(err)
                app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                throw err
            })
    }

    const alreadyAdoptedAndExpressInterest = async (req, res) => {
        const userId = req.user.id
        const animalId = req.params.animalId

        let adopted
        let expressInterest

        await app.db('adoptions')
            .where({ userId: userId, animalId: animalId })
            .first()
            .then(adoption => {
                if (adoption) {
                    console.log('Adotado')
                    adopted = true
                } else {
                    console.log('Não adotado')
                    adopted = false
                }
            })
            .catch(err => {
                console.log(err)
                app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                res.status(500).send(err)
            })

        await app.db('interesteds-in-adoption')
            .where({ userId: userId, animalId: animalId })
            .first()
            .then(interest => {
                console.log(interest)
                if (interest) {
                    console.log('Manifestado')
                    expressInterest = true
                } else {
                    console.log('Não manifestado')
                    expressInterest = false
                }
            })
            .catch(err => {
                console.log(err)
                app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                res.status(500).send(err)
            })

        res.status(200).json({ adopted, expressInterest })
    }

    const getNumberOfAdoptionsByUser = async (req, res) => {

        const userId = req.user.id

        console.log(userId)

        await app.db('adoptions')
            .where({ userId: userId })
            .count()
            .then(async ([numberOfAdoptions]) => {
                console.log(numberOfAdoptions["count(*)"])
                res.status(200).json(numberOfAdoptions["count(*)"])
            })
            .catch(err => {
                console.log(err)
                app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                res.status(500).send(err)
            })
    }

    const getAnimalsByUserAdoption = async (req, res) => { 

        const userId = req.user.id

        await app.db('adoptions')
            .select('id as adoptionId','animalId')
            .where({ userId: userId })
            .then(async (adoptionData) => {

                console.log('adoptionData: ')
                console.log(adoptionData)

                let animalsWithPicture = []
                for (adoptedAnimal of adoptionData) {

                    await app.db('animals')
                        .select('id', 'name', 'breed', 'dateOfBirth')
                        .first()
                        .where({ id: adoptedAnimal.animalId })
                        .then(async (animal) => {
                            animal.adoptionId = adoptedAnimal.adoptionId
                            animal.aproximateAge = await estimateAge(animal.dateOfBirth)
                            animalsWithPicture.push(await getAnimalMainPicture([animal]))
                        })
                        .catch(err => {
                            console.log(err)
                            app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                            throw err
                        })
                }

                animalsWithPicture = animalsWithPicture.map(([animalInArray]) => animalInArray)
                
                res.status(200).send(animalsWithPicture)
            })
            .catch(err => {
                console.log(err)
                app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                throw err
            })
    }

    const getAnimalMainPicture = async (animals) => {
        for (animal of animals) {
            await app.db('animal-pictures')
                .select('imageURL')
                .where({ animalId: animal.id })
                .first()
                .then(imageURL => animal.imageURL = imageURL ? imageURL.imageURL : null)
                .catch(err => {
                    console.log(err)
                    app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                    throw 'Erro o obter imagem do animal'
                    // res.status(500).send(err)
                })
        }
        return animals
    }

    const save = async (req, res) => {
        const { existsOrError, objectIsNull } = app.api.validation

        const adoption = await objectIsNull(req.body.adoption) ? res.status(400).send('Dados da adoção não informados') : req.body.adoption

        console.log(adoption)

        try {
            existsOrError(adoption.dateAdoption, 'Data não informado')
            existsOrError(adoption.animalId, 'Animal não informado')
            existsOrError(adoption.userId, 'Usuário adotante não informado')
            existsOrError(adoption.collaboratorId, 'Colaborador não informado')
        } catch (err) {
            return res.status(400).send(err)
        }

        adoption.dateAdoption = new Date(adoption.dateAdoption)

        if (!adoption.id) {
            await app.db('adoptions')
                .insert(adoption)
                .then(_ => res.status(204).send())
                .catch(err => {
                    console.log(err)
                    app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                    res.status(500).send('Erro ao cadastrar adoção')
                })
        } else {
            await app.db('adoptions')
                .update(adoption)
                .where({ id: adoption.id })
                .then(_ => res.status(204).send())
                .catch(err => {
                    console.log(err)
                    app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                    res.status(500).send('Erro ao atualizar adoção')
                })
        }
    }

    const removeAdoption = async (req, res) => {
        const idAdoption = req.params.id ? req.params.id : res.status(400).send('Identificação da adoção não informada')

        let adoptionsId = idAdoption.split(',')
        console.log(adoptionsId)

        adoptionsId.forEach(async (idAdoption) => {
            await app.db('adoptions')
                .where({ id: idAdoption })
                .del()
                .then(_ => console.log(`Adoção de id: ${idAdoption} deletado`))
                .catch(err => {
                    console.log(err)
                    app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                    res.status(500).send('Ocorreu um erro ao deletar adoção')
                })
        })

        res.status(200).send('Adoção removido com sucesso!')
    }

    return { getAdoptions, alreadyAdoptedAndExpressInterest, getNumberOfAdoptionsByUser, getAnimalsByUserAdoption, save, removeAdoption }
}