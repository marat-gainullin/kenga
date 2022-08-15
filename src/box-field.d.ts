import Widget from './widget';
import TextChangeEvent from './events/text-change-event';
import ValueChangeEvent from './events/value-change-event';
import FocusEvent from './events/focus-event';
import BlurEvent from './events/blur-event';
import KeyEvent from './events/key-event';

export default class BoxField extends Widget {
  readonly box: HTMLInputElement;
  emptyText: string;
  readonly valid: boolean;
  showError(errorText: string): void;
  hideError(): void;
  formatError: () => string;
  checkValidity: () => boolean;
  validate: () => void;
  validateOnInput: boolean;

  fireTextChanged(): void;
  addTextChangeHandler(handler: (evt: TextChangeEvent) => void): { removeHandler: () => void };
  onTextChange: (evt: TextChangeEvent) => void;

  addFocusHandler(handler: (evt: FocusEvent) => void): { removeHandler: () => void };
  addFocusLostHandler(handler: (evt: BlurEvent) => void): { removeHandler: () => void };

  addKeyTypeHandler(handler: (evt: KeyEvent) => void): { removeHandler: () => void };
  addKeyPressHandler(handler: (evt: KeyEvent) => void): { removeHandler: () => void };
  addKeyReleaseHandler(handler: (evt: KeyEvent) => void): { removeHandler: () => void };

  fireValueChanged(): void;
  addValueChangeHandler(handler: (evt: ValueChangeEvent) => void): { removeHandler: () => void };
}
