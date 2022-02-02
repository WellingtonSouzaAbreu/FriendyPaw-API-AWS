const path = require('path')
const baseApiUrl = 'http://192.168.2.183:500'

module.exports = app => {
    const jwt = require('jwt-simple')
    const { authSecret } = require('./../config/.env')
    const bcrypt = require('bcrypt-nodejs')

    const generateStaticPage = async (req, res) => {

        console.log(req.body)

        const user = await getUserLoginAccess(req.body.user)

        if (!user) {
            console.log('Usuário não encontrado')
            return res.status(400).send('Usuário não encontrado')
        }

        console.log(user)

        const token = await generateToken(user)

        const HTMLPage = `
        <!DOCTYPE html>
        <html lang="pt-br">
        
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.24.0/axios.js"
                    integrity="sha512-RT3IJsuoHZ2waemM8ccCUlPNdUuOn8dJCH46N3H2uZoY7swMn1Yn7s56SsE2UBMpjpndeZ91hm87TP1oU6ANjQ=="
                    crossorigin="anonymous" referrerpolicy="no-referrer"></script>
                <title>Recuperar senha de acesso</title>
            </head>
        
            <body onload='checkState()'>
                <div class='container' style="display: flex;justify-content: center;margin-top: 30px;flex-direction: column;">
                    
                </div>
            
            
                <script>
                    const checkState = async() => {
                        const endpoint = location.href.split('/')[4]
                await axios.get(\`${baseApiUrl}/already-changed?endpoint=\` + endpoint)
                            .then(res => {
                                if(res.data){
                                    document.getElementsByClassName('container')[0].innerHTML = \`
                                    <h2 style="margin: auto;">Ops! Este link não está disponível</h2>
                                    <br/>
                                    <h2 style="margin: auto;">Para alterar a senha, solicite novamente que esqueceu a senha, que lhe enviaremos um novo link</h2>
                                \`
                                }else{
                                    document.getElementsByClassName('container')[0].innerHTML = \`
                                    <div class='form'>
                                        <h3>Recuparação de senha</h3>
                                        <div>
                                            <label>Nova senha: <input type='password' id='password' /></label> <span></span>
                                        </div>
                                        <br />
                                        <div>
                                            <label>Confirmar senha: <input type='password' id='confirmPassword' /></label> <span></span>
                                        </div>
                                        <br />
                                        <div  style="visibility: hidden;">
                                            <input type='text' id='token' value=${token}></input>
                                        </div>
                                        <button onclick='saveNewPassword()'>Alterar senha</button>
                                    </div>
                                    \`
                                }
                            })
                            .catch(err => {
                                console.log(err)
                                app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                                window.alert('Erro ao alterar senha!')
                            })
                    }
                    
                    const saveNewPassword = async () => {
                        const password = document.querySelector('#password').value
                        const confirmPassword = document.querySelector('#confirmPassword').value
                        const token = document.querySelector('#token').value
            
                        console.log(password)
                        console.log(confirmPassword)
                        console.log(token)
            
                        if (password.length < 8) {
                            window.alert('Senha muito curta!')
                            return
                        }
            
                        if (password != confirmPassword) {
                            window.alert('As senha são diferentes!')
                            return
                        }
            
                        // TODO Tornar o ip dinâmico
                        const endpoint = location.href.split('/')[4]

                        await axios.put(\`${baseApiUrl}/recovery-password?endpoint=\` + endpoint, { password, token })
                            .then(res => {
                                document.getElementsByClassName('container')[0].innerHTML = \`
                                    <h2 style="margin: auto;">Senha alterada com sucesso!</h2>
                                    <br/>
                                    <h2 style="margin: auto;">Para trocar de senha, solicite novamente.</h2>
                                \`
                            })
                            .catch(err => {
                                console.log(err)
                                app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                                window.alert('Erro ao alterar senha!')
                            })
                    }
                </script>
            </body>
        </html>
        `
        const endpoint = Date.now()

        console.log(user)
        console.log(endpoint)

        app.config.middlewares.newRoutes(`/recuperar-senha/${endpoint}`, HTMLPage)

        const url = `${baseApiUrl}/recuperar-senha/${endpoint}`

        try {

            if (user.cellNumber == 'Admin' || !!user.email && user.email.length > 0 && !!user.email.match(/\S+@\w+\.\w{2,6}(\.\w{2})?/g)) {
                console.log('E-mail Válido!')
                if (await sendEmail(user.email, url)) {
                    return res.status(200).send({ recoveryType: 'email' })
                } else {
                    throw 'Houve um erro ao enviar mensagem de recuperação para o seu email!'
                }
            } else {
                console.log('Número de telefone válido!')
                if (await sendSms(user.cellNumber, url)) {
                    return res.status(200).send({ recoveryType: 'cellNumber' })
                } else {
                    throw 'Houve um erro ao enviar mensagem de recuperação para o seu celular!'
                }
            }

        } catch (err) {
            console.log(err)
            app.api.bugReport.writeInBugReport(err, path.basename(__filename))
            res.status(500).send(err)
        }
    }

    const getUserLoginAccess = async (user) => {
        return await app.db('users')
            .select('id', 'cellNumber', 'email')
            .where({ cellNumber: user })
            .first()
            .then(user => {
                return user
            })
            .catch(err => {
                console.log(err)
                app.api.bugReport.writeInBugReport(err, path.basename(__filename))
            })
    }

    const generateToken = (user) => {
        return jwt.encode(user, authSecret)
    }

    const decodeToken = (token) => {
        return jwt.decode(token, authSecret)
    }

    const sendEmail = async (email, url) => {
        let nodemailer = require('nodemailer');

        const senderUser = 'wellingtonsouza.wsa100@gmail.com'
        const senderPassword = 'Outubro10' // TODO
        const recipient = email

        let remetente = nodemailer.createTransport({ //Configuração de remetente
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: senderUser,
                pass: senderPassword
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        let emailASerEnviado = {
            from: `Associação Pata Amiga <${senderUser}>`,
            to: recipient,
            subject: 'Recuperação de senha do Pata Amiga',
            html: `
            <div style='margin:auto;'>
                <br />
                <p style='font-size: 15pt;'>Clique no botão abaixo para recuperar o acesso a sua conta</p>
                <br />
                <a href=${url} style='color: white;text-decoration: none;font-size: 20pt;font-weight: bold;'>
                    <div
                        style="margin-top:60px;padding: 20px 50px; background-color: green; color: white; width:150px;height:30px;display:flex;align-items:center;justify-content:center;">
                        Clique aqui
                    </div>
                </a>
                <br/>
                <p style='margin-bottom: 30px;'>
                <span style='font-weight:bold;'> Obs:</span> Este link só pode ser utilizado uma vez.
                </p>
             </div>
                
                `
        };

        return await remetente.sendMail(emailASerEnviado)
            .then(info => {
                console.log(info)
                return true
            })
            .catch(err => {
                console.log(err)
                app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                return false
            })
    }

    const sendSms = async (cellNumber, url) => {
        const accountSid = 'AC654e478886b12bb8e06b522f26080d11';
        const authToken = 'eba35f05b708c4f580dff930f506b96b';
        const client = require('twilio')(accountSid, authToken);

        const message = `
Associação Pata Amiga.

Clique no link abaixo para redefinir sua senha de acesso:
${url}
        `

        return await client.messages
            .create({ body: message, from: '+18507711920', to: cellNumber })
            .then(message => {
                console.log('Mensagem enviada com sucesso!')
                return true
            })
            .catch(err => {
                console.log(err)
                app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                return false
            })
    }

    const saveNewPassword = async (req, res) => {
        const endpoint = req.query.endpoint
        const token = req.body.token
        let password = req.body.password

        const user = await decodeToken(token)
        password = await encryptPassword(password)

        console.log(user)
        console.log(password)
        console.log(token)

        await app.db('users')
            .update({ password: password })
            .where({ id: user.id })
            .then(_ => {
                app.config.middlewares.staticEndpoints.push(endpoint)
                return res.status(200).send()
            })
            .catch(err => {
                console.log(err)
                app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                return res.status(500).send(err)
            })
    }

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const endpointAlreadyUsed = async (req, res) => {
        const endpoint = req.query.endpoint
        console.log(endpoint)

        const alreadyUsed = await filterEndpoints(endpoint)

        res.status(200).send(alreadyUsed)
    }

    const filterEndpoints = async (endpoint) => {
        console.log(app.config.middlewares.staticEndpoints)
        return await !!app.config.middlewares.staticEndpoints.filter((currentPoint) => endpoint == currentPoint).length
    }

    return { generateStaticPage, saveNewPassword, endpointAlreadyUsed }
}
