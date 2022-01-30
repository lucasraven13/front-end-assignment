import '../css/checkout/checkout.css'
import 'notyf/notyf.min.css'
import 'css-only-tooltip/dist/styles.min.css'

import IMask from 'imask'
import { createForm } from 'final-form'
import { validators, composeValidators } from './validation'
import { Notyf } from 'notyf'

const notyf = new Notyf({
  duration: 1000,
  position: {
    x: 'center',
    y: 'top',
  },
})

document.querySelectorAll('[input-mask]').forEach(item => {
  const maskPattern = item.getAttribute('input-mask')
  IMask(item, {
    mask: maskPattern,
  })
})

const onSubmit = values => {
  setFormIsLoading()
  const url = document.getElementById('checkout').getAttribute('data-request')
  fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(values, (key, value) => {
      if (typeof value === 'string') {
        return value.replace(/\s|-/g, '')
      }
      return value
    }),
  })
    .then(response => {
      return response.json()
    })
    .then(data => {
      if (data.errors) {
        showErrors(data)
      } else {
        notyf.success(data.message)
      }
    })
    .catch(error => {
      console.log(error)
    })
    .finally(() => {
      setFormLoaded()
    })
}

const form = createForm({
  onSubmit,
  initialValues: {
    country: 'United States',
  },
  validate: values => {
    let errors = {}

    ;[...document.forms[0]].forEach(input => {
      if (input.name) {
        const validatorNames = document
          .getElementsByName(input.name)[0]
          .getAttribute('data-validators')
        const validatorFunctions =
          validatorNames && validatorNames.split(',').map(x => validators[x])
        const composedValidator = composeValidators(...validatorFunctions)
        const validationResult = composedValidator(values[input.name])

        if (validationResult !== undefined) {
          errors[input.name] = validationResult
        } else {
          delete errors[input.name]
        }
      }
    })

    return errors
  },
})

document.getElementById('checkout').addEventListener('submit', event => {
  event.preventDefault()
  form.submit()
})

const registered = {}

const registerField = input => {
  const { name } = input
  form.registerField(
    name,
    fieldState => {
      const { blur, change, error, focus, touched } = fieldState
      const errorElement = document.getElementById(name + '_error')
      if (!registered[name]) {
        // first time, register event listeners
        input.addEventListener('blur', () => blur())
        input.addEventListener('input', event =>
          change(input.type === 'checkbox' ? event.target.checked : event.target.value)
        )
        input.addEventListener('focus', () => focus())
        registered[name] = true
      }

      // show/hide errors
      if (errorElement) {
        if (touched && error) {
          errorElement.innerHTML = error
          errorElement.style.display = 'block'
        } else {
          errorElement.innerHTML = ''
          errorElement.style.display = 'none'
        }
      }
    },
    {
      value: true,
      error: true,
      touched: true,
    }
  )
}

const showErrors = data => {
  let errorText = ''
  data.errors.forEach(error => {
    errorText += `<p>${error.field}: ${error.message}</p>`
  })

  notyf.error({
    message: errorText,
    duration: 3000,
  })
}

const setFormIsLoading = () => {
  document.getElementById('submit-button').setAttribute('disabled', 'disabled')
  document.getElementById('submit-loader').classList.remove('invisible')
}

const setFormLoaded = () => {
  document.getElementById('submit-button').removeAttribute('disabled')
  document.getElementById('submit-loader').classList.add('invisible')
}

;[...document.forms[0]].forEach(input => {
  if (input.name) {
    registerField(input)
  }
})
