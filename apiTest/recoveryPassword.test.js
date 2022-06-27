const { errorMessageIdentifier, token } = require('../apiTestConfig/dataTest.js')
const { app, request } = require('./../apiTestConfig/requires.js')

describe('Testing api/recoveryPassword.js', () => {
   /*  test('Should return objectRecoveyType containing value Admin and statusCode=200 | route: POST /generate-recovery-password', async () => {
        const res = await request(app)
            .post('/generate-recovery-password')
            .send({ user: 'Admin' })

        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual({recoveryType: 'email'})
    }) */

   /*  test('Should return objectRecoveyType containing value cellNumber and statusCode=200 | route: POST /generate-recovery-password', async () => {
        jest.setTimeout(10000);

        const res = await request(app)
            .post('/generate-recovery-password')
            .send({ user: '+55 69 992846582' })

        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual({recoveryType: 'cellNumber'})
    }) */

    test('Should return error message when send invalid user and statusCode=400 | route: POST /generate-recovery-password', async () => {
        const res = await request(app)
            .post('/generate-recovery-password')
            .send({ user: 'xxxx-xxxx' })

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return empty object and statusCode=204 | route: PUT /recovery-password', async () => {
        const res = await request(app)
            .put('/recovery-password?endpoint=endpointFixed')
            .send({ token: token.split(' ')[1], password: '123456789' })

        expect(res.statusCode).toEqual(204)
        expect(res.body).toEqual({})
    }) 
})