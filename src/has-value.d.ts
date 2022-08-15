import ValueChangeEvent from './events/value-change-event'

export default interface HasValue {
  text: string
  value: any
  onValueChange: (evt: ValueChangeEvent) => void
  addValueChangeHandler: (handler: (evt: ValueChangeEvent) => void) => { removeHandler: () => void }
  fireValueChanged(): void
}
