import { EmailType } from '../env/email';
import { BasePage } from './base';

export class SecondaryEmailPage extends BasePage {
  readonly path = 'settings/emails';

  setEmail(email: string) {
    return this.page.fill('input[type=email]', email);
  }

  setVerificationCode(code: string) {
    return this.page.fill('input[type=text]', code);
  }

  submit() {
    return Promise.all([
      this.page.click('button[type=submit]'),
      this.page.waitForNavigation(),
    ]);
  }

  async addAndVerify(email: string) {
    await this.env.email.clear(email);
    await this.setEmail(email);
    await this.submit();
    const msg = await this.env.email.waitForEmail(
      email,
      EmailType.verifySecondaryCode
    );
    const code = msg.headers['x-verify-code'] as string;
    await this.setVerificationCode(code);
    await this.submit();
    return code;
  }
}
