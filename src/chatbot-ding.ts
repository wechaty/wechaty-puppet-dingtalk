import axios from 'axios'
import { log } from 'brolog'
import { Message } from './message'
const headers = {
  'Content-Type': 'application/json',
}

export class ChatbotDing {

  private rate: number
  private hookUrl: string

  constructor (url:string) {
    this.hookUrl = url
    this.rate = 0
  }

  public async sendMessage (message:Message) {
    if (this.rate > 20) {
      log.error('sendMeaasge', 'send to quick!')
      return
    }
    this.rate++
    setTimeout(() => this.rate--, 60 * 1000 + 100)
    try {
      await axios.post(this.hookUrl, JSON.stringify(message), { headers })
    } catch (e) {
      log.error('sendMeaasge', e)
    }
  }

}
