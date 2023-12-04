const { readFileSync } = require('fs')

const loadData = db => JSON.parse(readFileSync(db))

module.exports = loadData
