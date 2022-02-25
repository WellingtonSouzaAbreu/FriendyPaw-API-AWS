const app = require('express')()
const consign = require('consign')
const https = require('https');
const fs = require('fs')
const port = 500

app.db = require('./config/db.js')

const options = {
    key: fs.readFileSync('certificate.key'),
    cert: fs.readFileSync('certificate.crt')
  };

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

https.createServer(options, app).listen(port, () => {
    console.log(`Server running in port ${port}`)
})