const axios = require('axios')
const { merge } = require('lodash')

const callAPI = async (url, method, header, params, data) => {
  const defaultHeader = {
    accept: 'application/json',
  }

  const headers = merge(defaultHeader, header)
  const options = {
    url,
    method,
    headers,
    data,
    params,
  }

  return axios(options).then(response => {
    const responseAPI = response.data
    return responseAPI
  })
}
module.exports = callAPI
