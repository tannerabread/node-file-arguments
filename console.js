// import destructured Console Class object
const { Console } = console
// import the fs module
const fs = require('fs')

// create write streams for our custom logger
const output = fs.createWriteStream(`./logs/stdout_${Date()}.log`)
const errOutput = fs.createWriteStream(`./logs/stderr_${Date()}.log`)

// simple custom logger
const logger = new Console({ stdout: output, stderr: errOutput })

// can now be used like console.log except will write to files
// const name = 'Bannon'
// logger.log('my name is: %s', name)
// logger.error('Failed', Date(), Date.now())

// logger.log('second line')
// logger.error('Failed again', Date(), Date.now())

// for (let i = 1; i <= 10; i++) {
//   for (let j = 1; j <= 5; j++) {
//     logger.count('inner loop')
//     logger.count(j)
//     logger.count()
//     logger.count(`${i} % ${j} === 0 ${i % j === 0}`)
//   }
//   logger.count('outer loop')
//   logger.count(i)
//   logger.count()
// }

// for (let i = 1; i <= 10; i++) {
//   for (let j = 2; j <= 5; j++) {
//     i % j === 0 ?
//       logger.log(`${i} % ${j} === 0 ${i % j === 0}`) :
//       logger.error(`${i} % ${j} === 0 ${i % j === 0}`)
//   }
// }

// let tabularData = [
//   { firstName: 'Charlie', lastName: 'Daniels', email: 'cdaniels@example.com' },
//   { firstName: 'Django', lastName: 'Smith', email: 'django@example.com' },
//   { firstName: 'Beyonce', email: 'yonce@example.com' }
// ]

// const tabularData = require('./mockdata.json')

// logger.table(tabularData)

logger.time()
for (let i = 0; i < 10000; i++) {
  for (let j = 1; j <= 500 * i; j++) {
    if (j === 500) {logger.log(j)}
  }
  logger.log(`Time at end of i=${i}:`)
  logger.timeLog()
}
logger.timeEnd()