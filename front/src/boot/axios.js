import { defineBoot } from '#q-app'
import axios from 'axios'

// endereço da API (pasta api-template)
const api = axios.create({ baseURL: 'http://localhost:3000' })

export default defineBoot(({ app }) => {
  app.config.globalProperties.$api = api
})

export { api }
