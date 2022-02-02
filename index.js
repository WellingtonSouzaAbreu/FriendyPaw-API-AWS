const app = require('express')()
const consign = require('consign')
const port = 500

app.db = require('./config/db.js')

consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api/validation.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app)

app.get('/teste', (req, res) => {
    console.log('Aoba, conectou!')
    res.send('Conexão estabelecida')
})

app.listen(port, () => {
    console.log(`Server running in port ${port}`)
})