const { app, request } = require('./../apiTestConfig/requires.js')

const { rescue, errorMessageIdentifier } = require('./../apiTestConfig/dataTest.js')

describe('Testing api/rescue.js', () => {
    test('Should return rescue data object and statusCode=200 | route: GET /rescue/:animalId', async () => {
        const res = await request(app).get('/rescue/1')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual({ ...rescue, id: 1 })
    })

    test('Should return error message when send invalid animalId and statusCode=400 | route: GET /rescue/:animalId', async () => {
        const res = await request(app).get('/rescue/1x')
        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return empty object, changing locale of Casa to Apartamento and statusCode=204 | route: PUT /rescue/:animalId', async () => {
        const res = await request(app)
            .put('/rescue/1')
            .send({
                rescue: { ...rescue, id: 1, locale: 'Apartamento' }
            })

        expect(res.statusCode).toEqual(204)
        expect(res.body).toEqual({})

        const resAfterUpdate = await request(app).get('/rescue/1')
        expect(resAfterUpdate.body).toEqual({ ...rescue, id: 1, locale: 'Apartamento' })

        await request(app)
            .put('/rescue/1')
            .send({
                rescue: { ...rescue}
            })
    })

    test('Should return error message when send empty object rescue and statusCode=400 | route: PUT /rescue/:animalId', async () => {
        const res = await request(app)
            .put('/rescue/1')
            .send({
                noRescue: { ...rescue, id: 1 }
            })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send invalid dateOfRescue and statusCode=400 | route: PUT /rescue/:animalId', async () => {
        const res = await request(app)
            .put('/rescue/1')
            .send({
                rescue: { ...rescue, id: 1, dateOfRescue: '' }
            })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send invalid address and statusCode=400 | route: PUT /rescue/:animalId', async () => {
        const res = await request(app)
            .put('/rescue/1')
            .send({
                rescue: { ...rescue, id: 1, address: '' }
            })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return empty object when send only invalid animalId in params and statusCode=204 | route: PUT /rescue/:animalId', async () => {
        const res = await request(app)
            .put('/rescue/1x')
            .send({
                rescue: { ...rescue, id: 1, locale: 'Apartamento' }
            })

        expect(res.statusCode).toEqual(204)
        expect(res.body).toEqual({})

        const resAfterUpdate = await request(app).get('/rescue/1')
        expect(resAfterUpdate.body).toEqual({ ...rescue, id: 1, locale: 'Apartamento' })

        await request(app)
            .put('/rescue/1')
            .send({
                rescue: { ...rescue }
            })
    })

    test('Should return empty object when send only invalid animalId in body and statusCode=204 | route: PUT /rescue/:animalId', async () => {
        const res = await request(app)
            .put('/rescue/1')
            .send({
                rescue: { ...rescue, id: 1, animalId: '1x', locale: 'Apartamento' }
            })

        expect(res.statusCode).toEqual(204)
        expect(res.body).toEqual({})

        const resAfterUpdate = await request(app).get('/rescue/1')
        expect(resAfterUpdate.body).toEqual({ ...rescue, id: 1, locale: 'Apartamento' })

        await request(app)
            .put('/rescue/1')
            .send({
                rescue: { ...rescue }
            })
    })

    test('Should return error message when send invalid veterinaryCareId and statusCode=400 | route: PUT /rescue/:animalId', async () => {
        const res = await request(app)
            .put('/rescue/1')
            .send({
                rescue: { ...rescue, id: 1, veterinaryCareId: '' }
            })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })
})