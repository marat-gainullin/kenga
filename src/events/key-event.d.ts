import Event from '../event'

export default class KeyEvent extends Event {
  altDown: boolean
  controlDown: boolean
  shiftDown: boolean
  metaDown: boolean
  key: number
  char: number
}
