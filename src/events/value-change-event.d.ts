import Event from '../event'

export default class ValueChangeEvent extends Event {
  oldValue: any
  newValue: any
}
