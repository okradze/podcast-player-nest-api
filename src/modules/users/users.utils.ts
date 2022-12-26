import { User } from './user.model'

export const transformUser = ({ id, fullName, email }: User) => {
  return { id, fullName, email }
}
