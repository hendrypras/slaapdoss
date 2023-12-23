const moment = require('moment')
const Joi = require('joi')
const isUnixTimestamp = value => {
  return !isNaN(value) && parseInt(value) == value && value >= 0
}
const isValidStartTime = unix => {
  const formattedTime = moment(unix).format('HH:mm:ss')
  return formattedTime === '14:00:00'
}

const isValidEndTime = unix => {
  const formattedTime = moment(unix).format('HH:mm:ss')
  return formattedTime === '12:00:00'
}
const validateBodyCreatePayment = reqBody => {
  const schema = Joi.object({
    paymentType: Joi.string().valid('bank_transfer').required().messages({
      'any.required': 'paymentType is required.',
      'string.base': 'paymentType must be a string.',
      'string.empty': 'paymentType cannot be empty.',
      'any.only': 'paymentType must be "bank_transfer".',
    }),
    bank: Joi.string().valid('bca', 'bri', 'bni').required().messages({
      'any.only': 'Only "bca", "bri", or "bni" are allowed for bank.',
      'any.required': 'bank is required for bank transfer.',
      'string.base': 'bank must be a string.',
      'string.empty': 'bank cannot be empty.',
    }),
    roomId: Joi.number().positive().required().strict().messages({
      'number.base': 'roomId must be a number.',
      'number.positive': 'roomId must be a positive number.',
      'any.required': 'roomId is required.',
      'number.strict': 'roomId must be a strict number type.',
    }),
    startReservation: Joi.custom((value, helpers) => {
      if (!isUnixTimestamp(value)) {
        return helpers.error('any.custom')
      }

      if (!isValidStartTime(value)) {
        return helpers.message('startReservation must be at 14:00:00')
      }

      return value
    })
      .required()
      .messages({
        'any.required': 'startReservation must be a valid Unix timestamp.',
        'any.custom': 'startReservation must be a valid Unix timestamp.',
      }),
    endReservation: Joi.custom((value, helpers) => {
      if (!isUnixTimestamp(value)) {
        return helpers.error('any.custom')
      }

      if (!isValidEndTime(value)) {
        return helpers.message('endReservation must be at 12:00:00')
      }

      return value
    })
      .required()
      .messages({
        'any.required': 'endReservation must be a valid Unix timestamp.',
        'any.custom': 'endReservation must be a valid Unix timestamp.',
      }),
    price: Joi.number().positive().required().strict().messages({
      'number.base': 'Price must be a number.',
      'number.positive': 'Price must be a positive number.',
      'any.required': 'Price is required.',
      'number.strict': 'Price must be a strict number type.',
    }),
    stayDuration: Joi.number().positive().required().strict().not(0).messages({
      'number.base': 'Stay duration must be a number.',
      'number.positive': 'Stay duration must be a positive number.',
      'any.required': 'Stay duration is required.',
      'number.strict': 'Stay duration must be a strict number type.',
      'number.not': 'Stay duration cannot be 0.',
    }),
  })
  const { error } = schema.validate(reqBody, {
    abortEarly: false,
  })

  if (error) {
    return error.details.map(err => err.message).join(', ')
  }

  return null
}
const validateBodyGenerateOtpToEmail = reqBody => {
  const schema = Joi.object({
    email: Joi.string()
      .email({
        tlds: { allow: false }, // Optional: Allow emails without top-level domains (.com, .net)
      })
      .required()
      .messages({
        'string.base': 'email must be a string.',
        'string.empty': 'email is required.',
        'string.email': 'email must be a valid email address.',
        'any.required': 'email is required.',
      }),
  })
  const { error } = schema.validate(reqBody, {
    abortEarly: false,
  })

  if (error) {
    return error.details.map(err => err.message).join(', ')
  }

  return null
}
const validateBodyVerifyOtp = reqBody => {
  const schema = Joi.object({
    code: Joi.number().min(100000).max(999999).required().messages({
      'number.base': 'code must be a number',
      'number.min': 'code must be at least six digits long',
      'number.max': 'code must be at most six digits long',
      'any.required': 'code is required',
    }),
    token: Joi.string().required(),
  })
  const { error } = schema.validate(reqBody, {
    abortEarly: false,
  })

  if (error) {
    return error.details.map(err => err.message).join(', ')
  }

  return null
}

