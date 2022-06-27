module.exports = app => {

    const existsOrError = (value, msg) => {
        if (!value) throw msg
        if (Array.isArray(value) && value.length === 0) throw msg
        if (typeof value === 'string' && !value.trim()) throw msg
    }

    const objectIsNull = (object) => {
        if (!object) return true

        if (typeof object == 'object') {
            return Object.keys(object).length == 0
        } else {
            return false
        }
    }

    const isNumber = (value) => {
        return !isNaN(value)
    }

    const isValidId = (value) => {
        try {
            if(!isNumber(value)) throw 'NaN'
            
            const numericValue = Number.parseInt(value)
            return Number.isInteger(numericValue) && numericValue > 0
        } catch (err) {
            return false
        }
    }

    return {
        existsOrError,
        objectIsNull,
        isNumber,
        isValidId
    }
}