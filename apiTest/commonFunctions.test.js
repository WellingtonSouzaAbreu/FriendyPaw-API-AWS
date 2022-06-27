const chalk = require('chalk')

const {
    showLog,
    convertStringToDate,
    convertStringWithCommaToArray,
    setFirstLetterUpperCase,
    setAllWordsWithInitialUpperCase
} = require('./../api/commonFunctions.js')

describe('Testing api/commonFunctions.js', () => {
    test('Should return custom console.log', () => {
        expect(showLog('message')).toBe(console.log('messag'))
    })

    test('Should convert string date in date', () => {
        expect(convertStringToDate('2022-03-03T19:39:54.517Z')).toEqual(new Date('2022-03-03T19:39:54.517Z'))
    })

    test('Should convert string with comma to array', () => {
        expect(convertStringWithCommaToArray('1,2,3')).toEqual(['1', '2', '3'])
    })

    test('Should return string with first letter uppercase', () => {
        expect(setFirstLetterUpperCase('word')).toBe('Word')
    })

    test('Should return string with all words initial uppercase', () => {
        expect(setAllWordsWithInitialUpperCase('this message')).toBe('This Message')
    })
})