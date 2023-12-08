const loadData = require('../helpers/databaseHelper')
const { responseError, responseSuccess } = require('../helpers/responseHandler')
const path = require('path')

exports.getStaticAssets = async (req, res) => {
  try {
    const database = path.join(__dirname, '../../database/assetsHome.json')
    const response = await loadData(database)
    if (!response) return responseError(res, 404, 'Not Found')
    return responseSuccess(res, 200, 'success', response)
  } catch (error) {
    return responseError(res, error.status, error.message)
  }
}
exports.getTranslation = async (req, res) => {
  try {
    const database = path.join(__dirname, '../../database/languages.json')
    const response = await loadData(database)
    if (!response) return responseError(res, 404, 'Not Found')
    return responseSuccess(res, 200, 'success', response)
  } catch (error) {
    return responseError(res, error.status, error.message)
  }
}
