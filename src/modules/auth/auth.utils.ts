import { genSalt, hash, compare } from 'bcryptjs'

export const hashPassword = async (password: string) => {
  const salt = await genSalt(10)
  return hash(password, salt)
}

export const compareHashToPassword = (hash: string, password: string) => {
  return compare(password, hash)
}
