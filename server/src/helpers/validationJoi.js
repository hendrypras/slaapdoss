const Joi = require('joi')

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
    cabinRoomId: Joi.number().positive().required().strict().messages({
      'number.base': 'cabinRoomId must be a number.',
      'number.positive': 'cabinRoomId must be a positive number.',
      'any.required': 'cabinRoomId is required.',
      'number.strict': 'cabinRoomId must be a strict number type.',
    }),
    startReservation: Joi.string().isoDate().required().messages({
      'any.required': 'startReservation date is required.',
      'string.base': 'startReservation date must be a string in ISO format.',
      'string.empty': 'startReservation date cannot be empty.',
      'string.isoDate': 'startReservation date must be in ISO date format.',
    }),
    endReservation: Joi.string().isoDate().required().messages({
      'any.required': 'endReservation date is required.',
      'string.base': 'endReservation date must be a string in ISO format.',
      'string.empty': 'endReservation date cannot be empty.',
      'string.isoDate': 'endReservation date must be in ISO date format.',
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
    code: Joi.number().integer().min(100000).max(999999).required().messages({
      'number.base': 'code must be a number',
      'number.integer': 'code must be an integer',
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
    description: Joi.string().required().messages({
      'string.base': 'description must be a string.',
      'string.empty': 'description is required.',
      'any.required': 'description is required.',
    }),
    address: Joi.string().required().messages({
      'string.base': 'address must be a string.',
      'string.empty': 'address is required.',
      'any.required': 'address is required.',
    }),
    image_url: Joi.string().uri().required().messages({
      'string.base': 'The image URL must be a string.',
      'string.empty': 'The image URL is required.',
      'any.required': 'The image URL is required.',
      'string.uri': 'The image URL must be a valid URI.',
    }),
    image_public_id: Joi.string().required().messages({
      'string.base': 'image_public_id must be a string.',
      'string.empty': 'image_public_id is required.',
      'any.required': 'image_public_id is required.',
    }),
    slug: Joi.string().required().messages({
      'string.base': 'slug must be a string.',
      'string.empty': 'slug is required.',
      'any.required': 'slug is required.',
    }),
    province: Joi.string().required().messages({
      'string.base': 'province must be a string.',
      'string.empty': 'province is required.',
      'any.required': 'province is required.',
    }),
    village: Joi.string().required().messages({
      'string.base': 'village must be a string.',
      'string.empty': 'village is required.',
      'any.required': 'village is required.',
    }),
    district: Joi.string().required().messages({
      'string.base': 'district must be a string.',
      'string.empty': 'district is required.',
      'any.required': 'district is required.',
    }),
    city_name: Joi.string().required().messages({
      'string.base': 'city_name must be a string.',
      'string.empty': 'city_name is required.',
      'any.required': 'city_name is required.',
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
const validateBodyCreateCabinRoom = reqBody => {
  const schema = Joi.object({
    cabinsSlug: Joi.string().required().messages({
      'string.base': 'cabinsSlug must be a string.',
      'string.empty': 'cabinsSlug is required.',
      'any.required': 'cabinsSlug is required.',
    }),
    typeCabinId: Joi.number().positive().required().strict().messages({
      'number.base': 'typeCabinId must be a number.',
      'number.positive': 'typeCabinId must be a positive number.',
      'any.required': 'typeCabinId is required.',
      'number.strict': 'typeCabinId must be a strict number type.',
    }),
    roomNumber: Joi.string().required().messages({
      'string.base': 'roomNumber must be a string.',
      'string.empty': 'roomNumber is required.',
      'any.required': 'roomNumber is required.',
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
  const schema = Joi.object({
    name: Joi.string().required().messages({
      'string.base': 'Name must be a string.',
      'string.empty': 'Name is required.',
      'any.required': 'Name is required.',
    }),
    information: Joi.string().required().messages({
      'string.base': 'information must be a string.',
      'string.empty': 'information is required.',
      'any.required': 'information is required.',
    }),
    image_url: Joi.string().uri().required().messages({
      'string.base': 'The image URL must be a string.',
      'string.empty': 'The image URL is required.',
      'any.required': 'The image URL is required.',
      'string.uri': 'The image URL must be a valid URI.',
    }),
    image_public_id: Joi.string().required().messages({
      'string.base': 'image_public_id must be a string.',
      'string.empty': 'image_public_id is required.',
      'any.required': 'image_public_id is required.',
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
    birthday: Joi.string().required().messages({
      'string.base': 'birthday must be a string.',
      'string.empty': 'birthday is required.',
    }),
    address: Joi.string().required().messages({
      'string.base': 'address must be a string.',
      'string.empty': 'address is required.',
    }),
    marial_status: Joi.string().allow('').messages({
      'string.base': 'marial_status must be a string.',
    }),
    job: Joi.string().allow('').messages({
      'string.base': 'job must be a string.',
    }),
    citizenship: Joi.string().required().messages({
      'string.base': 'citizenship must be a string.',
      'string.empty': 'citizenship is required.',
    }),
    religion: Joi.string().required().messages({
      'string.base': 'religion must be a string.',
      'string.empty': 'religion is required.',
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
    birthday: Joi.date().iso().required().messages({
      'date.base': 'Birthday must be a date.',
      'date.empty': 'Birthday is required.',
      'date.isoDate': 'Birthday must be in ISO date format.',
    }),

    address: Joi.string().required().messages({
      'string.base': 'address must be a string.',
      'string.empty': 'address is required.',
    }),
    marial_status: Joi.string().allow('').messages({
      'string.base': 'maritalStatus must be a string.',
    }),
    job: Joi.string().allow('').messages({
      'string.base': 'job must be a string.',
    }),
    citizenship: Joi.string().required().messages({
      'string.base': 'citizenship must be a string.',
      'string.empty': 'citizenship is required.',
    }),
    religion: Joi.string().required().messages({
      'string.base': 'religion must be a string.',
      'string.empty': 'religion is required.',
    }),
    id_card_url: Joi.string()
      .uri({
        scheme: ['http', 'https'],
      })
      .required()
      .messages({
        'string.base': 'id_card_url must be a string.',
        'string.uri': 'id_card_url must be a valid URL.',
        'any.required': 'id_card_url is required.',
      }),
    id_card_public_id: Joi.string().required().messages({
      'string.base': 'id_card_public_id must be a string.',
      'string.empty': 'id_card_public_id is required.',
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
}
