import visa from 'creditcards-types/types/visa'

const validators = {
  requiredValidator: value => {
    if (value === undefined || value === '' || value === null) {
      return 'This field is required'
    }

    return undefined
  },

  emailValidator: value => {
    const regexPattern = /\S+@\S+\.\S+/
    const isValid = regexPattern.test(value)
    if (!isValid) {
      return 'Email format is not correct'
    }

    return undefined
  },

  postalCodeValidator: value => {
    const regexPattern = new RegExp('^[0-9]{5}$')
    const isValid = regexPattern.test(value)
    if (!isValid) {
      return 'Postal Code format is not correct'
    }

    return undefined
  },

  phoneNumberValidator: value => {
    const regexPattern = new RegExp('^[0-9]{10}$')
    const inputValue = String(value).replace(/\D/g, '')
    const isValid = regexPattern.test(inputValue)
    if (!isValid) {
      return 'Phone number format is not correct'
    }

    return undefined
  },

  creditCardValidator: value => {
    const regexPattern = new RegExp('^[0-9]{16}$')
    const inputValue = String(value).replace(/\D/g, '')
    const isValid = regexPattern.test(inputValue) && visa.test(inputValue)
    if (!isValid) {
      return 'Credit Card format is not correct'
    }

    return undefined
  },

  cvvCardValidator: value => {
    const regexPattern = new RegExp('^[0-9]{3}$')
    const isValid = regexPattern.test(value)
    if (!isValid) {
      return 'CVV format is not correct'
    }

    return undefined
  },

  expDateCardValidator: value => {
    const regexPattern = new RegExp('^[0-9]{2}/[0-9]{2}$')
    const inputValue = String(value).replace(/\s/g, '')

    const month = inputValue.split('/')[0]
    if (month && Number(month) > 12) {
      return 'Month Number is wrong'
    }

    const year = inputValue.split('/')[1]
    const currentYear = new Date().getFullYear().toString().substring(4, 2)
    if (year && Number(year) < currentYear) {
      return 'Card is expired'
    }

    const isValid = regexPattern.test(inputValue)
    if (!isValid) {
      return 'Expire date format is not correct'
    }

    return undefined
  },
}

const composeValidators =
  (...validators) =>
  value =>
    validators.reduce((error, validator) => error || validator(value), undefined)

export { validators, composeValidators }
