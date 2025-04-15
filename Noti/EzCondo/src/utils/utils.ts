import axios, { AxiosError } from 'axios'
import HttpStatusCode from '~/constants/httpStatusCode.enum'

// Kiểm tra xem error có phải là AxiosError không
export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error)
}

// Lỗi 422 Unprocessable Entity
export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}
