import axios, { AxiosError } from 'axios'
import { cookies } from 'next/headers'

export const api = axios.create({
  baseURL: new URL('api', process.env.NEXT_PUBLIC_API_SERVER_URL).toString(),
  withCredentials: true
})

api.interceptors.request.use(async req => {
  const cookie = await cookies()

  req.headers['Cookie'] = cookie.toString()

  req.withCredentials = true

  return req
})

api.interceptors.response.use(
  response => response,
  (_error: AxiosError) => Promise.resolve({ data: null })
)