const { request, app } = require('../apiTestConfig/requires.js')

const { veterinaryCare, errorMessageIdentifier } = require('./../apiTestConfig/dataTest.js')

describe('Testing api/visit.js', () => {
    test('Should return array containing veterinary care data and statusCode=200 | route: GET /veterinay-care/:id', async () => {
        const res = await request(app).get('/veterinary-care/1')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual({ ...veterinaryCare, id: 1 })
    })

    test('Should return error message when send invalid id and statusCode=400 | route: GET /veterinay-care/:id', async () => {
        const res = await request(app).get('/veterinary-care/invalid')
        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return an empty object and statusCode=204 | route: POST /veterinay-care', async () => {
        const res = await request(app)
            .post('/veterinary-care')
            .send({
                veterinaryCare: { ...veterinaryCare }
            })

        expect(res.statusCode).toEqual(204)
        expect(res.body).toEqual({})
    })

    test('Should return error message when not send veterinaryCare object and statusCode=400 | route: POST /veterinay-care', async () => {
        const res = await request(app)
            .post('/veterinary-care')
            .send({
                noVeterinaryCare: { ...veterinaryCare }
            })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send invalid veterinaryName and statusCode=400 | route: POST /veterinay-care', async () => {
        const res = await request(app)
            .post('/veterinary-care')
            .send({
                veterinaryCare: { ...veterinaryCare, veterinaryName: '' }
            })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send invalid totalCostOfTreatment and statusCode=400 | route: POST /veterinay-care', async () => {
        const res = await request(app)
            .post('/veterinary-care')
            .send({
                veterinaryCare: { ...veterinaryCare, totalCostOfTreatment: null }
            })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send invalid dateOfVeterinaryCare and statusCode=400 | route: POST /veterinay-care', async () => {
        const res = await request(app)
            .post('/veterinary-care')
            .send({
                veterinaryCare: { ...veterinaryCare, dateOfVeterinaryCare: '' }
            })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when not send numeric totalCostOfTreatment and statusCode=400 | route: POST /veterinay-care', async () => {
        const res = await request(app)
            .post('/veterinary-care')
            .send({
                veterinaryCare: { ...veterinaryCare, totalCostOfTreatment: '10s' }
            })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return am empty object, changing totalCost of 500 to 1000 and statusCode=204 | route PUT /veterinary-care', async () => {
        const res = await request(app)
            .put('/veterinary-care')
            .send({
                veterinaryCare: { ...veterinaryCare, id: 1, totalCostOfTreatment: 1000 }
            })

        const resAfterUpdate = await request(app)
            .get('/veterinary-care/1')

        expect(res.statusCode).toEqual(204)
        expect(res.body).toEqual({})
        expect(resAfterUpdate.body).toEqual({ ...veterinaryCare, id: 1, totalCostOfTreatment: 1000 })

        await request(app) // Recovery tuple to default
            .put('/veterinary-care')
            .send({
                veterinaryCare: { ...veterinaryCare, id: 1, totalCostOfTreatment: 500 }
            })
    })

    test('Should return error message when not send veterinaryCare object and statusCode=400 | route PUT /veterinary-care', async () => {
        const res = await request(app)
            .put('/veterinary-care')
            .send({
                noVeterinaryCare: { ...veterinaryCare }
            })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })


    test('Should return error message when send invalid id and statusCode=400 | route PUT /veterinary-care', async () => {
        const res = await request(app)
            .put('/veterinary-care')
            .send({
                veterinaryCare: { ...veterinaryCare, id: '10x' }
            })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return an empty object and statusCode=204  | route: DELETE /veterinay-care/:id', async () => {
        const res = await request(app).delete('/veterinary-care/1')
        expect(res.statusCode).toEqual(204)
        expect(res.body).toEqual({})

        await request(app) //Recovery deleted adoption
            .post('/veterinary-care')
            .send({
                veterinaryCare: { ...veterinaryCare, id: 1 }
            })
    })

    test('Should return error message when send invalid id and statusCode=400  | route: DELETE /veterinay-care/:id', async () => {
        const res = await request(app).delete('/veterinary-care/invalidId')
        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })
})