import Event from '../event'
import Widget from '../widget'

export default class ContainerEvent extends Event {
  child: Widget;
}
