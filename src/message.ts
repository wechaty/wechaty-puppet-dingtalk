
export interface Message {

  readonly msgtype: string

}

export class TextMessage implements Message {

  public readonly text: {content:string}
  public readonly msgtype: string;
  public readonly at: {atMobiles:string[], isAtAll:boolean}
  constructor (content: string, at:string[] = [], atAll = false) {
    this.msgtype = 'text'
    this.text = { content }
    this.at = { atMobiles:at, isAtAll:atAll }
  }

}

export class MarkDownMessage implements Message {

  public readonly markdown: {text:string, title:string}
  public readonly msgtype: string;
  public readonly at: {atMobiles:string[], isAtAll:boolean}
  constructor (title: string, text:string, at:string[] = [], atAll = false) {
    this.msgtype = 'markdown'
    this.markdown = { text, title }
    this.at = { atMobiles:at, isAtAll:atAll }
  }

}
export type SimpleActionCard =  {text:string, title:string, singleTitle :string, singleURL: string};
export class SimpleActionCardMessage implements Message {

  public readonly actionCard: SimpleActionCard
  public readonly msgtype: string;
  constructor (card: SimpleActionCard) {
    this.msgtype = 'actionCard'
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
export class ActionCardMessage implements Message {

  public readonly actionCard: ActionCard
  public readonly msgtype: string;
  constructor (card: ActionCard) {
    this.msgtype = 'actionCard'
    this.actionCard = card
  }

}
export type FeedCardLink = {
  title: string,
  messageURL: string,
  picURL: string
}
export class FeedCardMessage implements Message {

  public readonly actionCard: { links: FeedCardLink[] }
  public readonly msgtype: string;
  constructor (links: FeedCardLink[]) {
    this.msgtype = 'actionCard'
    this.actionCard = { links }
  }

}
export class EmptyMessage implements Message {

  readonly msgtype: string;

  constructor () {
    this.msgtype = 'empty'
  }

}
