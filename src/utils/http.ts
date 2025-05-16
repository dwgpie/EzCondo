import axios, { AxiosError, type AxiosInstance } from 'axios'
import HttpStatusCode from '~/constants/httpStatusCode.enum'
import {
  clearAccessTokenFromLocalStorage,
  getAccessTokenFromLocalStorage,
  saveAccessTokenToLocalStorage,
  saveUserRoleToLocalStorage,
  clearUserRoleFromLocalStorage
} from './auth'

class Http {
  instance: AxiosInstance
  private accessToken: string
  constructor() {
    this.accessToken = getAccessTokenFromLocalStorage()
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      }
    })

    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = `Bearer ${this.accessToken}`
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === '/api/Auth/login') {
          const responseData = response.data.data
          const token = responseData.token
          const role = responseData.role
          saveAccessTokenToLocalStorage(token, role)
          saveUserRoleToLocalStorage(role)
        } else if (url === '/logout') {
          this.accessToken = ''
          clearAccessTokenFromLocalStorage()
          clearUserRoleFromLocalStorage()
        }
        console.log('Response data:', response.data)
        return response
      },
      function (error: AxiosError) {
        if (error.response?.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('role')
        } else if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          const data: any | undefined = error.response?.data
          const message = data.message || error.message
          console.log('Error message:', message)
        }
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance

export default http
