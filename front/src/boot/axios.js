import { defineBoot } from '#q-app'
import axios from 'axios'

// endereço da API (pasta api-template)
// '/api' passa pelo proxy do quasar.config.js, que repassa para http://localhost:3000
const api = axios.create({ baseURL: '/api' })

export default defineBoot(({ app }) => {
  app.config.globalProperties.$api = api
})

export { api }
