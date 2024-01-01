const request = require('supertest')
const app = require('../../src/index')
const { Users, TypeRoom, Rooms } = require('../../src/models')
const { sequelize } = require('../../src/models/index')
const { queryInterface } = sequelize
const config = require('../../config')
const path = require('path')
const { generateAuthToken } = require('../../src/services/authService')

const dummyAdmin = {
  email: 'admin5@mail.com',
  username: 'admin5',
  password: 'password123',
  role: 1,
}
const dummyTextDataCabin = {
  city: 'test',
  address: 'test',
  latitude: 1293876,
  longitude: 1293876,
}
const dummyTextDataTypeRoom = {
  price: 1123,
  capacity: 'test capacity',
  breakfast: false,
}

jest.mock('../../src/configDb/cloudinary', () => ({
  uploadToCloudinary: jest.fn().mockImplementation((file, type) => {
    return {
      url: 'https://example.com/image.jpg',
      public_id: 'public_id_here',
      error: null,
    }
  }),
}))
const imageNotAccept = path.join(__dirname, `../static/images/cabin.webp`)
const imageAccept = path.join(__dirname, `../static/images/cabin.jpeg`)

let token
let typeRoomId
let roomId
const slugCabin = 'test-name-cabin'
beforeAll(done => {
  Promise.all([
    Users.create(dummyAdmin),
    TypeRoom.create({
      name: 'deluxe cabin',
      image_url: 'https://asdsad',
      image_public_id: 'asghkjhg',
      cabins_slug: 'before-test',
      ...dummyTextDataTypeRoom,
    }),
    Rooms.create({
      cabins_slug: slugCabin,
      room_number: '123',
      type_room_id: 1,
    }),
  ])
    .then(([userRes, typeRoomRes, roomsRes]) => {
      const accessToken = generateAuthToken(
        { id: userRes.id, role: userRes.role },
        config.authentication.accessTokenSecret,
        config.authentication.expAccessToken
      )
      token = accessToken
      typeRoomId = typeRoomRes.id
      roomId = roomsRes.id
      done()
    })
    .catch(err => {
      done(err)
    })
})

afterAll(done => {
  Promise.all([
    queryInterface.bulkDelete('users', null, {}),
    queryInterface.bulkDelete('cabins', null, {}),
    queryInterface.bulkDelete('type_room', null, {}),
    queryInterface.bulkDelete('rooms', null, {}),
  ])
    .then(() => {
      done()
    })
    .catch(err => {
      done(err)
    })
})

describe('Create Cabin', () => {
  test('Success create cabin with status 201', done => {
    request(app)
      .post('/api/cabin')
      .set('authorization', `Bearer ${token}`)
      .attach('cabin', imageAccept)
      .field('name', 'test name cabin')
      .field(dummyTextDataCabin)
      .then(res => {
        expect(res.status).toBe(201)
        expect(res.body.status).toBe('success')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Duplicate name with status 400', done => {
    request(app)
      .post('/api/cabin')
      .set('authorization', `Bearer ${token}`)
      .attach('cabin', imageAccept)
      .field('name', 'test name cabin')
      .field(dummyTextDataCabin)
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.status).toBe('Bad Request')
        expect(res.body.message).toBe('Cabin with this name already exists')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Failed image not found with status 400', done => {
    request(app)
      .post('/api/cabin')
      .set('authorization', `Bearer ${token}`)
      .field('name', 'test1')
      .field(dummyTextDataCabin)
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.status).toBe('Validation Failed')
        expect(res.body.message).toBe('Image is required')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Image not acceptable with status 400', done => {
    request(app)
      .post('/api/cabin')
      .set('authorization', `Bearer ${token}`)
      .attach('cabin', imageNotAccept)
      .field('name', 'test 2')
      .field(dummyTextDataCabin)
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.status).toBe('Bad Request')
        expect(res.body.message).toBe(
          'Unsupported file type! Please upload only JPG, JPEG, or PNG images.'
        )
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Validation Failed with status 400', done => {
    request(app)
      .post('/api/cabin')
      .set('authorization', `Bearer ${token}`)
      .attach('cabin', imageAccept)
      .field(dummyTextDataCabin)
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.status).toBe('Validation Failed')
        expect(res.body.message).toBe('Name is required.')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})

