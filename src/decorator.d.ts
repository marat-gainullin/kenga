import Widget from './widget';

export default interface Decorator {
  selector: HTMLElement;
  clearer: HTMLElement;

  nullable: boolean;
  onValueSelect: (source: Widget) => void;
}
