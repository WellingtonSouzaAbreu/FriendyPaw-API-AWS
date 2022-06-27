const { app, request } = require('../apiTestConfig/requires.js')

const { collaborator, errorMessageIdentifier } = require('../apiTestConfig/dataTest.js')

describe('Testing api/collaborator.js', () => {
    test('Should return array with collaborator data and statusCode=200 | route: GET /collaborator', async () => {
        const res = await request(app).get('/collaborator')
        const isArray = Array.isArray(res.body)

        expect(res.statusCode).toEqual(200)
        expect(isArray).toEqual(true)
        expect(res.body[0]).toEqual({ ...collaborator, id: 1 })
    })

    test('Should return array with collaborator select options and statusCode=200 | route: GET /collaborator/select-options', async () => {
        const res = await request(app).get('/collaborator/select-options')
        const isArray = Array.isArray(res.body)

        expect(res.statusCode).toEqual(200)
        expect(isArray).toEqual(true)
        expect(res.body[0]).toEqual({ id: 1, name: collaborator.name, dateOfBirth: collaborator.dateOfBirth })
    })

    test('Should return collaborator data and statusCode=200 | route: GET /collaborator/:id', async () => {
        const res = await request(app).get('/collaborator/1')

        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual({ ...collaborator, id: 1 })
    })

    test('Should return error message when send invalid idCollaborator and statusCode=400 | route: GET /collaborator/:id', async () => {
        const res = await request(app).get('/collaborator/1x')

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return empty object when send collaborator data and statusCode=204 | route: POST /collaborator', async () => {
        const res = await request(app)
            .post('/collaborator')
            .send({
                collaborator: { ...collaborator }
            })

        expect(res.statusCode).toEqual(204)
        expect(res.body).toEqual({})
    })

    test('Should return error message when send invalid name and statusCode=400 | route: POST /collaborator', async () => {
        const res = await request(app)
            .post('/collaborator')
            .send({
                collaborator: { ...collaborator, name: '' }
            })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send invalid city and statusCode=400 | route: POST /collaborator', async () => {
        const res = await request(app)
            .post('/collaborator')
            .send({
                collaborator: { ...collaborator, city: '' }
            })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send invalid cellNumber and statusCode=400 | route: POST /collaborator', async () => {
        const res = await request(app)
            .post('/collaborator')
            .send({
                collaborator: { ...collaborator, cellNumber: '' }
            })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send invalid dateOfBirth and statusCode=400 | route: POST /collaborator', async () => {
        const res = await request(app)
            .post('/collaborator')
            .send({
                collaborator: { ...collaborator, dateOfBirth: '' }
            })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    // PUTS

    test('Should return empty object, changing name of Lucas Martins to Luluzinha and statusCode=204 | route: PUT /collaborator', async () => {
        const res = await request(app)
            .put('/collaborator')
            .send({
                collaborator: { ...collaborator, id: 1, name: 'Luluzinha' }
            })

        const resAlreayUpdate = await request(app).get('/collaborator/1')

        expect(res.statusCode).toEqual(204)
        expect(res.body).toEqual({})
        expect(resAlreayUpdate.body).toEqual({ ...collaborator, id: 1, name: 'Luluzinha' })

        await request(app) //Recovery to default
            .put('/collaborator')
            .send({
                collaborator: { ...collaborator, id: 1, name: 'Lucas Martins' }
            })
    })

    test('Should return error message when send invalid name and statusCode=400 | route: PUT /collaborator', async () => {
        const res = await request(app)
            .put('/collaborator')
            .send({
                collaborator: { ...collaborator, id: 1, name: '' }
            })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send invalid city and statusCode=400 | route: PUT /collaborator', async () => {
        const res = await request(app)
            .put('/collaborator')
            .send({
                collaborator: { ...collaborator, id: 1, city: '' }
            })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send invalid cellNumber and statusCode=400 | route: PUT /collaborator', async () => {
        const res = await request(app)
            .put('/collaborator')
            .send({
                collaborator: { ...collaborator, id: 1, cellNumber: '' }
            })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send invalid dateOfBirth and statusCode=400 | route: PUT /collaborator', async () => {
        const res = await request(app)
            .put('/collaborator')
            .send({
                collaborator: { ...collaborator, id: 1, dateOfBirth: '' }
            })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    // DELETE
    test('Should return empty object when delete collaborator and statusCode=200 | route: DELETE /collaborator/:id', async () => {
        const res = await request(app).delete('/collaborator/1')

        expect(res.statusCode).toEqual(204)
        expect(res.body).toEqual({})

        await request(app) // Recovey default
            .post('/collaborator')
            .send({ collaborator: { ...collaborator, id: 1 } })
    })

    test('Should return empty object when delete collaborator, sending one valid id and statusCode=200 | route: DELETE /collaborator/:id', async () => {
        const res = await request(app).delete('/collaborator/1,x')

        expect(res.statusCode).toEqual(204)
        expect(res.body).toEqual({})

        await request(app) // Recovey default
            .post('/collaborator')
            .send({ collaborator: { ...collaborator, id: 1 } })
    })

    test('Should return erro message when send all invalid id statusCode=200 | route: DELETE /collaborator/:id', async () => {
        const res = await request(app).delete('/collaborator/1x,y')

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })
})