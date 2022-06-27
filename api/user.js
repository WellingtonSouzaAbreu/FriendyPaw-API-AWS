const { authSecret } = require('./../config/.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')
const path = require('path')

module.exports = app => {
    const { showLog, showAndRegisterError } = app.api.commonFunctions
    const {  isValidId } = app.api.validation

    const getUserById = async (req, res) => {
        let idUser = isValidId(req.params.id) ? req.params.id : req.user.id // Quando não é passado parâmetros pela URL, pega-se o vindo de passport

        if (!idUser) return res.status(400).send('Não foi possível localizar usuário!')

        await app.db('users')
            .select('id', 'name', 'cellNumber', 'email', 'city', 'district', 'address', 'houseNumber', 'phone',)
            .where({ id: idUser })
            .first()
            .then(user => res.status(200).send(user))
            .catch(err => {
                showAndRegisterError(err, path.basename(__filename))
                return res.status(500).send(err)
            })
    }

    const getUserSelectOptions = async (req, res) => {
        const query = req.query.userName && req.query.userName

        if (!query || query.length < 3) return res.status(400).send('Digite pelo menos 3 letras para iniciar a pesquisa!')

        await app.db('users')
            .select('id', 'name', 'cellNumber')
            .where('name'.toLowerCase(), 'like', `%${query}%`)
            .orWhere('cellNumber'.toLowerCase(), 'like', `%${query}%`)
            .then(async users => {
                users = await concatNameAndCellNumber(users)
                return res.status(200).send(users)
            })
            .catch(err => {
                showAndRegisterError(err, path.basename(__filename))
                return res.status(500).send(err)
            })
    }

    const concatNameAndCellNumber = (users) => {
        return users.map(user => {
            user.label = `${user.name} - ${user.cellNumber}`
            delete user.cellNumber
            delete user.name
            return user
        })
    }

    const save = async (req, res) => {
        const { existsOrError, objectIsNull } = app.api.validation
        const user = !objectIsNull(req.body.user) && req.body.user
        if (!user) return res.status(400).send('Dados do usuário não informados!')
        console.log(user)
        try {
            existsOrError(user.name, 'Nome não informado!')
            existsOrError(user.cellNumber, 'Celular não informado!')
            existsOrError(user.password, 'Senha não informada!')
            existsOrError(user.confirmPassword, 'Confirmação de senha não informada!')

            if (user.password.length < 8) throw 'Senha muito curta! Ela deve ter no mínimo 8 caracteres!'
            if (user.password && user.password != user.confirmPassword) throw 'Senhas não conferem!'
            if (user.email && !user.email.match(/\S+@\w+\.\w{2,6}(\.\w{2})?/g)) throw 'Por favor, insira um email válido!'

            const userFromDB = await getUserFromDBbyCellNumber(user.cellNumber)

            if (userFromDB && userFromDB.cellNumber == user.cellNumber) throw 'Usuário já cadastrado!'
        } catch (err) {
            showAndRegisterError(err, path.basename(__filename))
            return res.status(400).send(err)
        }

        if (user.password) {
            user.password = encryptPassword(user.password)
        }

        delete user.confirmPassword

        await app.db('users')
            .insert(user)
            .then(_ => res.status(204).send())
            .catch(err => {
                showAndRegisterError(err, path.basename(__filename))
                return res.status(500).send('Erro ao cadastrar usuário!')
            })
    }

    const getUserFromDBbyCellNumber = async (cellNumber) => {
        return app.db('users')
            .select('cellNumber')
            .where({ cellNumber })
            .first()
    }

    const update = async (req, res) => {
        const { existsOrError, objectIsNull } = app.api.validation

        const user = !objectIsNull(req.body.user) && req.body.user
        const idUserForUpdate = isValidId(req.params.id) // for update - from URL

        if (!user || !idUserForUpdate) return res.status(400).send('Dados do usuário não informados!')

        try {
            existsOrError(user.name, 'Nome não informado!')
            existsOrError(user.cellNumber, 'Celular não informado!')

            if (user.password && user.password.length < 8) throw 'Senha muito curta! Ela deve ter no mínimo 8 caracteres!'
            if (user.password && user.password != user.confirmPassword) throw 'Senhas não conferem!'
            if (user.email && !user.email.match(/\S+@\w+\.\w{2,6}(\.\w{2})?/g)) throw 'Por favor, insira um email válido!'
        } catch (err) {
            showAndRegisterError(err, path.basename(__filename))
            return res.status(400).send(err)
        }

        if (user.password) {
            user.password = encryptPassword(user.password)
        }

        delete user.confirmPassword
        await app.db('users')
            .update(user)
            .where({ id: idUserForUpdate })
            .then(_ => res.status(204).send())
            .catch(err => {
                showAndRegisterError(err, path.basename(__filename))
                return res.status(500).send('Erro ao cadastrar usuário!')
            })
    }

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const signin = async (req, res) => {
        showLog(req.body.cellNumber, req.body.password)

        if (!req.body.cellNumber || !req.body.password) {
            return res.status(400).send('Informe usuário e senha!')
        }

        const user = await app.db('users')
            .where({ cellNumber: req.body.cellNumber })
            .first()

        if (!user) return res.status(400).send('Usuário não encontrado!')

        showLog(req.body.password, user.password)
        const passwordsAreEquals = bcrypt.compareSync(req.body.password, user.password)
        if (!passwordsAreEquals) return res.status(401).send('Email/Senha inválidos!')

        const payload = {
            id: user.id,
            name: user.name,
            cellNumber: user.cellNumber,
        }

        return res.json({
            ...payload,
            token: jwt.encode(payload, authSecret)
        })
    }

    const validateToken = (req, res) => {
        let tokenFromHeader
        if (req.headers.authorization) {
            tokenFromHeader = req.headers.authorization.split(' ')[1]
        } else {
            return res.status(400).send('Token não informado. Realizar login novamente pode resolver o problema!')
        }

        try {
            if (tokenFromHeader) {
                const token = jwt.decode(tokenFromHeader, authSecret)
                showLog(token)
                return res.status(200).send(true)
            }
        } catch (e) {
            // problema com o token
        }
        return res.status(400).send(false)
    }

    return {
        getUserById,
        getUserSelectOptions,
        signin,
        save,
        update,
        validateToken,
    }
}

// 179 -> 198