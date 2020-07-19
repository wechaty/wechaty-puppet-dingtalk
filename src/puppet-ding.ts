/**
 *   Wechaty - https://github.com/chatie/wechaty
 *
 *   @copyright 2016-2018 Huan LI <zixia@zixia.net>
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */

import {
  MessagePayload, MessageType,

  Puppet,
  PuppetOptions,

} from 'wechaty-puppet'

import {
  log,
  VERSION,
} from './config'
import * as https from 'https'
import * as http from 'http'
import * as net from 'net'
import { IncomingMessage, ServerResponse } from 'http'
import * as crypto from 'crypto'
export type DingRobotOptions = {
  port?: number,
  host?:string,
  key?:string,
  cert?:string,
  appKey?:string,
  appSecret?:string,
}
export type PuppetDingOptions = PuppetOptions & {
  robot?:DingRobotOptions,
}

// WIP
// @ts-ignore
class PuppetDing extends Puppet {

  public static readonly VERSION = VERSION
  private server?: net.Server
  private secret?: string
  private message: Map<string, MessagePayload>
  constructor (
    public options: PuppetDingOptions = {},
  ) {
    super(options)
    this.message = new Map<string, MessagePayload>()
    if (options.robot) {
      const robot = options.robot
      let port: number
      let host = robot.host || '0.0.0.0'
      let ssl = false
      if (robot.key && robot.cert) {
        this.server = https.createServer({ cert:robot.cert, key:robot.key }, this.robotCallback.bind(this))
        port = robot.port || 443
        ssl = true
      } else {
        this.server = http.createServer(this.robotCallback.bind(this))
        port = robot.port || 80
      }
      this.server.listen(port, host)
      if (robot.appSecret) {
        this.secret = robot.appSecret
      }
      log.verbose('PuppetDing', `Dingtalk robot is running in ${ssl ? 'https' : 'http'}://${host}:${port}`)
    }

  }

  private checkSign (timestamp:string, sign:string) {
    if (!this.secret) {
      return true
    }
    const stringToSign = `${timestamp}\n${this.secret}`
    const s = crypto.createHmac('sha256', Buffer.from(this.secret, 'utf8')).update(stringToSign).digest('base64')
    return s === sign
  }

  private async robotCallback (req: IncomingMessage, res: ServerResponse) {
    if (req.headers.timestamp && Math.abs(Date.now() - Number(req.headers.timestamp)) < 1000 * 60 * 60) {
      if (this.checkSign(req.headers.timestamp as string, req.headers.sign as string)) {
        let text = ''
        req.on('data', d => { text += d.toString() })
        req.on('end', () => {
          let json = JSON.parse(text)
          const basePayload: MessagePayload = {
            fromId: json.senderId,
            id        : json.msgId,
            roomId: json.conversationId,
            text: json.text,
            timestamp :  Number(req.headers.timestamp),
            toId: json.chatbotUserId,
            type      : MessageType.Text,
          }
          log.info('d',json.sessionWebhook)
          this.message.set(basePayload.id, basePayload)
          this.emit('message', { messageId:basePayload.id })
          res.end()
        })

      }
    }
  }

  protected async messageRawPayload (messageId: string) {
    return messageId
  }

  protected async messageRawPayloadParser (rawPayload: any) {
    return this.message.get(rawPayload) as MessagePayload
  }

}

export { PuppetDing }
export default PuppetDing
