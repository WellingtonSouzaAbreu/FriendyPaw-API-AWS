const { app, request } = require('./../apiTestConfig/requires.js')
const { complaint, errorMessageIdentifier } = require('./../apiTestConfig/dataTest.js')

describe('Testing api/complaint.js', () => {
    test('Should return array of complaints and statusCode:200 | route: GET /complaint', async () => {
        const res = await request(app).get('/complaint')
        const isArray = Array.isArray(res.body)

        expect(res.statusCode).toEqual(200)
        expect(isArray).toEqual(true)
        expect(res.body[0]).toEqual({ ...complaint, id: 1 })
    })

    test('Should return complaints data and statusCode:200 | route: GET /complaint/:id', async () => {
        const res = await request(app).get('/complaint/1')

        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual({ ...complaint, id: 1 })
    })

    test('Should return error message when send invalid id and statusCode:400 | route: GET /complaint/:id', async () => {
        const res = await request(app).get('/complaint/1sd')

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return array of complaints and statusCode:200 | route: PUT /complaint/change-state/:id/:state', async () => {
        const res = await request(app).put('/complaint/change-state/1/true')
        const resAfterUpdate = await request(app).get('/complaint/1')

        expect(res.statusCode).toEqual(200)
        expect(resAfterUpdate.body).toEqual({ ...complaint, id: 1, verified: 1 })

        await request(app).put('/complaint/change-state/1/false') // Recovery default
    })

    test('Should return error message when send invalid id and statusCode:400 | route: PUT /complaint/change-state/:id/:state', async () => {
        const res = await request(app).put('/complaint/change-state/1x/true')

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send invalid state and statusCode:400 | route: PUT /complaint/change-state/:id/:state', async () => {
        const res = await request(app).put('/complaint/change-state/1/truex')

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return empty object when send valid datas and statusCode:204 | route: POST /complaint', async () => {
        const res = await request(app)
            .post('/complaint')
            .send({
                complaint: { ...complaint }
            })

        expect(res.statusCode).toEqual(204)
        expect(res.body).toEqual({})
    })

    test('Should return error message when not send object complaint and statusCode:400 | route: POST /complaint', async () => {
        const res = await request(app)
            .post('/complaint')
            .send({
                noComplaint: { ...complaint }
            })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send invalid description and statusCode:400 | route: POST /complaint', async () => {
        const res = await request(app)
            .post('/complaint')
            .send({
                complaint: { ...complaint, description: '' }
            })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send invalid address and statusCode:400 | route: POST /complaint', async () => {
        const res = await request(app)
            .post('/complaint')
            .send({
                complaint: { ...complaint, address: '' }
            })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send invalid complaintType and statusCode:400 | route: POST /complaint', async () => {
        const res = await request(app)
            .post('/complaint')
            .send({
                complaint: { ...complaint, complaintType: '' }
            })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send invalid city and statusCode:400 | route: POST /complaint', async () => {
        const res = await request(app)
            .post('/complaint')
            .send({
                complaint: { ...complaint, city: '' }
            })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send invalid district and statusCode:400 | route: POST /complaint', async () => {
        const res = await request(app)
            .post('/complaint')
            .send({
                complaint: { ...complaint, district: '' }
            })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send unespected attribute and statusCode:500 | route: POST /complaint', async () => {
        const res = await request(app)
            .post('/complaint')
            .send({
                complaint: { ...complaint, fruit: 'apple' }
            })

        expect(res.statusCode).toEqual(500)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return empty object when delete complaint and statusCode:204 | route: DELETE /complaint/:id', async () => {
        const res = await request(app).delete('/complaint/1')
        expect(res.statusCode).toEqual(204)
        expect(res.body).toEqual({})

        await request(app) // Recovery default
            .post('/complaint')
            .send({
                complaint: { ...complaint, id: 1 }
            })
    })

    test('Should return empty object when delete complaint, sending one valid id and statusCode=200 | route: DELETE /complaint/:id', async () => {
        const res = await request(app).delete('/complaint/1,x')
        expect(res.statusCode).toEqual(204)
        expect(res.body).toEqual({})

        await request(app) // Recovey default
            .post('/complaint')
            .send({ complaint: { ...complaint, id: 1 } })
    })

    test('Should return erro message when send all invalid id statusCode=200 | route: DELETE /complaint/:id', async () => {
        const res = await request(app).delete('/complaint/1x,y')
        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })
})