const validateBodyRegisterWithGoogle = reqBody => {
  const schema = Joi.object({
    username: Joi.string().min(3).required().messages({
      'number.base': 'username must be a string',
      'number.min': 'username must be at least three digits long',
      'any.required': 'username is required',
    }),
    image: Joi.string()
      .allow('', null)
      .uri({
        scheme: ['http', 'https'],
      })
      .messages({
        'string.empty': 'image should not be an empty string.',
        'any.only': 'image should be a string or null.',
        'string.uri': 'image must be a valid URI.',
        'string.uriCustomScheme': 'image must be a valid HTTP or HTTPS URI.',
      }),
    email: Joi.string()
      .email({
        tlds: { allow: false },
      })
      .required()
      .messages({
        'string.base': 'email must be a string.',
        'string.empty': 'email is required.',
        'string.email': 'email must be a valid email address.',
        'any.required': 'email is required.',
      }),
  })
  const { error } = schema.validate(reqBody, {
    abortEarly: false,
  })

  if (error) {
    return error.details.map(err => err.message).join(', ')
  }

  return null
}
const validateBodyUpdateUserProfile = reqBody => {
  const schema = Joi.object({
    imagePublicId: Joi.string().allow(null, '').invalid(Joi.number()).messages({
      'string.base': 'imagePublicId should be a string.',
      'any.only': 'imagePublicId should be a string or null.',
      'any.invalid': 'imagePublicId cannot be a number.',
    }),
  })
  const { error } = schema.validate(reqBody, {
    abortEarly: false,
  })

  if (error) {
    return error.details.map(err => err.message).join(', ')
  }

  return null
}

const validateBodyRegister = reqBody => {
  const schema = Joi.object({
    username: Joi.string().min(3).required().messages({
      'number.base': 'username must be a string',
      'number.min': 'username must be at least three digits long',
      'any.required': 'username is required',
    }),
    token: Joi.string().required().messages({
      'number.base': 'token must be a string',
      'any.required': 'token is required',
    }),
    email: Joi.string()
      .email({
        tlds: { allow: false },
      })
      .required()
      .messages({
        'string.base': 'email must be a string.',
        'string.empty': 'email is required.',
        'string.email': 'email must be a valid email address.',
        'any.required': 'email is required.',
      }),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string()
      .min(6)
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'any.only': 'Password and Confirm Password must match',
      }),
  })
  const { error } = schema.validate(reqBody, {
    abortEarly: false,
  })

  if (error) {
    return error.details.map(err => err.message).join(', ')
  }

  return null
}
const validateBodyLogin = reqBody => {
  const schema = Joi.object({
    email: Joi.string()
      .email({
        tlds: { allow: false },
      })
      .required()
      .messages({
        'string.base': 'email must be a string.',
        'string.empty': 'email is required.',
        'string.email': 'email must be a valid email address.',
        'any.required': 'email is required.',
      }),
    password: Joi.string().min(6).required(),
  })
  const { error } = schema.validate(reqBody, {
    abortEarly: false,
  })

  if (error) {
    return error.details.map(err => err.message).join(', ')
  }

  return null
}
const validateBodyChangePassword = reqBody => {
  const schema = Joi.object({
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string()
      .min(6)
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'any.only': 'Password and Confirm Password must match',
      }),
  })
  const { error } = schema.validate(reqBody, {
    abortEarly: false,
  })

  if (error) {
    return error.details.map(err => err.message).join(', ')
  }

  return null
}
const validateBodyCreateCabin = reqBody => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      'string.base': 'Name must be a string.',
      'string.empty': 'Name is required.',
      'any.required': 'Name is required.',
    }),
    city: Joi.string().required().messages({
      'string.base': 'city must be a string.',
      'string.empty': 'city is required.',
      'any.required': 'city is required.',
    }),
    address: Joi.string().required().messages({
      'string.base': 'address must be a string.',
      'string.empty': 'address is required.',
      'any.required': 'address is required.',
    }),
    latitude: Joi.number().required().messages({
      'number.base': 'Latitude should be a number.',
      'number.empty': 'Latitude is required.',
      'any.required': 'Latitude is required.',
    }),

    longitude: Joi.number().required().messages({
      'number.base': 'Longitude should be a number.',
      'number.empty': 'Longitude is required.',
      'any.required': 'Longitude is required.',
    }),
  })

  const { error } = schema.validate(reqBody, {
    abortEarly: false,
  })

  if (error) {
    return error.details.map(err => err.message).join(', ')
  }

  return null
}
const validateBodyCreateBanner = reqBody => {
  const schema = Joi.object({
    title: Joi.string().required().messages({
      'string.base': 'title must be a string.',
      'string.empty': 'title is required.',
      'any.required': 'title is required.',
    }),
    description: Joi.string().required().messages({
      'string.base': 'description must be a string.',
      'string.empty': 'description is required.',
      'any.required': 'description is required.',
    }),
    active: Joi.boolean().required().messages({
      'boolean.base': 'active must be a boolean.',
      'any.required': 'active is required.',
    }),
  })

  const { error } = schema.validate(reqBody, {
    abortEarly: false,
  })

  if (error) {
    return error.details.map(err => err.message).join(', ')
  }

  return null
}
const validateBodyCreateCabinRoom = reqBody => {
  const schema = Joi.object({
    cabinsSlug: Joi.string().required().messages({
      'string.base': 'cabinsSlug must be a string.',
      'string.empty': 'cabinsSlug is required.',
      'any.required': 'cabinsSlug is required.',
    }),
    typeRoomId: Joi.number().positive().required().messages({
      'number.base': 'typeRoomId must be a number.',
      'number.positive': 'typeRoomId must be a positive number.',
      'any.required': 'typeRoomId is required.',
    }),
    roomNumber: Joi.string().required().regex(/^\d+$/).messages({
      'string.base': 'roomNumber must be a string.',
      'string.empty': 'roomNumber is required.',
      'any.required': 'roomNumber is required.',
      'string.pattern.base': 'roomNumber must contain only numbers.',
    }),
  })

  const { error } = schema.validate(reqBody, {
    abortEarly: false,
  })

  if (error) {
    return error.details.map(err => err.message).join(', ')
  }

  return null
}
const validateBodyCreateTypeCabin = reqBody => {
  const allowedNames = ['standard cabin', 'deluxe cabin', 'executive cabin']
  const schema = Joi.object({
    name: Joi.string()
      .valid(...allowedNames.map(name => name.toLowerCase()))
      .required()
      .insensitive()
      .messages({
        'string.base': 'Name must be a string.',
        'string.empty': 'Name is required.',
        'any.required': 'Name is required.',
        'any.only': `Name must be one of: ${allowedNames.join(', ')}.`,
      }),
    information: Joi.string().required().messages({
      'string.base': 'information must be a string.',
      'string.empty': 'information is required.',
      'any.required': 'information is required.',
    }),
    cabinsSlug: Joi.string().required().messages({
      'string.base': 'cabinsSlug must be a string.',
      'string.empty': 'cabinsSlug is required.',
      'any.required': 'cabinsSlug is required.',
    }),
    price: Joi.number().integer().positive().required().messages({
      'number.base': 'price must be a number.',
      'number.integer': 'price must be an integer.',
      'number.positive': 'price must be a positive number.',
      'any.required': 'price is required.',
    }),
    capacity: Joi.string().required().messages({
      'string.base': 'capacity must be a string.',
      'string.empty': 'capacity is required.',
      'any.required': 'capacity is required.',
    }),
    breakfast: Joi.boolean().optional().messages({
      'string.base': 'Breakfast must be a boolean.',
    }),
  })

  const { error } = schema.validate(reqBody, {
    abortEarly: false,
  })

  if (error) {
    return error.details.map(err => err.message).join(', ')
  }

  return null
}

