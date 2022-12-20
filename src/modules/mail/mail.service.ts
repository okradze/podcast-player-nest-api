import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  sendResetPassword(url: string, email: string, fullName: string) {
    return this.mailerService.sendMail({
      to: email,
      subject: 'Reset your password - Podcast Player',
      template: './reset-password',
      context: {
        fullName,
        url,
      },
    })
  }
}
