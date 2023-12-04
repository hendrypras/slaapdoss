const Joi = require('joi')

const validateRequestMidtrans = requestMidtrans => {
  const schema = Joi.object({
    payment_type: Joi.string().valid('bank_transfer').required().messages({
      'any.required': 'payment_type is required.',
      'string.base': 'payment_type must be a string.',
      'string.empty': 'payment_type cannot be empty.',
      'any.only': 'payment_type must be "bank_transfer".',
    }),
    transaction_details: Joi.object({
      order_id: Joi.string().required().messages({
        'any.required': 'order_id is required.',
        'string.base': 'order_id must be a string.',
        'string.empty': 'order_id cannot be empty.',
      }),
      gross_amount: Joi.number().positive().required().messages({
        'number.base': 'gross_amount must be a number.',
        'number.positive': 'gross_amount must be a positive number.',
        'any.required': 'gross_amount is required.',
        'number.strict': 'gross_amount must be a strict number type.',
      }),
    }).required(),
    bank_transfer: Joi.object({
      bank: Joi.string().valid('bca', 'bri', 'bni').required().messages({
        'any.only': 'Only "bca", "bri", or "bni" are allowed for bank.',
        'any.required': 'bank is required for bank transfer.',
        'string.base': 'bank must be a string.',
        'string.empty': 'bank cannot be empty.',
      }),
    }).required(),
  })
  return schema.validate(requestMidtrans, { abortEarly: false })
}

const validateVideoPost = reqBody => {
  const schema = Joi.object({
    title: Joi.string().min(5).required().messages({
      'string.min': 'title should be at least 5 characters long.',
      'any.required': 'title is required.',
    }),
    description: Joi.string(),
    for_kids: Joi.boolean().default(false),
    category_id: Joi.number().required(),
    visibility: Joi.boolean().default(true),
    image: Joi.any().valid('image/jpeg', 'image/png', 'image/gif'),
    video: Joi.any().valid('video/mp4', 'video/x-m4v', 'video/*'),
  })
  const { error } = schema.validate(reqBody, {
    abortEarly: false,
  })

  if (error) {
    return error.details.map(err => err.message).join(', ')
  }

  return null
}

const validateVideoEdit = reqBody => {
  const schema = Joi.object({
    title: Joi.string().min(5).required().messages({
      'string.min': 'title should be at least 5 characters long.',
      'any.required': 'title is required.',
    }),
    description: Joi.string(),
    for_kids: Joi.boolean().default(false),
    category_id: Joi.number().required(),
    visibility: Joi.boolean().default(true),
    image: Joi.any().allow(null),
    video: Joi.any().allow(null),
  })

  const { error } = schema.validate(reqBody, {
    abortEarly: false,
  })

  if (error) {
    return error.details.map(err => err.message).join(', ')
  }

  return null
}

const validateVideoComment = reqBody => {
  const schema = Joi.object({
    comment: Joi.string().required().messages({
      'any.required': 'comment is required.',
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
const validateVideoCategory = reqBody => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      'any.required': 'name is required.',
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
const validateOrderDetail = orderDetail => {
  const schema = Joi.object({
    sku: Joi.string().required(),
    limit_in_month: Joi.number().positive().required().messages({
      'number.base': 'limit_in_month must be a number.',
      'number.positive': 'limit_in_month must be a positive number.',
      'any.required': 'limit_in_month is required.',
    }),
  })
  return schema.validate(orderDetail, { abortEarly: false })
}

const validateBodyCreatePayment = reqBody => {
  const { request_midtrans, order_detail } = reqBody

  const { error: midtransError } = validateRequestMidtrans(request_midtrans)
  if (midtransError) {
    return midtransError.details.map(err => err.message).join(', ')
  }

  const { error: orderDetailError } = validateOrderDetail(order_detail)
  if (orderDetailError) {
    return orderDetailError.details.map(err => err.message).join(', ')
  }

  return null
}

const validateBodyCreateRoom = reqBody => {
  const schema = Joi.object({
    title: Joi.string().min(5).required().messages({
      'string.min': 'title should be at least 5 characters long.',
      'any.required': 'title is required.',
    }),
    description: Joi.string().required().messages({
      'any.required': 'description is required.',
    }),
    room_type_id: Joi.number().positive().required().messages({
      'number.base': 'room_type_id must be a number.',
      'number.positive': 'room_type_id must be a positive number.',
      'any.required': 'room_type_id is required.',
    }),
    rate: Joi.string().valid('night', 'day').required().messages({
      'any.only': 'Only "night", or "day" are allowed for rate.',
      'any.required': 'rate is required for room.',
      'string.base': 'rate must be a string.',
      'string.empty': 'rate cannot be empty.',
    }),
    price: Joi.number().positive().required().messages({
      'number.base': 'Price must be a number.',
      'number.positive': 'Price must be a positive number.',
      'any.required': 'Price is required.',
    }),
    room_number: Joi.string().required(),
    availability: Joi.string().required(),
    floor: Joi.number().positive().required().messages({
      'number.base': 'Floor must be a number.',
      'number.positive': 'Floor must be a positive number.',
      'any.required': 'Floor is required.',
    }),
    amenities: Joi.string().allow('', null).messages({
      'any.only': 'Amenities should be a string or null.',
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
const validateBodyGenerateOtpToeEmail = reqBody => {
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
    first_name: Joi.string().min(3).required().messages({
      'number.base': 'first_name must be a string',
      'number.min': 'first_name must be at least three digits long',
      'any.required': 'first_name is required',
    }),
    last_name: Joi.string().allow('', null).messages({
      'any.only': 'last_name should be a string or null.',
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
    first_name: Joi.string().min(3).required().messages({
      'number.base': 'first_name must be a string',
      'number.min': 'first_name must be at least three digits long',
      'any.required': 'first_name is required',
    }),
    token: Joi.string().required().messages({
      'number.base': 'first_name must be a string',
      'any.required': 'first_name is required',
    }),
    last_name: Joi.string().allow('', null).messages({
      'any.only': 'last_name should be a string or null.',
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
const validateBodyCreateRoomType = reqBody => {
  const schema = Joi.object({
    name: Joi.string().min(3).lowercase().required().messages({
      'string.base': 'Name must be a string.',
      'string.empty': 'Name is required.',
      'string.min': 'Name must be at least 3 characters long.',
      'any.required': 'Name is required.',
      'string.lowercase': 'Name must be in lowercase.',
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

module.exports = {
  validateVideoPost,
  validateVideoEdit,
  validateBodyCreatePayment,
  validateBodyCreateRoom,
  validateBodyGenerateOtpToeEmail,
  validateBodyVerifyOtp,
  validateBodyRegister,
  validateBodyRegisterWithGoogle,
  validateBodyLogin,
  validateBodyChangePassword,
  validateBodyCreateRoomType,
  validateVideoComment,
  validateVideoCategory,
}
