import Event from '../event'

export default class MouseEvent extends Event {
  x: number
  y: number
  screenX: number
  screenY: number
  altDown: boolean
  controlDown: boolean
  shiftDown: boolean
  metaDown: boolean
  button: number
  clickCount: number
}
