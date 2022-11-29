import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'

export interface AccessTokenPayload {
  userId: number
  iat: number
  exp: number
}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        AccessTokenStrategy.extractJwt,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_ACCESS_SECRET'),
    })
  }

  validate(payload: AccessTokenPayload): AccessTokenPayload {
    return payload
  }

  private static extractJwt(req: Request) {
    const jwt = req.cookies['accessToken']
    if (!jwt || jwt.length === 0) return null
    return jwt
  }
}
