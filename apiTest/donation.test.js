const { app, request } = require('./../apiTestConfig/requires.js')
const { donation, token, errorMessageIdentifier } = require('./../apiTestConfig/dataTest.js')

describe('Testing api/donation.js', () => {
    test('Should return array of donations and statusCode=200 | route: GET /donation', async () => {
        const res = await request(app).get('/donation').set('Authorization', token)
        expect(res.statusCode).toEqual(200)
        expect(res.body[0]).toEqual({ ...donation, id: 1 })
    })

    test('Should return donation data when send valid id and statusCode=200 | route: GET /donation/:id', async () => {
        const res = await request(app).get('/donation/1')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual({ ...donation, id: 1 })
    })

    /*  test('Should return (something) and statusCode=200 | route: GET /donation/number-of-donations-received', async () => {
         const res = await request(app).get('/donation/number-of-donations-received')
         // expect(res.statusCode).toEqual(200)
         expect(res.body).toEqual('something')
     }) */

    test('Should return empty object when send valid datas and statusCode=204 | route: POST /donation', async () => {
        const res = await request(app)
            .post('/donation')
            .send({ ...donation })
            .set('Authorization', token)

        expect(res.statusCode).toEqual(204)
        expect(res.body).toEqual({})
    })

    test('Should return error messag when header Authorization contains invalid id and statusCode=401 | route: POST /donation', async () => {
        const res = await request(app)
            .post('/donation')
            .send({ ...donation })
            .set('Authorization', token.substring(0, token.length - 2))

        expect(res.statusCode).toEqual(401)
        expect(res.error.text).toMatch('Unauthorized')
    })

    test('Should return empty object when send invalid name and statusCode=204 | route: POST /donation', async () => {
        const res = await request(app)
            .post('/donation')
            .send({ ...donation, name: '' })
            .set('Authorization', token)

        expect(res.statusCode).toEqual(204)
        expect(res.body).toEqual({})
    })

    test('Should return empty object when send invalid cellNumber and statusCode=204 | route: POST /donation', async () => {
        const res = await request(app)
            .post('/donation')
            .send({ ...donation, cellNumber: '' })
            .set('Authorization', token)

        expect(res.statusCode).toEqual(204)
        expect(res.body).toEqual({})
    })

    test('Should return empty object when send invalid date and statusCode=204 | route: POST /donation', async () => {
        const res = await request(app)
            .post('/donation')
            .send({ ...donation, date: '' })
            .set('Authorization', token)

        expect(res.statusCode).toEqual(204)
        expect(res.body).toEqual({})
    })

    test('Should return error message when send invalid description and statusCode=400 | route: POST /donation', async () => {
        const res = await request(app)
            .post('/donation')
            .send({ ...donation, description: '' })
            .set('Authorization', token)

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return empty object when send invalid cellNumber and statusCode=204 | route: PUT /donation', async () => {
        const res = await request(app)
            .put('/donation')
            .send({ ...donation, id: 1, cellNumber: '' })
            .set('Authorization', token)

        expect(res.statusCode).toEqual(204)
        expect(res.body).toEqual({})
    })

    test('Should return empty object when send invalid date and statusCode=204 | route: PUT /donation', async () => {
        const res = await request(app)
            .put('/donation')
            .send({ ...donation, id: 1, /* date: ''  */})
            .set('Authorization', token)

        expect(res.statusCode).toEqual(204)
        expect(res.body).toEqual({})
    })

    test('Should return error message when send invalid description and statusCode=400 | route: PUT /donation', async () => {
        const res = await request(app)
            .put('/donation')
            .send({ ...donation, id: 1, description: '' })
            .set('Authorization', token)

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return empty object when change donationReceived of 0 to 1 and statusCode=200 | route: PUT /donation/change-state/:id/:state', async () => {
        const res = await request(app).put('/donation/change-state/1/true')
        const resAfterUpdate = await request(app).get('/donation/1')

        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual({})
        expect(resAfterUpdate.body).toEqual({ ...donation, id: 1, donationReceived: 1 })

        await request(app).put('/donation/change-state/1/false') // Recovery default
    })

    test('Should return error message when send invalid id and statusCode=400 | route: PUT /donation/change-state/:id/:state', async () => {
        const res = await request(app).put('/donation/change-state/1x/true')
        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send invalid state and statusCode=400 | route: PUT /donation/change-state/:id/:state', async () => {
        const res = await request(app).put('/donation/change-state/1/falsuMemo')
        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    // TODO Add Method PUT
    /* test('Should return empty object when delete donation and statusCode:204 | route: DELETE /donation/:id', async () => {
        const res = await request(app).delete('/donation/1')

        expect(res.statusCode).toEqual(204)
        expect(res.body).toEqual({})

        await request(app) // Recovery default
            .post('/donation')
            .send({ ...donation, id: 1 })
    })

    test('Should return empty object when delete donation, sending one valid id and statusCode=200 | route: DELETE /donation/:id', async () => {
        const res = await request(app).delete('/donation/1,x')

        expect(res.statusCode).toEqual(204)
        expect(res.body).toEqual({})

        await request(app) // Recovey default
            .post('/donation')
            .send({ ...donation, id: 1 })
    }) */

    test('Should return erro message when send all invalid id statusCode=200 | route: DELETE /donation/:id', async () => {
        const res = await request(app).delete('/donation/1x,y')

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })
})