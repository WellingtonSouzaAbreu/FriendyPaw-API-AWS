const { request, app } = require('../apiTestConfig/requires.js')

const { visit, errorMessageIdentifier } = require('../apiTestConfig/dataTest.js')

describe('Testing api/visit.js', () => {
    test('Should return visits by adoption and statusCode=200 | route: GET /visit/:adoptionId', async () => {
        const res = await request(app).get('/visit/1')
        const isArray = Array.isArray(res.body)
        expect(res.statusCode).toEqual(200)
        expect(isArray).toEqual(true)
        expect(res.body[0]).toEqual({ ...visit, id: 1 })
    })

    test('Should return error message when send invalid adoptionId and statusCode=400 | route: GET /visit/:adoptionId', async () => {
        const res = await request(app).get('/visit/invalid')
        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return an empty object and statusCode=204 | route: POST /visit', async () => {
        const res = await request(app)
            .post('/visit')
            .send({
                visit: { ...visit }
            })

        expect(res.statusCode).toEqual(204)
        expect(res.body).toEqual({})
    })

    test('Should return error message when not send visit object and statusCode=400 | route: POST /visit', async () => {
        const res = await request(app)
            .post('/visit')
            .send({
                noVisit: { ...visit }
            })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send invalid report and statusCode=400 | route: POST /visit', async () => {
        const res = await request(app)
            .post('/visit')
            .send({
                visit: { ...visit, report: '' }
            })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send invalid adoptionId and statusCode=400 | route: POST /visit', async () => {
        const res = await request(app)
            .post('/visit')
            .send({
                visit: { ...visit, adoptionId: '' }
            })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send invalid date and statusCode=400 | route: POST /visit', async () => {
        const res = await request(app)
            .post('/visit')
            .send({
                visit: { ...visit, date: '' }
            })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return an empty object and statusCode=204  | route: DELETE /visit/:id', async () => {
        const res = await request(app).delete('/visit/1')
        expect(res.statusCode).toEqual(204)
        expect(res.body).toEqual({})

        await request(app) //Recovery deleted adoption
            .post('/visit')
            .send({
                visit: { ...visit, id: 1 }
            })
    })
})