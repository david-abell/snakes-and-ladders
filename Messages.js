"use-strict";

class Messages {
  messageList = [];

  constructor(listEl) {
    this.messageEl = listEl;
    this.init();
  }

  static createListItem(obj) {
    const { message, playerColor } = obj;
    const listItem = document.createElement("li");
    listItem.innerText = message;
    if (playerColor) {
      listItem.style.color = playerColor;
    }
    return listItem;
  }

  update() {
    this.messageEl.replaceChildren(...this.messageList);
    this.messageEl.scrollTop = this.messageEl.scrollHeight;
  }

  add(obj) {
    const messageLi = Messages.createListItem(obj);
    this.messageList.push(messageLi);
    this.update();
  }

  init() {
    const firstMessage = this.messageEl.innerText;
    const firstLi = new DOMParser().parseFromString(
      `<li><b>${firstMessage}</b></li>`,
      "text/html"
    ).body.firstElementChild;
    this.messageList.push(firstLi);
  }
}

export default Messages;
