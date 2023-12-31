const moment = require('moment')
const _ = require('lodash')

const isDateRangeOverlap = (start, end, dateStart, dateEnd) => {
  return (
    (start === parseInt(dateStart) && end === parseInt(dateEnd)) ||
    (start <= parseInt(dateStart) && end >= parseInt(dateStart)) ||
    (start <= parseInt(dateEnd) && end >= parseInt(dateEnd)) ||
    (start >= parseInt(dateStart) && end <= parseInt(dateEnd))
  )
}

const filterRoomsByDateRange = (cabinRooms, dateStart, dateEnd) => {
  return _.filter(cabinRooms, room => {
    return !room.reservation_date?.some(item => {
      const start = parseInt(item.start_reservation)
      const end = parseInt(item.end_reservation)
      return isDateRangeOverlap(start, end, dateStart, dateEnd)
    })
  })
}
const groupCabinRoomsByType = (rooms, includeData) => {
  const groupedCabins = _.groupBy(rooms, cabinRoom => cabinRoom.type_room.name)

  return _.map(groupedCabins, (value, key) => {
    const cabinInfo = includeData?.find(
      item => item.typeCabin?.toLowerCase() === key.toLowerCase()
    )

    return {
      type_room: value[0].type_room,
      include: cabinInfo || null,
      cabins: _.map(value, cabin => ({
        id: cabin.id,
        cabins_slug: cabin.cabins_slug,
        room_number: cabin.room_number,
        type_room_id: cabin.type_room_id,
      })),
    }
  })
}

const modifiedResponseDetailRoomCabin = detailData => {
  return {
    address: detailData?.address,
    slug: detailData?.slug,
    roomNumber: detailData?.rooms[0]?.room_number,
    typeCabin: detailData?.rooms[0]?.type_room?.name,
    price: detailData?.rooms[0]?.type_room?.price,
    information: detailData?.rooms[0]?.type_room?.information,
    capacity: detailData?.rooms[0]?.type_room?.capacity,
  }
}

const getCurrentDate = () => {
  const currDate = moment()
  currDate.set({ hour: 14, minute: 0, second: 0, millisecond: 0 })
  return currDate.valueOf()
}
module.exports = {
  isDateRangeOverlap,
  filterRoomsByDateRange,
  groupCabinRoomsByType,
  modifiedResponseDetailRoomCabin,
  getCurrentDate,
}
