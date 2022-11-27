import { getModelToken } from '@nestjs/sequelize'
import { Test, TestingModule } from '@nestjs/testing'
import { User } from './user.model'
import { UsersService } from './users.service'

describe('UsersService', () => {
  let service: UsersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: getModelToken(User), useValue: {} }],
    }).compile()

    service = module.get<UsersService>(UsersService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
