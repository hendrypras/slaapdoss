const Redis = require('ioredis')
const redisClient = new Redis()

const getLockingUser = async keyUser => {
  const attempts = await redisClient.get(keyUser)
  return attempts ? parseInt(attempts, 10) : 0
}
const setLockingUser = (keyUser, countLocking) => {
  redisClient.set(keyUser, countLocking + 1, 'EX', 10)
}

module.exports = {
  getLockingUser,
  setLockingUser,
}
