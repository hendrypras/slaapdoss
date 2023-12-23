'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('cabins', [
      {
        name: 'Slaapcabin Bromo',
        slug: 'slaapcabin-bromo',
        city: 'Probolinggo',
        address:
          'Cemoro Lawang, Desa Ngadisari, Kec. Sukapura, Kabupaten Probolinggo,Prop. Jawa Timur.',
        image_url:
          'https://res.cloudinary.com/dlm3iavym/image/upload/v1702722724/image/knl5hiv0dimw7tdpdacw.jpg',
        image_public_id: 'image/knl5hiv0dimw7tdpdacw',
        latitude: -7.75819,
        longitude: 113.17654,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('cabins', null, {})
  },
}
