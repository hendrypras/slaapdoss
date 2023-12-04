const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadToCloudinary = async (file, resourceType) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      resource_type: resourceType,
    })

    return {
      success: true,
      url: result.secure_url,
      asset_id: result.asset_id,
      public_id: result.public_id,
    }
  } catch (error) {
    return {
      success: false,
      error,
    }
  }
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
module.exports = { uploadToCloudinary, cloudinaryDeleteImg }
