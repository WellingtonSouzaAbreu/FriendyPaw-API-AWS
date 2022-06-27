const path = require('path')

module.exports = app => {
    const { showLog, showAndRegisterError, convertStringToDate, convertStringWithCommaToArray } = app.api.commonFunctions
    const { isValidId } = app.api.validation

    const getTemporaryHomes = async (req, res) => {
        const animalName = req.query.animalName ? req.query.animalName.toLowerCase() : ''
        const page = !!req.query.page ? req.query.page : 0
        const rowsPerPage = req.query.rowsPerPage ? req.query.rowsPerPage : 10 // Rows per page

        const offset = page > 0 ? (page * rowsPerPage) + 1 : page * rowsPerPage
        const limit = parseInt(rowsPerPage) + 1 // Deixar o paginator ativo

        // showLog(`Limit: ${limit}`)
        // showLog(`Offset: ${offset}`)

        await app.db('temporary-homes')
            .innerJoin('animals', 'animals.id', '=', 'temporary-homes.animalId')
            .select(
                'temporary-homes.id', 'temporary-homes.adopterName', 'temporary-homes.animalId', 'temporary-homes.date', 'temporary-homes.cellNumber',
                'animals.id as animalId', 'animals.name as animalName', 'animals.specie', 'animals.sex', 'animals.breed',
                'animals.dateOfBirth', 'animals.color', 'animals.castrated', 'animals.availableForAdoption', 'othersCharacteristics'
            )
            .where('animals.name'.toLowerCase(), 'like', `%${animalName}%`)
            .offset(offset)
            .limit(limit)
            .then(async temporaryHomes => {
                temporaryHomes.aproximateAge = await estimateAllAges(temporaryHomes)
                temporaryHomes = await walkTemporaryHomes(temporaryHomes)
                delete temporaryHomes.dateOfBirth
                return res.status(200).send(temporaryHomes)
            })
            .catch(err => {
                showAndRegisterError(err, path.basename(__filename))
                return res.status(500).send(err)
            })
    }

    const walkTemporaryHomes = async (temporaryHomes) => {
        return Promise.all(
            temporaryHomes.map(async temporaryHome => {
                temporaryHome.animalImageURL = await getMainAnimalPicture(temporaryHome.animalId)
                return temporaryHome
            })
        )
    }

    const getMainAnimalPicture = async (idAnimal) => {
        return await app.db('animal-pictures')
            .select('imageURL')
            .first()
            .where({ animalId: idAnimal })
            .then(imagesURL => imagesURL.imageURL)
            .catch(err => {
                showAndRegisterError(err, path.basename(__filename))
                throw err
            })

    }

    const estimateAllAges = async (temporaryHome) => {
        return temporaryHome.map(async animal => {
            animal.aproximateAge = await estimateAge(animal.dateOfBirth)
            return animal
        })
    }


    const estimateAge = async (dateOfBirth) => {
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

    const getTemporaryHomeById = async (req, res) => {
        const idTemporaryHome = isValidId(req.params.id) && req.params.id
        if (!idTemporaryHome) return res.status(400).send('Não foi possível localizar este lar temporário!')

        await app.db('temporary-homes')
            .first()
            .where({ id: idTemporaryHome })
            .then(temporaryHome => res.status(200).json(temporaryHome))
            .catch(err => {
                showAndRegisterError(err, path.basename(__filename))
                return res.status(500).send('Erro ao obter lar temporário!')
            })
    }

    const save = async (req, res) => {
        const { existsOrError, objectIsNull } = app.api.validation

        const temporaryHome = !objectIsNull(req.body.temporaryHome) && req.body.temporaryHome
        if (!temporaryHome) return res.status(400).send('Dados do lar temporário não informados!')

        try {
            existsOrError(temporaryHome.adopterName, 'Nome do adotante não informado!')
            existsOrError(temporaryHome.cellNumber, 'Celular adotante não informado!')
            existsOrError(temporaryHome.date, 'Data não informada!')
            existsOrError(isValidId(temporaryHome.animalId), 'Animal não informado!')
        } catch (err) {
            showAndRegisterError(err, path.basename(__filename))
            return res.status(400).send(err)
        }

        temporaryHome.date = convertStringToDate(temporaryHome.date)

        await app.db('temporary-homes')
            .insert(temporaryHome)
            .then(_ => res.status(204).send())
            .catch(err => {
                showAndRegisterError(err, path.basename(__filename))
                return res.status(500).send('Erro ao cadastrar lar temporário!')
            })

    }

    const update = async (req, res) => {
        const { existsOrError, objectIsNull } = app.api.validation

        const temporaryHome = !objectIsNull(req.body.temporaryHome) && req.body.temporaryHome
        if (!temporaryHome) return res.status(400).send('Dados do lar temporário não informados!')

        try {
            existsOrError(temporaryHome.adopterName, 'Nome do adotante não informado!')
            existsOrError(temporaryHome.cellNumber, 'Celular adotante não informado!')
            existsOrError(temporaryHome.date, 'Data não informada!')
            existsOrError(isValidId(temporaryHome.animalId), 'Animal não informado!')
        } catch (err) {
            showAndRegisterError(err, path.basename(__filename))
            return res.status(400).send(err)
        }

        temporaryHome.date = convertStringToDate(temporaryHome.date)

        await app.db('temporary-homes')
            .update(temporaryHome)
            .where({ id: temporaryHome.id })
            .then(_ => res.status(204).send())
            .catch(err => {
                showAndRegisterError(err, path.basename(__filename))
                return res.status(500).send('Erro ao atualizar lar temporário!')
            })
    }

    const removeTemporaryHome = async (req, res) => {
        const idTemporaryHome = req.params.id && req.params.id
        if (!idTemporaryHome) return res.status(400).send('Identificação do lar temporário não informado!')

        let temporaryHomesId = convertStringWithCommaToArray(idTemporaryHome)
        showLog(temporaryHomesId)

        const validIds = temporaryHomesId.filter(id => isValidId(id))
        if(!validIds.length) return res.status(400).send('Não foi informado nenhum identificador válido!')

        validIds.forEach(async (idTemporaryHome) => {
            await app.db('temporary-homes')
                .where({ id: idTemporaryHome })
                .del()
                .then(_ => showLog(`Lar temporário de id: ${idTemporaryHome} deletado!`))
                .catch(err => {
                    showAndRegisterError(err, path.basename(__filename))
                    return res.status(500).send('Ocorreu um erro ao deletar lar temporário!')
                })
        })

        return res.status(204).send()
    }

    return { getTemporaryHomes, getTemporaryHomeById, save, update, removeTemporaryHome }
}

// 170 -> 183