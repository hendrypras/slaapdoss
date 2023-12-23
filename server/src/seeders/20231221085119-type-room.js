'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('type-room', [
      {
        name: 'standard cabin',
        cabins_slug: 'slaapcabin-bromo',
        breakfast: false,
        image_url:
          'https://res.cloudinary.com/dlm3iavym/image/upload/v1702722724/image/knl5hiv0dimw7tdpdacw.jpg',
        image_public_id: 'image/knl5hiv0dimw7tdpdacw',
        price: 450000,
        information: '1 room, 1 night',
        capacity: '2 Adult, 1 child',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('type-room', null, {})
  },
}
