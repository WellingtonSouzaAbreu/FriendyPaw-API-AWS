const { authSecret } = require('./../config/.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')
const path = require('path')

module.exports = app => {

    const getUserById = async (req, res) => {
        let idUser

        if (Number.isInteger(req.params.id)) { // Quando não é passado parâmetros pela URL, pega-se o vindo de passport
            idUser = req.params.id
        } else {
            idUser = req.user.id
        }

        console.log(idUser)

        await app.db('users')
            .select('id', 'name', 'cellNumber', 'email', 'city', 'district', 'address', 'houseNumber', 'phone',)
            .where({ id: idUser })
            .first()
            .then(user => res.status(200).send(user))
            .catch(err => {
                console.log(err)
                app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                res.status(500).send(err)
            })
    }

    const getUserSelectOptions = async (req, res) => {
        console.log(req.query.userName)
        await app.db('users')
            .select('id', 'name', 'cellNumber')
            .where('name'.toLowerCase(), 'like', `%${req.query.userName}%`)
            .orWhere('cellNumber'.toLowerCase(), 'like', `%${req.query.userName}%`)
            .then(async users => {
                users = await concatNameAndCellNumber(users)
                res.status(200).send(users)
            })
            .catch(err => {
                console.log(err)
                app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                res.status(500).send(err)
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

    const signin = async (req, res) => {
        console.log(req.body.cellNumber, req.body.password)

        if (!req.body.cellNumber || !req.body.password) {
            return res.status(400).send('Informe usuário e senha!')
        }

        const user = await app.db('users')
            .where({ cellNumber: req.body.cellNumber })
            .first()

        if (!user) return res.status(400).send('Usuário não encontrado!')

        console.log(req.body.password, user.password)
        const passwordsAreEquals = bcrypt.compareSync(req.body.password, user.password)
        if (!passwordsAreEquals) return res.status(401).send('Email/Senha inválidos!')


        // const currentDateInSeconds = Math.floor(Date.now() / 1000)

        const payload = {
            id: user.id,
            name: user.name,
            cellNumber: user.cellNumber,
            /* iat: currentDateInSeconds,
            exp: currentDateInSeconds + (60 * 60 * 24 * 3) */
        }

        res.json({
            ...payload,
            token: jwt.encode(payload, authSecret)
        })
    }

    const save = async (req, res) => {
        const { existsOrError, objectIsNull } = app.api.validation

        const user = await objectIsNull(req.body.user) ? res.status(400).send('Dados do usuário não informados') : req.body.user
        const idUserForUpdate = req.params.id || null // for update - from URL

        try {
            existsOrError(user.name, 'Nome não informado')
            existsOrError(user.cellNumber, 'Celular não informado')
            if (!idUserForUpdate) existsOrError(user.password, 'Senha não informada')
            if (!idUserForUpdate) existsOrError(user.confirmPassword, 'Confirmação de senha não informada')

            console.log(user.password, user.confirmPassword)
            if(!idUserForUpdate && user.password.length < 8) throw 'Senha muito curta! Ela deve ter no mínimo 8 caracteres'
            if (user.password != user.confirmPassword) throw 'Senhas não conferem'

            if(user.email && !user.email.match(/\S+@\w+\.\w{2,6}(\.\w{2})?/g)) throw 'Por favor, insira um email válido!'

            if (!idUserForUpdate) {
                const userFromDB = await app.db('users')
                    .select('cellNumber')
                    .where({ cellNumber: user.cellNumber })
                    .first()

                if (userFromDB && userFromDB.cellNumber == user.cellNumber) throw 'Usuário já cadastrado'
            }

        } catch (err) {
            console.log(err)
            app.api.bugReport.writeInBugReport(err, path.basename(__filename))
            return res.status(400).send(err)
        }

        if (user.password) {
            user.password = encryptPassword(user.password)
        }

        delete user.confirmPassword

        if (!idUserForUpdate) {
            await app.db('users')
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(err => {
                    console.log(err)
                    app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                    res.status(500).send('Erro ao cadastrar usuário')
                })
        } else {
            await app.db('users')
                .update(user)
                .where({ id: idUserForUpdate })
                .then(_ => res.status(204).send())
                .catch(err => {
                    console.log(err)
                    app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                    res.status(500).send('Erro ao cadastrar usuário')
                })
        }
    }

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const validateToken = (req, res, next) => {
        let tokenFromHeader = req.headers.authorization ? req.headers.authorization : res.status(400).send('Token não informado. Realizar login novamente pode resolver o problema')

        try {
            if (tokenFromHeader) {
                const token = jwt.decode(tokenFromHeader, authSecret)
                console.log(token)
                return res.status(200).send(true)
            }
        } catch (e) {
            // problema com o token
        }
        res.status(400).send('Falha ao autenticar o token')

    }

    return { getUserById, getUserSelectOptions, signin, save, validateToken }
}

