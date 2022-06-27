const fs = require('fs')

const { app, request } = require('./../apiTestConfig/requires.js')
const { remoteMonitoring, errorMessageIdentifier } = require('./../apiTestConfig/dataTest.js')

describe('Testing api/remoteMonitoring', () => {
    test('Should return array containing remote monitorings with pictures URL by idAdoption and statusCode=200 | route: GET /remote-monitoring/:idAdoption', async () => {
        const res = await request(app).get('/remote-monitoring/1')
        expect(res.statusCode).toEqual(200)
        expect(res.body[0]).toEqual({ ...remoteMonitoring, id: 1, imagesURL: ['test.txt'] })
    })

    test('Should return error message when send invalid idAdoption and statusCode=200 | route: GET /remote-monitoring/:idAdoption', async () => {
        const res = await request(app).get('/remote-monitoring/1x')
        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return idRemoteMonitoring when send valid datas and statusCode=200 | route POST /remote-monitoring', async () => {
        const res = await request(app)
            .post('/remote-monitoring')
            .send({
                remoteMonitoring: { ...remoteMonitoring }
            })

        expect(res.statusCode).toEqual(200)
        expect(res.body).toBeGreaterThan(0)
    })

    test('Should return error message when not send remoteMonitoring object and statusCode=400 | route POST /remote-monitoring', async () => {
        const res = await request(app)
            .post('/remote-monitoring')
            .send({
                noRemoteMonitoring: { ...remoteMonitoring }
            })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send invalid observations and statusCode=400 | route POST /remote-monitoring', async () => {
        const res = await request(app)
            .post('/remote-monitoring')
            .send({
                remoteMonitoring: { ...remoteMonitoring, observations: '' }
            })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send invalid adoptionId and statusCode=400 | route POST /remote-monitoring', async () => {
        const res = await request(app)
            .post('/remote-monitoring')
            .send({
                remoteMonitoring: { ...remoteMonitoring, adoptionId: '' }
            })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    //SavePicture

    /* test('Successfully uploads jpg image', async () => {
        const testImage = `${__dirname}/../_remoteMonitoringPictures/test.jpg`

        let formData = new FormData();
			formData.append('publicationPicture', testImage)
			formData.append('publicationId', 1)
        
        const res = await request(app)
            .post(`/remote-monitoring/picture`)
             .send(formData)

        expect(res.statusCode).toEqual(204)
    }) */

     /* test('Should return empty object when delete remoteMonitoring and statusCode:204 | route: DELETE /remote-monitoring/:id', async () => {
         const res = await request(app).delete('/remote-monitoring/1')
 
         expect(res.statusCode).toEqual(204)
         expect(res.body).toEqual({})
 
         await request(app) // Recovery default
             .post('/remote-monitoring')
             .send({ ...remoteMonitoring, id: 1 })
 
         var logger = fs.createWriteStream('./_remoteMonitoringPictures/test.txt', { flags: 'a' })
         logger.write(`Arquivo utilizado para testes, não deletar...`)
         logger.end()
     })
 
     test('Should return empty object when delete remoteMonitoring, sending one valid id and statusCode=200 | route: DELETE /remote-monitoring/:id', async () => {
         const res = await request(app).delete('/remote-monitoring/1,x')
 
         expect(res.statusCode).toEqual(204)
         expect(res.body).toEqual({})
 
         await request(app) // Recovey default
             .post('/remote-monitoring')
             .send({ ...remoteMonitoring, id: 1 })
 
         var logger = fs.createWriteStream('./_remoteMonitoringPictures/test.txt', { flags: 'a' })
         logger.write(`Arquivo utilizado para testes, não deletar...`)
         logger.end()
     })
 
     test('Should return erro message when send all invalid id statusCode=200 | route: DELETE /remote-monitoring/:id', async () => {
         const res = await request(app).delete('/remote-monitoring/1x,y')
 
         expect(res.statusCode).toEqual(400)
         expect(res.error.text).toMatch(errorMessageIdentifier)
     }) */
})