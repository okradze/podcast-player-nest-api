import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { AccessTokenPayload } from './access-token.strategy'

export interface RequestUser extends AccessTokenPayload {
  refreshToken: string
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.extractJwt,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    })
  }

  validate(req: Request, payload: AccessTokenPayload): RequestUser {
    const refreshToken =
      req.cookies['refreshToken'] || req.get('Authorization').replace('Bearer', '').trim()
    return { ...payload, refreshToken }
  }

  private static extractJwt(req: Request) {
    const jwt = req.cookies['refreshToken']
    if (!jwt || jwt.length === 0) return null
    return jwt
  }
}
