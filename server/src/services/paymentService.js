const moment = require('moment')

const { isDateRangeOverlap } = require('./cabinService')

const calculateDurationInDays = (start, end) => {
  const startMoment = moment(start).startOf('day')
  const endMoment = moment(end).startOf('day')
  const duration = moment.duration(endMoment.diff(startMoment))
  return duration.asDays()
}

const checkDateRange = (startReserve, endReserve, data) => {
  return data?.filter(item => {
    const start = parseInt(item.start_reservation)
    const end = parseInt(item.end_reservation)
    return isDateRangeOverlap(start, end, startReserve, endReserve)
  })
}

module.exports = { checkDateRange, calculateDurationInDays }
