import Event from '../event'
import Widget from '../widget'

export default class ValueChangeEvent extends Event {
  constructor(w: Widget, oldValue: any, newValue: any)
  oldValue: any
  newValue: any
}