describe('GET Cabins', () => {
  test('Success get cabin with status 200', done => {
    request(app)
      .get('/api/cabins')
      .set('authorization', `Bearer ${token}`)
      .then(res => {
        expect(res.status).toBe(200)
        expect(res.body.status).toBe('success')
        expect(res.body).toHaveProperty('data')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})

describe('Create type room', () => {
  test('Success create type room with status 201', done => {
    request(app)
      .post('/api/cabin/type-room')
      .set('authorization', `Bearer ${token}`)
      .attach('typeImage', imageAccept)
      .field('cabinsSlug', slugCabin)
      .field('name', 'standard cabin')
      .field(dummyTextDataTypeRoom)
      .then(res => {
        expect(res.status).toBe(201)
        expect(res.body.status).toBe('success')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Failed image not found with status 400', done => {
    request(app)
      .post('/api/cabin/type-room')
      .set('authorization', `Bearer ${token}`)
      .field('cabinsSlug', slugCabin)
      .field('name', 'standard cabin')
      .field(dummyTextDataTypeRoom)
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.status).toBe('Validation Failed')
        expect(res.body.message).toBe('Image is required')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Image not acceptable with status 400', done => {
    request(app)
      .post('/api/cabin/type-room')
      .set('authorization', `Bearer ${token}`)
      .attach('typeImage', imageNotAccept)
      .field('cabinsSlug', slugCabin)
      .field('name', 'standard cabin')
      .field(dummyTextDataTypeRoom)
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.status).toBe('Bad Request')
        expect(res.body.message).toBe(
          'Unsupported file type! Please upload only JPG, JPEG, or PNG images.'
        )
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Validation failed with status 400', done => {
    request(app)
      .post('/api/cabin/type-room')
      .set('authorization', `Bearer ${token}`)
      .attach('typeImage', imageAccept)
      .field('cabinsSlug', slugCabin)
      .field('name', 'standard cabins')
      .field(dummyTextDataTypeRoom)
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.status).toBe('Validation Failed')
        expect(res.body.message).toBe(
          'Name must be one of: standard cabin, deluxe cabin, executive cabin.'
        )
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Failed room already exists with status 400', done => {
    request(app)
      .post('/api/cabin/type-room')
      .set('authorization', `Bearer ${token}`)
      .attach('typeImage', imageAccept)
      .field('cabinsSlug', slugCabin)
      .field('name', 'standard cabin')
      .field(dummyTextDataTypeRoom)
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.status).toBe('Bad Request')
        expect(res.body.message).toBe('Type Room with this name already exist')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Failed cabin not found with status 404', done => {
    request(app)
      .post('/api/cabin/type-room')
      .set('authorization', `Bearer ${token}`)
      .attach('typeImage', imageAccept)
      .field('cabinsSlug', 'another-slug')
      .field('name', 'deluxe cabin')
      .field(dummyTextDataTypeRoom)
      .then(res => {
        expect(res.status).toBe(404)
        expect(res.body.status).toBe('Not Found')
        expect(res.body.message).toBe('Cabins with this slug not found')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})

describe('Update type room', () => {
  test('Failed image not found with status 400', done => {
    request(app)
      .put(`/api/cabin/type-room/${typeRoomId}`)
      .set('authorization', `Bearer ${token}`)
      .field('cabinsSlug', slugCabin)
      .field('name', 'standard cabin')
      .field(dummyTextDataTypeRoom)
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.status).toBe('Validation Failed')
        expect(res.body.message).toBe('Image is required')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Image not acceptable with status 400', done => {
    request(app)
      .put(`/api/cabin/type-room/${typeRoomId}`)
      .set('authorization', `Bearer ${token}`)
      .attach('typeImage', imageNotAccept)
      .field({
        name: 'standard cabin',
        cabinsSlug: slugCabin,
        imagePublicId: 'image/asdasdhajksdhjh',
        imageUrl: 'https://askdghkasgdgashjdgahsjgdhjagsdhasgdjhasgd.com',
        ...dummyTextDataTypeRoom,
      })
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.status).toBe('Bad Request')
        expect(res.body.message).toBe(
          'Unsupported file type! Please upload only JPG, JPEG, or PNG images.'
        )
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Validation failed with status 400', done => {
    request(app)
      .put(`/api/cabin/type-room/${typeRoomId}`)
      .set('authorization', `Bearer ${token}`)
      .attach('typeImage', imageAccept)
      .field({
        name: 'standard cabins',
        cabinsSlug: slugCabin,
        imagePublicId: 'image/asdasdhajksdhjh',
        imageUrl: 'https://askdghkasgdgashjdgahsjgdhjagsdhasgdjhasgd.com',
        ...dummyTextDataTypeRoom,
      })
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.status).toBe('Validation Failed')
        expect(res.body.message).toBe(
          'Name must be one of: standard cabin, deluxe cabin, executive cabin.'
        )
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Validation failed with status 400', done => {
    request(app)
      .put(`/api/cabin/type-room/${typeRoomId}`)
      .set('authorization', `Bearer ${token}`)
      .attach('typeImage', imageAccept)
      .field({
        name: 'standard cabin',
        cabinsSlug: slugCabin,
        imagePublicId: 'image/asdasdhajksdhjh',
        imageUrl: 'https://askdghkasgdgashjdgahsjgdhjagsdhasgdjhasgd.com',
        ...dummyTextDataTypeRoom,
      })
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.status).toBe('Bad Request')
        expect(res.body.message).toBe('Type Room with this name already exists')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Success with status 200', done => {
    request(app)
      .put(`/api/cabin/type-room/${typeRoomId}`)
      .set('authorization', `Bearer ${token}`)
      .field({
        name: 'deluxe cabin',
        cabinsSlug: slugCabin,
        imagePublicId: 'image/asdasdhajksdhjh',
        imageUrl: 'https://askdghkasgdgashjdgahsjgdhjagsdhasgdjhasgd.com',
        ...dummyTextDataTypeRoom,
      })
      .then(res => {
        expect(res.status).toBe(200)
        expect(res.body.status).toBe('success')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})

describe('Create room', () => {
  test('Success create room with status 201', done => {
    request(app)
      .post('/api/cabin/room')
      .set('authorization', `Bearer ${token}`)
      .send({
        cabinsSlug: slugCabin,
        roomNumber: '001',
        typeRoomId,
      })
      .then(res => {
        expect(res.status).toBe(201)
        expect(res.body.status).toBe('success')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Validation failed with status 400', done => {
    request(app)
      .post('/api/cabin/room')
      .set('authorization', `Bearer ${token}`)
      .send({
        cabinsSlug: slugCabin,
        roomNumber: 'test',
        typeRoomId,
      })
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.status).toBe('Validation Failed')
        expect(res.body.message).toBe('roomNumber must contain only numbers.')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Failed type room not found with status 404', done => {
    request(app)
      .post('/api/cabin/room')
      .set('authorization', `Bearer ${token}`)
      .send({
        cabinsSlug: slugCabin,
        roomNumber: '022',
        typeRoomId: 123,
      })
      .then(res => {
        expect(res.status).toBe(404)
        expect(res.body.status).toBe('Not Found')
        expect(res.body.message).toBe('Type room not found')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Failed cabin not found with status 404', done => {
    request(app)
      .post('/api/cabin/room')
      .set('authorization', `Bearer ${token}`)
      .send({
        cabinsSlug: 'test-another-slug-cabin',
        roomNumber: '066',
        typeRoomId,
      })
      .then(res => {
        expect(res.status).toBe(404)
        expect(res.body.status).toBe('Not Found')
        expect(res.body.message).toBe('Cabin not found')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Failed duplicate room number with status 400', done => {
    request(app)
      .post('/api/cabin/room')
      .set('authorization', `Bearer ${token}`)
      .send({
        cabinsSlug: slugCabin,
        roomNumber: '001',
        typeRoomId,
      })
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.status).toBe('Bad Request')
        expect(res.body.message).toBe(
          'Room number already axist for this location'
        )
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})

describe('Get Cabin by slug', () => {
  test('Success with status 200', done => {
    request(app)
      .get(`/api/cabin/detail/${slugCabin}`)
      .then(res => {
        expect(res.status).toBe(200)
        expect(res.body.status).toBe('success')
        expect(res.body).toHaveProperty('data')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Cabin notfound with status 404', done => {
    request(app)
      .get(`/api/cabin/detail/another-slug-cabin`)
      .then(res => {
        expect(res.status).toBe(404)
        expect(res.body.status).toBe('Not Found')
        expect(res.body.message).toBe('Cabin not found')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})

describe('Get Cabins location', () => {
  test('Success get cabins location 200', done => {
    request(app)
      .get('/api/cabins/location')
      .then(res => {
        expect(res.status).toBe(200)
        expect(res.body.status).toBe('success')
        expect(res.body).toHaveProperty('data')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})

describe('Get type rooms', () => {
  test('Success get type rooms 200', done => {
    request(app)
      .get('/api/cabin/type-room')
      .set('authorization', `Bearer ${token}`)
      .then(res => {
        expect(res.status).toBe(200)
        expect(res.body.status).toBe('success')
        expect(res.body).toHaveProperty('data')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})

describe('Get detail cabin Room by id', () => {
  test('Success with status 200', done => {
    request(app)
      .get(`/api/cabin/room/${slugCabin}/${roomId}`)
      .then(res => {
        expect(res.status).toBe(200)
        expect(res.body.status).toBe('success')
        expect(res.body).toHaveProperty('data')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  test('Failed with status 404', done => {
    request(app)
      .get(`/api/cabin/room/nothing/${roomId}`)
      .then(res => {
        expect(res.status).toBe(404)
        expect(res.body.status).toBe('Not Found')
        expect(res.body.message).toBe('Cabin not found')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})
