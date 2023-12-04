require('dotenv').config()

const BASE_URL = process.env.BASE_URL

const getPaginationLink = (pageNumber, pageSize, endpoint) =>
  `${BASE_URL}${endpoint}?pageNumber=${pageNumber}&pageSize=${pageSize}`

const responsePagination = (rows, pageNumber, pageSize, endpoint) => {
  const next =
    rows.length > 0
      ? getPaginationLink(Number(pageNumber) + 1, pageSize, endpoint)
      : null
  const previous =
    pageNumber > 1
      ? getPaginationLink(Number(pageNumber) - 1, pageSize, endpoint)
      : null

  return { next, previous }
}
module.exports = responsePagination
