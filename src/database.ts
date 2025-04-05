import mongoose from 'mongoose'
import config from './config'

const initDb = () => {
  const dbURI = config.dbUrl
  const options = {
    autoIndex: true,
    connectTimeoutMS: 60000, // Increase connection timeout to 60 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  }

  mongoose.set('strictQuery', true)

  mongoose
    .connect(dbURI, options)
    .then(() => {
      console.info('Mongoose connection done')
    })
    .catch((e) => {
      console.error('Mongoose connection error')
      console.error(e)
    })

  // CONNECTION EVENTS

  // If the connection throws an error
  mongoose.connection.on('error', (err) => {
    console.error('Mongoose default connection error: ' + err)
  })

  // When the connection is disconnected
  mongoose.connection.on('disconnected', () => {
    console.info('Mongoose default connection disconnected')
  })

  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', () => {
    mongoose.connection.close()
    console.info('Mongoose default connection disconnected through app termination')
    process.exit(0)
  })
}

initDb()
