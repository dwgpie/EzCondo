import axios, { AxiosError, type AxiosInstance } from 'axios'
import HttpStatusCode from '~/constants/httpStatusCode.enum'
import { AuthRespone } from '~/types/auth.type'
import {
  clearAccessTokenToLocalStorage,
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
      // baseURL: 'http://172.20.0.129:7254',
      headers: {
        'Content-Type': 'application/json'
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
          const responseData = response as AuthRespone
          const token = responseData.data.token
          const role = responseData.data.role
          this.accessToken = token
          saveAccessTokenToLocalStorage(token)
          saveUserRoleToLocalStorage(role)
        } else if (url === '/logout') {
          this.accessToken = ''
          clearAccessTokenToLocalStorage()
          clearUserRoleFromLocalStorage()
        }
        console.log('Response data:', response.data)
        return response
      },
      function (error: AxiosError) {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
