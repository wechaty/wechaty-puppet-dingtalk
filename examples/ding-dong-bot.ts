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

const puppet = new PuppetDing({ robot:{ port:3000 } })
puppet.on('message', async i => {
  const mes = await puppet.messagePayload(i.messageId)
  if (/ping/gi.test(mes.text as string)) {
    await puppet.messageSendText(mes.roomId as string, 'dong')
  }

})
