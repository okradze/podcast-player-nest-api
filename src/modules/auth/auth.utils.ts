import * as bcrypt from 'bcryptjs'

export const hashData = async (data: string) => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(data, salt)
}

export const compareHashToData = (hash: string, data: string) => {
  return bcrypt.compare(data, hash)
}
