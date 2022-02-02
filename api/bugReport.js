const fs = require('fs')

module.exports = app => {
    function writeInBugReport(errorMessage, file) {
        var logger = fs.createWriteStream('./bugReport/bugs.txt', {
            flags: 'a'
        })

        console.log(errorMessage)

        const objectError = {
            dateTime: new Date(),
            file: file,
            message: errorMessage.toString(),
        }

        logger.write(`${JSON.stringify(objectError)}\n\n`) 

        logger.end()
        return
    }

    return { writeInBugReport }
}