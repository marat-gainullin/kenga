export default class Popup {
  constructor(anElement: HTMLElement)
  showRelativeTo(anElement: HTMLElement, horizontal: boolean, leftToRight?: boolean, topToBottom?: boolean): void
  popupRelativeTo(anElement: HTMLElement, horizontal: boolean, leftToRight?: boolean, topToBottom?: boolean): void
  showAt(left: number, top: number): void
  popupAt(left: number, top: number): void
  get shown(): boolean
  close(): void
}
