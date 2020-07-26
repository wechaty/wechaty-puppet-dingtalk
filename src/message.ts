
export class Message {

  readonly msgtype: string

  constructor (type: string) {
    this.msgtype = type
  }

  toString () {
    return JSON.stringify(this)
  }

}

export class TextMessage extends Message {

  public readonly text: {content:string}
  public readonly at: {atMobiles:string[], isAtAll:boolean}
  constructor (content: string, at:string[] = [], atAll = false) {
    super('text')
    this.text = { content }
    this.at = { atMobiles:at, isAtAll:atAll }
  }

}

export class MarkDownMessage extends Message {

  public readonly markdown: {text:string, title:string}
  public readonly at: {atMobiles:string[], isAtAll:boolean}
  constructor (title: string, text:string, at:string[] = [], atAll = false) {
    super('markdown')
    this.markdown = { text, title }
    this.at = { atMobiles:at, isAtAll:atAll }
  }

}
export type SimpleActionCard =  {text:string, title:string, singleTitle :string, singleURL: string};
export class SimpleActionCardMessage extends Message {

  public readonly actionCard: SimpleActionCard
  constructor (card: SimpleActionCard) {
    super('actionCard')
    this.actionCard = card
  }

}
export type ActionCardBtn = {
  title: string,
  actionURL: string
}
export type ActionCard =  {
  text:string,
  title:string,
  hideAvatar :string,
  btnOrientation: string,
  btns: ActionCardBtn[]
};
export class ActionCardMessage extends Message {

  public readonly actionCard: ActionCard
  constructor (card: ActionCard) {
    super('actionCard')
    this.actionCard = card
  }

}
export type FeedCardLink = {
  title: string,
  messageURL: string,
  picURL: string
}
export class FeedCardMessage extends Message {

  public readonly actionCard: { links: FeedCardLink[] }
  constructor (links: FeedCardLink[]) {
    super('actionCard')
    this.actionCard = { links }
  }

}
export class EmptyMessage extends Message {

  constructor () {
    super('empty')
  }

}
