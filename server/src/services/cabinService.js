const isDateRangeOverlap = (start, end, dateStart, dateEnd) => {
  return (
    (start === parseInt(dateStart) && end === parseInt(dateEnd)) ||
    (start <= parseInt(dateStart) && end >= parseInt(dateStart)) ||
    (start <= parseInt(dateEnd) && end >= parseInt(dateEnd)) ||
    (start >= parseInt(dateStart) && end <= parseInt(dateEnd))
  )
}

const filterRoomsByDateRange = (cabinRooms, dateStart, dateEnd) => {
  return cabinRooms?.filter(room => {
    return !room.reservation_date?.some(item => {
      const start = parseInt(item.start_reservation)
      const end = parseInt(item.end_reservation)
      return isDateRangeOverlap(start, end, dateStart, dateEnd)
    })
  })
}
const groupCabinRoomsByType = (rooms, includeData) => {
  const groupedCabins = []
  // Iterasi melalui setiap cabin room
  rooms?.forEach(cabinRoom => {
    const { type_room } = cabinRoom

    // Cari indeks dari tipe kabin dalam groupedCabins
    const index = groupedCabins.findIndex(
      item => item.type_room?.name === type_room?.name
    )
    const cabinInfo = includeData.find(
      item => item.typeCabin?.toLowerCase() === type_room?.name.toLowerCase()
    )

    if (index === -1) {
      // Jika belum ada, buat objek baru untuk tipe kabin tersebut dan tambahkan ke groupedCabins
      groupedCabins.push({
        type_room,
        include: cabinInfo || null,
        cabins: [
          {
            id: cabinRoom.id,
            cabins_slug: cabinRoom.cabins_slug,
            room_number: cabinRoom.room_number,
            type_room_id: cabinRoom.type_room_id,
          },
        ],
      })
    } else {
      // Jika sudah ada, tambahkan cabin room ke dalam array cabins untuk tipe kabin yang sesuai
      groupedCabins[index].cabins.push({
        id: cabinRoom.id,
        cabins_slug: cabinRoom.cabins_slug,
        room_number: cabinRoom.room_number,
        type_room_id: cabinRoom.type_room_id,
      })
    }
  })

  return groupedCabins
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

module.exports = {
  isDateRangeOverlap,
  filterRoomsByDateRange,
  groupCabinRoomsByType,
  modifiedResponseDetailRoomCabin,
}
