import { compareHashToData, hashData } from './auth.utils'

describe('AuthUtils', () => {
  it('should match hash and data when data is same', async () => {
    const hash = await hashData('password')
    const isMatch = await compareHashToData(hash, 'password')
    expect(isMatch).toBe(true)
  })

  it('should not match hash and data when data is different', async () => {
    const hash = await hashData('password')
    const isMatch = await compareHashToData(hash, 'password1')
    expect(isMatch).toBe(false)
  })
})
