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
import { PuppetDing } from '../src/mod'
import { log } from 'brolog'
import axios from 'axios'
const send = `
{
     "msgtype": "text",
    "text": {
         "content": "pong"
     }
}
 `
const puppet = new PuppetDing({ robot:{ port:3000 } })
puppet.on('message', async i => {
  log.info('11', i.messageId)
  const wh = JSON.parse((await puppet.messagePayload(i.messageId)).text as string).sessionWebhook
  if (/ping/gi.test(JSON.parse((await puppet.messagePayload(i.messageId)).text as string).text.content)) {
    // eslint-disable-next-line promise/catch-or-return
    axios.post(wh, send, { headers:{ 'Content-Type':'application/json' } }).then(data => {
      log.info('test', data.data)
      return null
    })
  }

})
