const loadData = require('../helpers/databaseHelper')
const { responseError, responseSuccess } = require('../helpers/responseHandler')
const path = require('path')

exports.getAssets = async (req, res) => {
  try {
    const database = path.join(__dirname, '../../database/dropstep.json')
    const dropStep = await loadData(database)
    if (!dropStep) return responseError(res, 404, 'Not Found')
    return responseSuccess(res, 200, 'success', { dropStep })
  } catch (error) {
    return responseError(res, error.status, error.message)
  }
}
