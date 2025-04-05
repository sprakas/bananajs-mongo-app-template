import { BananaApp } from '@banana-universe/bananajs'
import { Routes } from './routes'
import config from './config'
import './database'

const bananaApp = new BananaApp(Routes).getInstance()

bananaApp.listen(config.port, () => {
  console.log('Server started on port 3000')
})
