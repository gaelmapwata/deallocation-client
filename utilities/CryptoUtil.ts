// eslint-disable-next-line import/no-extraneous-dependencies
import CryptoJS from 'crypto-js'

export default {
  encrypt (text: string, key: string): string {
    return CryptoJS.AES.encrypt(text, key).toString()
  }
}
