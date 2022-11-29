import * as bcrypt from 'bcryptjs'
import { Response } from 'express'

export const hashData = async (data: string) => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(data, salt)
}

export const compareHashToData = (hash: string, data: string) => {
  return bcrypt.compare(data, hash)
}

export const setTokensToCookies = (
  res: Response,
  tokens: { accessToken: string; refreshToken: string },
) => {
  const AGE_IN_15_MINUTES = 15 * 60 * 1000
  const AGE_IN_7_DAYS = 7 * 24 * 60 * 60 * 1000

  res.cookie('accessToken', tokens.accessToken, {
    httpOnly: true,
    path: '/',
    maxAge: AGE_IN_15_MINUTES,
  })

  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    path: '/',
    maxAge: AGE_IN_7_DAYS,
  })
}

export const clearTokensFromCookies = (res: Response) => {
  res.clearCookie('accessToken')
  res.clearCookie('refreshToken')
}
