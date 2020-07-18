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
  private server: net.Server | undefined
  private secret: string | undefined
  constructor (
    public options: PuppetDingOptions = {},
  ) {
    super(options)
    if (options.robot) {
      const robot = options.robot
      let port: number
      let host = robot.host || '0.0.0.0'
      let ssl = false
      if (robot.key && robot.cert) {
        this.server = https.createServer({ cert:robot.cert, key:robot.key }, this.robotCallback)
        port = robot.port || 443
        ssl = true
      } else {
        this.server = http.createServer(this.robotCallback)
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
    log.info(String(s === sign))
    return s === sign
  }

  private async robotCallback (req: IncomingMessage, res: ServerResponse) {
    if (req.headers.timestamp && Math.abs(new Date().getTime() - Number(req.headers.timestamp)) < 1000 * 60 * 60) {
      if (!this.checkSign(req.headers.timestamp as string, req.headers.sign as string)) {

      }
    }
    res.end()
  }

}

export { PuppetDing }
export default PuppetDing
