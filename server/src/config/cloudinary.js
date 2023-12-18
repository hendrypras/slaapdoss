const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadToCloudinary = async (data, resourceType) => {
  return new Promise((resolve, reject) => {
    let uploadStream

    if (data.buffer) {
      // Jika data adalah file dengan buffer
      uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          folder: resourceType,
        },
        (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        }
      )
      uploadStream.end(data.buffer)
    } else {
      // Jika data adalah base64
      cloudinary.uploader
        .upload(data, {
          resource_type: resourceType,
          folder: resourceType,
        })
        .then(result => resolve(result))
        .catch(error => reject(error))
    }
  })
}

const cloudinaryDeleteImg = async (publicId, resourceType) => {
  try {
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    })

    return response.result === 'ok'
  } catch (error) {
    return false
  }
}
module.exports = {
  uploadToCloudinary,
  cloudinaryDeleteImg,
}
