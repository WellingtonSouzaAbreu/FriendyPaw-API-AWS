const { app, request } = require('./../apiTestConfig/requires.js')

const { temporaryHome, temporaryHomeWithAnimalUserInfo, errorMessageIdentifier } = require('./../apiTestConfig/dataTest.js')

describe('Testing api/temporaryHome.js', () => {
    test('Should return array containing temporaryHome data and statusCode=200 | route: GET /temporary-home', async () => {
        const res = await request(app).get('/temporary-home')
        const isArray = Array.isArray(res.body)
        expect(res.statusCode).toEqual(200)
        expect(isArray).toEqual(true)
        expect(res.body[0]).toEqual({ ...temporaryHomeWithAnimalUserInfo, id: 1 })
    })

    test('Should return temporaryHome by id and statusCode=200 | route: GET /temporary-home/:id', async () => {
        const res = await request(app).get('/temporary-home/1')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual({ ...temporaryHome, id: 1 })
    })

    test('Should return error message when send invalid id and statusCode=400 | route: GET /temporary-home/:id', async () => {
        const res = await request(app).get('/temporary-home/invalid')
        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return an empty object when send all fields and statusCode=204 | route: POST /temporary-home', async () => {
        const res = await request(app)
            .post('/temporary-home')
            .send({ temporaryHome: { ...temporaryHome } })

        expect(res.statusCode).toEqual(204)
        expect(res.body).toEqual({})
    })

    test('Should return error message when not send temporaryHomeObject and statusCode=400 | route: POST /temporary-home', async () => {
        const res = await request(app)
            .post('/temporary-home')
            .send({ noTemporaryHome: { ...temporaryHome } })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send invalid adopterName and statusCode=400 | route: POST /temporary-home', async () => {
        const res = await request(app)
            .post('/temporary-home')
            .send({ temporaryHome: { ...temporaryHome, adopterName: '' } })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send invalid cellNumber and statusCode=400 | route: POST /temporary-home', async () => {
        const res = await request(app)
            .post('/temporary-home')
            .send({ temporaryHome: { ...temporaryHome, cellNumber: '' } })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send invalid date and statusCode=400 | route: POST /temporary-home', async () => {
        const res = await request(app)
            .post('/temporary-home')
            .send({ temporaryHome: { ...temporaryHome, date: '' } })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send invalid animalId and statusCode=400 | route: POST /temporary-home', async () => {
        const res = await request(app)
            .post('/temporary-home')
            .send({ temporaryHome: { ...temporaryHome, animalId: 'x' } })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return an empty object, changing adopterName of Gabriel to Wellington and statusCode=204 | route: PUT /temporary-home', async () => {
        const res = await request(app)
            .put('/temporary-home')
            .send({ temporaryHome: { ...temporaryHome, id: 1, adopterName: 'Wellington' } })

        const resAfterUpdate = await request(app).get('/temporary-home/1')

        expect(res.statusCode).toEqual(204)
        expect(res.body).toEqual({})
        expect(resAfterUpdate.body).toEqual({ ...temporaryHome, id: 1, adopterName: 'Wellington' })

        await request(app) //Recovery default data
            .put('/temporary-home')
            .send({ temporaryHome: { ...temporaryHome, id: 1 } })
    })

    test('Should return error message when not send temporaryHomeObject and statusCode=400 | route: PUT /temporary-home', async () => {
        const res = await request(app)
            .put('/temporary-home')
            .send({ noTemporaryHome: { ...temporaryHome } })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send invalid adopterName and statusCode=400 | route: PUT /temporary-home', async () => {
        const res = await request(app)
            .put('/temporary-home')
            .send({ temporaryHome: { ...temporaryHome, id: 1, adopterName: '' } })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send invalid cellNumber and statusCode=400 | route: PUT /temporary-home', async () => {
        const res = await request(app)
            .put('/temporary-home')
            .send({ temporaryHome: { ...temporaryHome, id: 1, cellNumber: '' } })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send invalid date and statusCode=400 | route: PUT /temporary-home', async () => {
        const res = await request(app)
            .put('/temporary-home')
            .send({ temporaryHome: { ...temporaryHome, id: 1, date: '' } })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send invalid animalId and statusCode=400 | route: PUT /temporary-home', async () => {
        const res = await request(app)
            .put('/temporary-home')
            .send({ temporaryHome: { ...temporaryHome, id: 1, animalId: '' } })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send invalid animalId and statusCode=400 | route: PUT /temporary-home', async () => {
        const res = await request(app)
            .put('/temporary-home')
            .send({ temporaryHome: { ...temporaryHome, animalId: '' } })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return empty object when delete temporaryHome and statusCode=200 | route: DELETE /temporary-home/:id', async () => {
        const res = await request(app).delete('/temporary-home/1')

        expect(res.statusCode).toEqual(204)
        expect(res.body).toEqual({})

        await request(app) // Recovey default
            .post('/temporary-home')
            .send({ temporaryHome: { ...temporaryHome, id: 1 } })
    })

    test('Should return empty object when delete temporaryHome, sending one valid id and statusCode=200 | route: DELETE /temporary-home/:id', async () => {
        const res = await request(app).delete('/temporary-home/1,x')

        expect(res.statusCode).toEqual(204)
        expect(res.body).toEqual({})

        await request(app) // Recovey default
            .post('/temporary-home')
            .send({ temporaryHome: { ...temporaryHome, id: 1 } })
    })

    test('Should return erro message when send all invalid id statusCode=200 | route: DELETE /temporary-home/:id', async () => {
        const res = await request(app).delete('/temporary-home/1x,y')

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })
})