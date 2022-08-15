import Widget from './widget';
import ContainerEvent from './events/container-event';

export default class Container extends Widget {
  readonly count: number;
  child(index: number, subIndex?: number): Widget;
  children(): Widget[];
  forEach(action: (child: Widget) => void): void;
  indexOf(child: Widget): number;
  add(w: Widget, beforeIndex?: number | any, subIndex?: number): void;
  remove(child: Widget, subIndex?: number): Widget;
  clear(): void;

  addAddHandler(handler: (evt: ContainerEvent) => void): { removeHandler: () => void };
  onAdd: (evt: ContainerEvent) => void;

  addRemoveHandler(handler: (evt: ContainerEvent) => void): { removeHandler: () => void };
  onRemove: (evt: ContainerEvent) => void;
}
