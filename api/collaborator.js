const path = require('path')

module.exports = app => {
    // TODO Error app.api.commonfunctions undefined || Afetando todos os testes
    // const { showLog, showAndRegisterError } = app.api.commonFunctions

    const getCollaborators = async (req, res) => {
        const name = req.query.name ? req.query.name.toLowerCase() : ''
        const page = !!req.query.page ? req.query.page : 0
        const rowsPerPage = req.query.rowsPerPage ? req.query.rowsPerPage : 10

        const offset = page > 0 ? (page * rowsPerPage) + 1 : page * rowsPerPage
        const limit = parseInt(rowsPerPage) + 1 // Deixar o paginator ativo

        // showLog(`Limit: ${limit}`)
        // showLog(`Offset: ${offset}`)

        await app.db('collaborators')
            .where('name'.toLowerCase(), 'like', `%${name}%`)
            .offset(offset)
            .limit(limit)
            .then(collaborators => {
                return res.status(200).send(collaborators)
            })
            .catch(err => {
                // showAndRegisterError(err, path.basename(__filename))
                return res.status(500).send()
            })
    }

    const getCollaboratorById = async (req, res) => {
        const { isValidId } = app.api.validation //TODO 

        const idCollaborator = isValidId(req.params.id) && req.params.id
        if (!idCollaborator) return res.status(400).send('Não foi possível localizar colaborador!')

        await app.db('collaborators')
            .first()
            .where({ id: idCollaborator })
            .then(collaborator => res.status(200).json(collaborator))
            .catch(err => {
                // showAndRegisterError(err, path.basename(__filename))
                return res.status(500).send('Ocorreu um erro ao obter os dados do colaborador!')
            })
    }

    const getCollaboratorSelectOptions = async (_, res) => {
        await app.db('collaborators')
            .select('id', 'name', 'dateOfBirth')
            .orderBy('name')
            .then(collaborators => {
                return res.status(200).send(collaborators)
            })
            .catch(err => {
                // showAndRegisterError(err, path.basename(__filename))
                return res.status(500).send(err)
            })
    }

    const save = async (req, res) => {
        // TODO remove inline import
        const { showLog, showAndRegisterError, convertStringToDate } = app.api.commonFunctions
        const { existsOrError, objectIsNull } = app.api.validation

        const collaborator = !objectIsNull(req.body.collaborator) && req.body.collaborator
        if (!collaborator) return res.status(400).send('Dados do colaborador não informados!')

        try {
            existsOrError(collaborator.name, 'Nome não infomado!')
            existsOrError(collaborator.city, 'Cidade não infomada!')
            existsOrError(collaborator.cellNumber, 'Celular não infomado!')
            existsOrError(collaborator.dateOfBirth, 'Data de nascimento não infomada!')
        } catch (err) {
            // showAndRegisterError(err, path.basename(__filename))
            return res.status(400).send(err)
        }

        collaborator.dateOfBirth = convertStringToDate(collaborator.dateOfBirth)

        await app.db('collaborators')
            .insert(collaborator)
            .then(_ => res.status(204).send())
            .catch(err => {
                // showAndRegisterError(err, path.basename(__filename))
                return res.status(500).send('Erro ao cadastrar colaborador!')
            })
    }

    const update = async (req, res) => {
        // TODO remove inline import
        const { showAndRegisterError, convertStringToDate } = app.api.commonFunctions
        const { existsOrError, objectIsNull } = app.api.validation

        const collaborator = !objectIsNull(req.body.collaborator) && req.body.collaborator
        if (!collaborator) return res.status(400).send('Dados do colaborador não informados!')

        try {
            existsOrError(collaborator.name, 'Nome não infomado!')
            existsOrError(collaborator.city, 'Cidade não infomada!')
            existsOrError(collaborator.cellNumber, 'Celular não infomado!')
            existsOrError(collaborator.dateOfBirth, 'Data de nascimento não infomada!')
        } catch (err) {
            // showAndRegisterError(err, path.basename(__filename))
            return res.status(400).send(err)
        }

        collaborator.dateOfBirth = convertStringToDate(collaborator.dateOfBirth)

        await app.db('collaborators')
            .update(collaborator)
            .where({ id: collaborator.id })
            .then(_ => res.status(204).send())
            .catch(err => {
                // showAndRegisterError(err, path.basename(__filename))
                return res.status(500).send('Erro ao Editar colaborador!')
            })
    }

    const removeCollaborator = async (req, res) => {
        const { validateRequestDataForDelete, deleteFromDatabase } = app.api.requests

        const target = 'colaborador'
        const targetTable = 'collaborators'
        let validIds

        try {
            validIds = await validateRequestDataForDelete(req, target)
        } catch (err) {
            return res.status(400).send(err)
        }

        const executed = await deleteFromDatabase(validIds, target, targetTable)

        if (executed) {
            return res.status(204).send()
        } else {
            return res.status(500).send(`Ocorreu um erro ao deletar ${target}!`)
        }
    }

    return { getCollaborators, getCollaboratorById, getCollaboratorSelectOptions, save, update, removeCollaborator }

}

// 108 ->  142
