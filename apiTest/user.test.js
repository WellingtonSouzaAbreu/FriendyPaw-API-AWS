const { app, request } = require('./../apiTestConfig/requires.js')

const { existsOrError, objectIsNull, isNumber } = app.api.validation
const { concatNameAndCellNumber } = require('./../api/user.js')

const { token, errorMessageIdentifier, user, getRandomEmail, getRandomCellNumber } = require('./../apiTestConfig/dataTest.js')

describe('Testing api/user.js', () => {
    test('Should return user data by id and statusCode=200 | route: GET /user/:id', async () => {
        const res = await request(app)
            .get('/user/1')
            .set('Authorization', token);

        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual({ ...user, id: 1 })
    })

    test('Should return user data for invalid id URL(force get passport id) and statusCode=200 | route: GET /user/:id', async () => {
        const res = await request(app)
            .get('/user/invalid')
            .set('Authorization', token);

        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual({ ...user, id: 1 })
    })

    test('Should return user select options statusCode=200 | route: GET /user/select-options', async () => {
        const res = await request(app).get('/user/select-options?userName=Adm')

        expect(res.statusCode).toEqual(200)
        expect(res.body[0]).toEqual({ id: 1, label: `${user.name} - ${user.cellNumber}` })
    })

    test('Should return error message for URL params with length < 3 and statusCode=400 | route: GET /user/select-options', async () => {
        const res = await request(app).get('/user/select-options?userName=Ad')

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message for URL without params and statusCode=400 | route: GET /user/select-options', async () => {
        const res = await request(app).get('/user/select-options')

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return a empty object and statusCode=204 | route: POST /signup', async () => {
        const res = await request(app)
            .post('/signup')
            .send({
                user: {
                    ...user,
                    password: '10101010',
                    confirmPassword: '10101010',
                    email: getRandomEmail(),
                    cellNumber: getRandomCellNumber()
                },
            });

        expect(res.statusCode).toEqual(204)
        expect(res.body).toEqual({})
    })

    test('Should return error message when not sent user object and statusCode=400 | route: POST /signup', async () => {
        const res = await request(app)
            .post('/signup')
            .send({
                notAUser: {
                    ...user,
                    password: '10101010',
                    confirmPassword: '10101010',
                    email: getRandomEmail(),
                    cellNumber: getRandomCellNumber()
                },
            });

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when not send user name and statusCode=400 | route: POST /signup', async () => {
        const res = await request(app)
            .post('/signup')
            .send({
                user: {
                    ...user,
                    name: '',
                    password: '10101010',
                    confirmPassword: '10101010',
                    email: getRandomEmail(),
                    cellNumber: getRandomCellNumber()
                },
            });

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })


    test('Should return error message when not send user cellNumber and statusCode=400 | route: POST /signup', async () => {
        const res = await request(app)
            .post('/signup')
            .send({
                user: {
                    ...user,
                    password: '10101010',
                    confirmPassword: '10101010',
                    email: getRandomEmail(),
                    cellNumber: ''
                },
            });

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when not send user password and statusCode=400 | route: POST /signup', async () => {
        const res = await request(app)
            .post('/signup')
            .send({
                user: {
                    ...user,
                    confirmPassword: '10101010',
                    email: getRandomEmail(),
                    cellNumber: getRandomCellNumber()
                },
            });

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when not send user confirmPassword and statusCode=400 | route: POST /signup', async () => {
        const res = await request(app)
            .post('/signup')
            .send({
                user: {
                    ...user,
                    password: '10101010',
                    email: getRandomEmail(),
                    cellNumber: getRandomCellNumber()
                },
            });

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send user password.length < 8 and statusCode=400 | route: POST /signup', async () => {
        const res = await request(app)
            .post('/signup')
            .send({
                user: {
                    ...user,
                    password: '1234567',
                    confirmPassword: '123456',
                    email: getRandomEmail(),
                    cellNumber: getRandomCellNumber()
                },
            });

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send user password and confirm password not equals and statusCode=400 | route: POST /signup', async () => {
        const res = await request(app)
            .post('/signup')
            .send({
                user: {
                    ...user,
                    password: 'xxxxxxxx',
                    confirmPassword: 'yyyyyyyy',
                    email: getRandomEmail(),
                    cellNumber: getRandomCellNumber()
                },
            });

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send invalid email and statusCode=400 | route: POST /signup', async () => {
        const res = await request(app)
            .post('/signup')
            .send({
                user: {
                    ...user,
                    password: '10101010',
                    confirmPassword: '10101010',
                    email: 'xxxxx.com',
                    cellNumber: getRandomCellNumber()
                },
            });

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send cellNumber that already exists and statusCode=400 | route: POST /signup', async () => {
        const res = await request(app)
            .post('/signup')
            .send({
                user: {
                    ...user,
                    password: '10101010',
                    confirmPassword: '10101010',
                    email: getRandomEmail(),
                },
            });

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return a user data, token and statusCode=200 | route: POST /signin', async () => {
        const res = await request(app)
            .post('/signin')
            .send({
                cellNumber: user.cellNumber,
                password: '10101010',
            });

        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual({
            id: 1,
            name: user.name,
            cellNumber: user.cellNumber,
            token: token.split(' ')[1]
        })
    })

    test('Should return true for valid token and statusCode=200 | route: POST /validate-token', async () => {
        const res = await request(app)
            .post('/validate-token')
            .set('Authorization', token);

        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(true)
    })

    test('Should return false for invalid token and statusCode=400 | route: POST /validate-token', async () => {
        const res = await request(app)
            .post('/validate-token')
            .set('Authorization', `${token}xx`);

        expect(res.statusCode).toEqual(400)
        expect(res.body).toEqual(false)
    })

    test('Should return error message for missing token in authorizatoin and statusCode=400 | route: POST /validate-token', async () => {
        const res = await request(app)
            .post('/validate-token')

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return am empty object, changing houseNumber of 5555 to 1000 and statusCode=204 | route PUT /user/:id', async () => {
        const res = await request(app)
            .put('/user/1')
            .send({
                user: {
                    ...user,
                    password: '10101010',
                    confirmPassword: '10101010',
                    houseNumber: '1000'
                }
            }).set('Authorization', token);

        const resAfterUpdate = await request(app)
            .get('/user/1')
            .set('Authorization', `${token}`);

        await request(app) // Recovery tuple to default
            .put('/user/1')
            .send({
                user: {
                    ...user,
                    password: '10101010',
                    confirmPassword: '10101010',
                    houseNumber: '5555'
                }
            }).set('Authorization', token);

        expect(res.statusCode).toEqual(204)
        expect(res.body).toEqual({})
        expect(resAfterUpdate.body).toEqual({ ...user, id: 1, houseNumber: '1000' })
    })

    test('Should return error message when not send user name and statusCode=400 | route PUT /user/:id', async () => {
        const res = await request(app)
            .put('/user/1')
            .send({
                user: {
                    ...user,
                    name: '',
                    password: '10101010',
                    confirmPassword: '10101010',
                }
            }).set('Authorization', token);

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when not send user cellNumber and statusCode=400 | route PUT /user/:id', async () => {
        const res = await request(app)
            .put('/user/1')
            .send({
                user: {
                    ...user,
                    cellNumber: '',
                    password: '10101010',
                    confirmPassword: '10101010',
                }
            }).set('Authorization', token);

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send password.length < 8 and statusCode=400 | route PUT /user/:id', async () => {
        const res = await request(app)
            .put('/user/1')
            .send({
                user: {
                    ...user,
                    password: '1010101',
                    confirmPassword: '10101010',
                }
            }).set('Authorization', token);

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when passwords send not match and statusCode=400 | route PUT /user/:id', async () => {
        const res = await request(app)
            .put('/user/1')
            .send({
                user: {
                    ...user,
                    password: '10101010',
                    confirmPassword: 'xxxxxxxx',
                }
            }).set('Authorization', token);

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })

    test('Should return error message when send invalid email and statusCode=400 | route PUT /user/:id', async () => {
        const res = await request(app)
            .put('/user/1')
            .send({
                user: {
                    ...user,
                    email: 'xxxxxxx.com', // No @
                    password: '10101010',
                    confirmPassword: '10101010',
                }
            }).set('Authorization', token);

        expect(res.statusCode).toEqual(400)
        expect(res.error.text).toMatch(errorMessageIdentifier)
    })
})