const chalk = require('chalk')
const {writeInBugReport} = require('../bugReport/bugReport.js')

const showLog = (message, logType) => {
    let customMessage
    if (logType == 'error') {
        customMessage = chalk.red(message)
    } else {
        customMessage = chalk.green(message)
    }
    return console.log(customMessage)
}

const showAndRegisterError = (err, filename) => {
    showLog(err, 'error')
    writeInBugReport(err, filename)
}

const convertStringToDate = (stringDate) => {
    return new Date(stringDate)
}

const convertStringWithCommaToArray = (string) => {
    return string.split(',')
}

const setFirstLetterUpperCase = (text) => {
    let modifiedText = text[0].toUpperCase() + text.substring(1, text.length)
    return modifiedText
}

const setAllWordsWithInitialUpperCase = (text) => {
    const conjunctions = ['das', 'dos', 'uns', 'pra', 'aos', 'nas', 'nos']
    let words = text.split(' ')

    let modifiedText = words.map(word => {
        if (word.length > 2 || word[1] == '.' && !conjunctions.includes(word)) {
            return word[0] = word[0].toUpperCase() + word.substring(1, word.length)
        } else {
            return word
        }
    })

    return modifiedText.join(' ')
}

module.exports = {
    showLog,
    showAndRegisterError,
    convertStringToDate,
    convertStringWithCommaToArray,
    setFirstLetterUpperCase,
    setAllWordsWithInitialUpperCase
}