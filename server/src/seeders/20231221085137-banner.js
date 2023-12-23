'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('banners', [
      {
        title: 'Test banner cabin',
        description: 'Test description cabin',
        active: true,
        image_url:
          'https://res.cloudinary.com/dlm3iavym/image/upload/v1703134135/image/ef5dyg5alm8rklzc1efz.jpg',
        image_public_id: 'image/ef5dyg5alm8rklzc1efz',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('banners', null, {})
  },
}
