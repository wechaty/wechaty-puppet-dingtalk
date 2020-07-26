import { ChatbotDing } from './chatbot-ding'
import { Message } from './message'

export class RoomDing {

  protected static rooms: Map<string, RoomDing> = new Map<string, RoomDing>()

  public chatbots: ChatbotDing
  public romeID :string
  constructor (roomId: string, hookUrl: string) {
    this.romeID = roomId
    this.chatbots  = new ChatbotDing(hookUrl)
  }

  public static getRoom (id: string) {
    const room = RoomDing.rooms.get(id)
    if (room) {
      return room
    }
    throw new Error(`No room ${id}`)
  }
  public static create (roomId: string, hookUrl: string) {
    const room = new RoomDing(roomId, hookUrl)
    this.rooms.set(roomId, room)
  }
  public async sendMessage (message: Message) {
    return this.chatbots.sendMessage(message)
  }

}
