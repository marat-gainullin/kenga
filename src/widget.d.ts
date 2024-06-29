  import WidgetEvent from './events/widget-event';
  import ActionEvent from './events/action-event';
  import MouseEvent from './events/mouse-event';
  import ValueChangeEvent from './events/value-change-event';
  import FocusEvent from './events/focus-event';
  import BlurEvent from './events/blur-event';
  import KeyEvent from './events/key-event';
  import ItemEvent from './events/item-event';

  export class Tab {
    title: string;
    toolTipText: string;
    icon: string | HTMLElement;
    closable: boolean;
    readonly element: HTMLElement;
  }

  export default class Widget {
    visibleDisplay: string;
    parent: Widget;
    readonly element: HTMLElement;
    readonly shell: HTMLElement;
    readonly box: HTMLElement;
    classes: string;
    enabled: boolean;
    name: string;
    title: string;
    toolTipText: string;
    background: string;
    foreground: string;
    error: string;
    tabIndex: number;
    focusable: boolean;
    contextMenu: Widget;
    attached: boolean;
    visible: boolean;
    left: number;
    top: number;
    width: number;
    height: number;
    /**
     * It is used only when the widget is a child of a TabbedPane
     */
    tab: Tab;

    constructor(box?: HTMLElement, shell?: HTMLElement)

    focus(): void;
    blur(): void;

    addActionHandler(handler: (evt: ActionEvent) => void): { removeHandler: () => void };
    onAction: (evt: ActionEvent) => void;
    fireAction: () => void;

    addMouseExitHandler(handler: (evt: MouseEvent) => void): { removeHandler: () => void };
    onMouseExit: (evt: MouseEvent) => void;

    addMouseClickHandler(handler: (evt: MouseEvent) => void): { removeHandler: () => void };
    onMouseClick: (evt: MouseEvent) => void;

    addMouseDoubleClickHandler(handler: (evt: MouseEvent) => void): { removeHandler: () => void };
    onMouseDoubleClick: (evt: MouseEvent) => void;

    addMousePressHandler(handler: (evt: MouseEvent) => void): { removeHandler: () => void };
    onMousePress: (evt: MouseEvent) => void;

    addMouseReleaseHandler(handler: (evt: MouseEvent) => void): { removeHandler: () => void };
    onMouseRelease: (evt: MouseEvent) => void;

    addMouseEnterHandler(handler: (evt: MouseEvent) => void): { removeHandler: () => void };
    onMouseEnter: (evt: MouseEvent) => void;

    addMouseWheelHandler(handler: (evt: MouseEvent) => void): { removeHandler: () => void };
    onMouseWheelMove: (evt: MouseEvent) => void;

    addMouseMoveHandler(handler: (evt: MouseEvent) => void): { removeHandler: () => void };
    onMouseMove: (evt: MouseEvent) => void;

    addShowHandler(handler: (evt: WidgetEvent) => void): { removeHandler: () => void };
    onShow: (evt: WidgetEvent) => void;

    addHideHandler(handler: (evt: WidgetEvent) => void): { removeHandler: () => void };
    onHide: (evt: WidgetEvent) => void;

    onFocus: (evt: FocusEvent) => void;
    onFocusLost: (evt: BlurEvent) => void;
    onKeyType: (evt: KeyEvent) => void;
    onKeyPress: (evt: KeyEvent) => void;
    onKeyRelease: (evt: KeyEvent) => void;
    onSelect: (evt: ItemEvent) => void;
    onValueChange: (evt: ValueChangeEvent) => void;
  }