const validateResultOcrIdCard = result => {
  const schema = Joi.object({
    nik: Joi.string().pattern(/^\d+$/).length(16).required().messages({
      'string.base': 'nik must be a string.',
      'string.empty': 'nik is required.',
      'string.pattern.base': 'nik must only contain digits.',
      'string.length': 'nik must be exactly 16 characters long.',
      'any.required': 'nik is required.',
    }),
    name: Joi.string().required().messages({
      'string.base': 'name must be a string.',
      'string.empty': 'name is required.',
    }),
  })

  const { error } = schema.validate(result, {
    abortEarly: false,
  })

  if (error) {
    return error.details.map(err => err.message).join(', ')
  }

  return null
}
const validateBodyCreateIdCard = result => {
  const schema = Joi.object({
    nik: Joi.string().pattern(/^\d+$/).length(16).required().messages({
      'string.base': 'nik must be a string.',
      'string.empty': 'nik is required.',
      'string.pattern.base': 'nik must only contain digits.',
      'string.length': 'nik must be exactly 16 characters long.',
      'any.required': 'nik is required.',
    }),
    name: Joi.string().required().messages({
      'string.base': 'name must be a string.',
      'string.empty': 'name is required.',
    }),
    birthday: Joi.custom((value, helpers) => {
      if (!isUnixTimestamp(value)) {
        return helpers.error('any.custom')
      }
      return value
    })
      .required()
      .messages({
        'any.required': 'birthday must be a valid Unix timestamp.',
      }),
  })

  const { error } = schema.validate(result, {
    abortEarly: false,
  })

  if (error) {
    return error.details.map(err => err.message).join(', ')
  }

  return null
}

module.exports = {
  validateBodyCreateCabinRoom,
  validateBodyCreateTypeCabin,
  validateBodyGenerateOtpToEmail,
  validateBodyVerifyOtp,
  validateBodyRegister,
  validateBodyRegisterWithGoogle,
  validateBodyLogin,
  validateBodyChangePassword,
  validateBodyCreateCabin,
  validateResultOcrIdCard,
  validateBodyCreateIdCard,
  validateBodyCreatePayment,
  validateBodyCreateBanner,
  validateBodyUpdateUserProfile,
}
