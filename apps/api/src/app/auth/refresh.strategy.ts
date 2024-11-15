import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'

import { env } from '~/env'
import { SessionService } from '~/app/session/session.service'
import { JwtAuthPayload } from '~/types/auth.types'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private readonly sessionService: SessionService) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          if (req) {
            const data = req.cookies[env.AUTH_COOKIE]

            if (data && data.refreshToken) return data.refreshToken
          }

          return null
        }
      ]),
      secretOrKey: env.SESSION_KEY
    })
  }

  async validate(payload: JwtAuthPayload) {
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      await this.sessionService.expire(payload.sessionId)
    } else {
      const session = await this.sessionService.refresh(payload)

      if (session) return session
    }

    throw new UnauthorizedException()
  }
}
