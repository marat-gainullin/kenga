/* global expect */
/* global NaN, Promise */
import '../src/layout.css';
import '../src/theme.css';

import Managed from 'septima-model/managed';
import Font from '../src/font';
import Widget from '../src/widget';
import Container from '../src/container';
import ActionEvent from '../src/events/action-event';
import BlurEvent from '../src/events/blur-event';
import ContainerEvent from '../src/events/container-event';
import FocusEvent from '../src/events/focus-event';
import ItemEvent from '../src/events/item-event';
import KeyEvent from '../src/events/key-event';
import MouseEvent from '../src/events/mouse-event';
import ValueChangeEvent from '../src/events/value-change-event';
import WidgetEvent from '../src/events/widget-event';
import Bound from '../src/bound';
import Decorator from '../src/decorator';
import BoxField from '../src/box-field';
import Utils from '../src/utils';

function expectValue(obj, prop, value) {
    obj[prop] = value;
    expect(obj[prop]).toEqual(value);
}

function expectWidget(widget) {
    expect('name' in widget).toBeTruthy();
    expectValue(widget, 'name', 'widgetName');
    expect('element' in widget).toBeTruthy();
    expect('parent' in widget).toBeTruthy();
    expectValue(widget, 'parent', new widget.constructor());
    expectValue(widget, 'parent', null);
    expect('title' in widget).toBeTruthy();
    expectValue(widget, 'title', '2');
    expectValue(widget, 'title', '1');
    expect('left' in widget).toBeTruthy();
    expectValue(widget, 'left', 30);
    expect('width' in widget).toBeTruthy();
    expectValue(widget, 'width', 50);
    expect('top' in widget).toBeTruthy();
    expectValue(widget, 'top', 57);
    expect('height' in widget).toBeTruthy();
    expectValue(widget, 'height', 80);
    expect('enabled' in widget).toBeTruthy();
    expectValue(widget, 'enabled', false);
    expectValue(widget, 'enabled', true);
    expectValue(widget, 'enabled', true);
    expectValue(widget, 'enabled', false);
    expectValue(widget, 'enabled', true);
    expect('visible' in widget).toBeTruthy();
    expectValue(widget, 'visible', false);
    expectValue(widget, 'visible', true);
    expectValue(widget, 'visible', true);
    expectValue(widget, 'visible', false);
    expectValue(widget, 'visible', true);
    expect('cursor' in widget).toBeTruthy();
    expectValue(widget, 'cursor', 'wait');
    expect('background' in widget).toBeTruthy();
    const bg = '#fcfcfc';
    expectValue(widget, 'background', bg);
    expectValue(widget, 'background', bg);
    expectValue(widget, 'background', '#fcfcfa');
    expectValue(widget, 'background', null);
    expect('foreground' in widget).toBeTruthy();
    const fg = '#bbb';
    expectValue(widget, 'foreground', fg);
    expectValue(widget, 'foreground', fg);
    expectValue(widget, 'foreground', '#bbb');
    expectValue(widget, 'foreground', null);
    expect('error' in widget).toBeTruthy();
    expectValue(widget, 'error', 'sample validation message');
    widget.error = null;
    expect('contextMenu' in widget).toBeTruthy();
    expectValue(widget, 'contextMenu', new widget.constructor());
    expect('toolTipText' in widget).toBeTruthy();
    expectValue(widget, 'toolTipText', ' sample tooltip');
    expectValue(widget, 'toolTipText', ' sample tooltip');
    expect('tabIndex' in widget).toBeTruthy();
    expectValue(widget, 'tabIndex', 1);
    expect('focusable' in widget).toBeTruthy();
    expectValue(widget, 'focusable', true);
    expectValue(widget, 'focusable', false);
    expectValue(widget, 'focusable', false);
    expect('font' in widget).toBeDefined();
    const fnt = new Font('Arial', Font.Style.BOLD_ITALIC, 14);
    expectValue(widget, 'font', fnt);
    expectValue(widget, 'font', fnt);
    expectValue(widget, 'font', null);
    expect(widget.focus).toBeDefined();
    expect(typeof widget.focus).toEqual('function');
    widget.focus();

    expect('onShow' in widget).toBeTruthy();
    expectValue(widget, 'onShow', function () {
    });
    expectValue(widget, 'onShow', null);
    expect('onHide' in widget).toBeTruthy();
    expectValue(widget, 'onHide', function () {
    });
    expectValue(widget, 'onHide', null);
    expect('onMouseRelease' in widget).toBeTruthy();
    expectValue(widget, 'onMouseRelease', function () {
    });
    expectValue(widget, 'onMouseRelease', null);
    expect('onFocusLost' in widget).toBeTruthy();
    expectValue(widget, 'onFocusLost', function () {
    });
    expectValue(widget, 'onFocusLost', null);
    expect('onMousePress' in widget).toBeTruthy();
    expectValue(widget, 'onMousePress', function () {
    });
    expectValue(widget, 'onMousePress', null);
    expect('onMouseEnter' in widget).toBeTruthy();
    expectValue(widget, 'onMouseEnter', function () {
    });
    expectValue(widget, 'onMouseEnter', null);
    expect('onMouseMove' in widget).toBeTruthy();
    expectValue(widget, 'onMouseMove', function () {
    });
    expectValue(widget, 'onMouseMove', null);
    expect('onAction' in widget).toBeTruthy();
    expectValue(widget, 'onAction', function () {
    });
    expectValue(widget, 'onAction', null);
    expect('onKeyRelease' in widget).toBeTruthy();
    expectValue(widget, 'onKeyRelease', function () {
    });
    expectValue(widget, 'onKeyRelease', null);
    expect('onKeyType' in widget).toBeTruthy();
    expectValue(widget, 'onKeyType', function () {
    });
    expectValue(widget, 'onKeyType', null);
    expect('onMouseWheelMove' in widget).toBeTruthy();
    expectValue(widget, 'onMouseWheelMove', function () {
    });
    expectValue(widget, 'onMouseWheelMove', null);
    expect('onFocus' in widget).toBeTruthy();
    expectValue(widget, 'onFocus', function () {
    });
    expectValue(widget, 'onFocus', null);
    expect('onMouseClick' in widget).toBeTruthy();
    expectValue(widget, 'onMouseClick', function () {
    });
    expectValue(widget, 'onMouseClick', null);
    expect('onMouseExit' in widget).toBeTruthy();
    expectValue(widget, 'onMouseExit', function () {
    });
    expectValue(widget, 'onMouseExit', null);
    expect('onKeyPress' in widget).toBeTruthy();
    expectValue(widget, 'onKeyPress', function () {
    });
    expectValue(widget, 'onKeyPress', null);
}

describe('Kenga Api', () => {
    it('Events Api', () => {
        const widget = new Widget();
        const container = new Container();
        const actionEvent = new ActionEvent(widget);
        expect(actionEvent.source).toBe(widget);
        expect(actionEvent.target).toBe(widget);
        expect(actionEvent.event).toBeUndefined();
        const blurEvent = new BlurEvent(widget);
        expect(blurEvent.source).toBe(widget);
        expect(blurEvent.target).toBe(widget);
        expect(blurEvent.event).toBeUndefined();
        const containerEvent = new ContainerEvent(container, widget);
        expect(containerEvent.source).toBe(container);
        expect(containerEvent.target).toBe(widget);
        expect(containerEvent.child).toBe(widget);
        expect(containerEvent.event).toBeUndefined();
        const focusEvent = new FocusEvent(widget);
        expect(focusEvent.source).toBe(widget);
        expect(focusEvent.target).toBe(widget);
        expect(focusEvent.event).toBeUndefined();
        const itemEvent = new ItemEvent(container, widget);
        expect(itemEvent.source).toBe(container);
        expect(itemEvent.target).toBe(widget);
        expect(itemEvent.item).toBe(widget);
        expect(itemEvent.event).toBeUndefined();
        const nativeEvent = {
            target: widget,
            altKey: true,
            ctrlKey: true,
            shiftKey: true,
            metaKey: true,
            keyCode: 45,
            charCode: 76,
            x: 23,
            y: 24,
            screenX: 8,
            screenY: 9,
            button: 3
        };
        const keyEvent = new KeyEvent(widget, nativeEvent);
        expect(keyEvent.source).toBe(widget);
        expect(keyEvent.target).toBe(widget);
        expect(keyEvent.event).toBe(nativeEvent);
        expect(keyEvent.altDown).toBeTruthy();
        expect(keyEvent.controlDown).toBeTruthy();
        expect(keyEvent.shiftDown).toBeTruthy();
        expect(keyEvent.metaDown).toBeTruthy();
        expect(keyEvent.key).toEqual(45);
        expect(keyEvent.char).toEqual(76);
        const mouseEvent1 = new MouseEvent(widget, nativeEvent, {});
        expect(mouseEvent1.source).toBe(widget);
        expect(mouseEvent1.target).toBe(widget);
        expect(mouseEvent1.event).toBe(nativeEvent);
        expect(mouseEvent1.altDown).toBeTruthy();
        expect(mouseEvent1.controlDown).toBeTruthy();
        expect(mouseEvent1.shiftDown).toBeTruthy();
        expect(mouseEvent1.metaDown).toBeTruthy();
        expect(mouseEvent1.x).toEqual(23);
        expect(mouseEvent1.y).toEqual(24);
        expect(mouseEvent1.screenX).toEqual(8);
        expect(mouseEvent1.screenY).toEqual(9);
        expect(mouseEvent1.button).toEqual(3);
        expect(mouseEvent1.clickCount).toEqual(0);
        const mouseEvent2 = new MouseEvent(widget, nativeEvent, 6);
        expect(mouseEvent2.clickCount).toEqual(6);
        const valueChangeEvent = new ValueChangeEvent(widget, 34, 45);
        expect(valueChangeEvent.source).toBe(widget);
        expect(valueChangeEvent.target).toBe(widget);
        expect(valueChangeEvent.oldValue).toEqual(34);
        expect(valueChangeEvent.newValue).toEqual(45);
        const widgetEvent = new WidgetEvent(widget);
        expect(widgetEvent.source).toBe(widget);
        expect(widgetEvent.target).toBe(widget);
    });
    it('Font', () => {
        const f = new Font('Tahoma', Font.Style.BOLD_ITALIC, 5);
        expect(f.family).toEqual('Tahoma');
        expect(f.size).toEqual(5);
        expect(f.style).toEqual(Font.Style.BOLD_ITALIC);
        expect(f.bold).toBeTruthy();
        expect(f.italic).toBeTruthy();
        expect(f + '').toEqual('Tahoma Bold Italic 5');
    });
    it('Bound Api. Scalar', () => {
        const data = new Proxy({
            path: new Proxy({
                name: 'Merilin'
            }, Managed.manageObject())
        }, Managed.manageObject());

        let changes = 0;
        const listenReg = Bound.observePath(data, 'path.name', {
            change: (evt) => {
                changes++;
            }
        });
        data.path.name += '_';
        expect(changes).toEqual(1);
        listenReg.unlisten();
        data.path.name += '_';
        expect(changes).toEqual(1);
        Bound.setPathData(data, 'path.name', 'Jane');
        expect(data.path.name).toEqual('Jane');
        expect(Bound.getPathData(data, 'path.name')).toEqual('Jane');
    });
    it('Bound Api. Elements', () => {
        const data = new Proxy({
            items: new Proxy([
                new Proxy({name: 'item1'}, Managed.manageObject()),
                new Proxy({name: 'item2'}, Managed.manageObject()),
                new Proxy({name: 'item3'}, Managed.manageObject())
            ], Managed.manageArray())
        }, Managed.manageObject());

        let changes = 0;
        const listenReg = Bound.observeElements(data.items, {
            change: (evt) => {
                changes++;
            }
        });
        data.items[1].name += '_';
        expect(changes).toEqual(1);
        listenReg.unlisten();
        data.items[1].name += '_';
        expect(changes).toEqual(1);
    });
    it('Path comparator', () => {
        const data = [
            {item: {path: {name: 'item1'}}},
            {item: {path: {name: 'item8'}}},
            {item: {path: {name: 'item3'}}},
            {item: {path: {name: null}}},
            {item: {path: {name: null}}},
            {item: {path: {name: 'item6'}}},
            {item: {path: {name: 'item5'}}},
            {item: {path: {name: 'item3'}}},
            {item: {path: {name: null}}},
            {item: {path: {name: 'item4'}}},
            {item: {path: {name: 'item7'}}},
            {item: {path: {name: 'item2'}}}
        ];
        const cmp = new Bound.PathComparator('item.path.name', false);
        expect(cmp.ascending).toBeFalsy();
        data.sort((o1, o2) => {
            return cmp.compare(o1, o2);
        });
        expect(data.map((item) => {
            return item.item.path.name;
        })).toEqual([
            null,
            null,
            null,
            'item8',
            'item7',
            'item6',
            'item5',
            'item4',
            'item3',
            'item3',
            'item2',
            'item1'
        ]);
    });

    it('Box.Shell', (done) => {
        const box = document.createElement('input');
        const shell = document.createElement('div');
        const field = new BoxField(box, shell);
        expect(field.element).toBe(shell);
        field.left += 56;
        field.top += 6;
        field.width += 30;
        field.height += 10;
        document.body.appendChild(field.element);
        Promise.resolve().then(() => {
            field.left += 56;
            field.top += 6;
            field.width += 30;
            field.height += 10;
            document.body.removeChild(field.element);
            done();
        });
    });

    it('Box.Structure', (done) => {
        const field = new BoxField();
        expect(field.element).toBeDefined();
        const oldVisibleDisplay = field.visibleDisplay;
        field.visibleDisplay = 'none';
        field.visibleDisplay = oldVisibleDisplay;
        field.emptyText = 'Provide data please...';
        field.tabIndex = 2;
        const focusReg = field.addFocusHandler(() => {
        });
        const focusLostReg = field.addFocusLostHandler(() => {
        });
        document.body.appendChild(field.element);
        Promise.resolve()
            .then(() => {
                field.focus();
            })
            .then(() => {
                field.blur();
            })
            .then(() => {
                focusReg.removeHandler();
                focusLostReg.removeHandler();
                done();
            });
    });

    class Field extends BoxField {
        constructor(text, box, shell) {
            if (arguments.length < 1)
                text = '';
            if (!box) {
                box = document.createElement('input');
                box.type = 'text';
            }
            if (!shell) {
                shell = box;
            }
            box.value = text;
            super(box, shell);

            const self = this;
            let value = null;

            function textChanged() {
                const oldValue = value;
                value = box.value === '' ? null : box.value;
                self.fireValueChanged(oldValue);
            }

            Object.defineProperty(this, 'textChanged', {
                enumerable: false,
                get: function () {
                    return textChanged;
                }
            });

            Object.defineProperty(this, 'text', {
                get: function () {
                    return box.value;
                },
                set: function (aValue) {
                    if (box.value !== aValue) {
                        box.value = aValue;
                        textChanged();
                    }
                }
            });

            Object.defineProperty(this, 'value', {
                get: function () {
                    return value;
                },
                set: function (aValue) {
                    const oldValue = value;
                    value = aValue !== undefined ? aValue : null;
                    box.value = value;
                    self.fireValueChanged(oldValue);
                }
            });
        }
    }

    class ModelField extends Field {
        constructor() {
            super(document.createElement('div'));
            Bound.call(this);
            Decorator.call(this);
        }
    }

    it('ModelField', (done) => {
        const data = new Proxy({
            path: new Proxy({
                name: 'Merilin'
            }, Managed.manageObject())
        }, Managed.manageObject());

        const widget = new ModelField();
        widget.nullable = true;
        widget.nullable = false;
        widget.onValueSelect = () => {
        };
        widget.onValueSelect = null;
        widget.data = data;
        widget.field = 'path.name';
        expect(widget.value).toEqual('Merilin');

        data.path.name += '_';
        expect(data.path.name).toEqual('Merilin_');
        expect(widget.value).toEqual('Merilin_');

        widget.onValueChange = () => {
        };
        widget.onValueChange = () => {
        };
        widget.value += '|';

        widget.addFocusHandler(() => {
        });
        widget.addFocusLostHandler(() => {
        });
        widget.focus();
        widget.blur();
        Utils.later(() => {
            expect(data.path.name).toEqual('Merilin_|');
            done();
        });
    });

    function expectContainer(container) {
        expectWidget(container);
        // Structure
        expect('count' in container).toBeTruthy();
        expect(container.add).toBeDefined();
        expect(typeof container.add).toEqual('function');
        expect(container.remove).toBeDefined();
        expect(typeof container.remove).toEqual('function');
        expect(container.clear).toBeDefined();
        expect(typeof container.clear).toEqual('function');
        expect(container.children).toBeDefined();
        expect(typeof container.children).toEqual('function');
        expect(container.child).toBeDefined();
        expect(typeof container.child).toEqual('function');
        expect('onAdd' in container).toBeTruthy();
        expectValue(container, 'onAdd', () => {
        });
        expect('onRemove' in container).toBeTruthy();
        expectValue(container, 'onRemove', () => {
        });
    }

    it('Container.Structure', () => {
        const container = new Container();
        expectContainer(container);
        expect(container.element).toBeDefined();

        const child0 = new Widget();
        const child1 = new Widget();
        const child2 = new Widget();
        container.add(child0);
        container.add(child1);
        container.add(child2);

        expect(container.count).toEqual(3);
        expect(container.child(0)).toEqual(child0);
        expect(container.child(1)).toEqual(child1);
        expect(container.child(2)).toEqual(child2);
        expect(container.children()).toEqual([child0, child1, child2]);
        expect(container.indexOf(child0)).toEqual(0);
        expect(container.indexOf(child1)).toEqual(1);
        expect(container.indexOf(child2)).toEqual(2);

        const removed0 = container.remove(0);
        expect(removed0).toBeDefined();
        const removed1 = container.remove(child1);
        expect(removed1).toBeDefined();

        container.clear();
        expect(container.count).toEqual(0);
        expect(container.child(0)).toEqual(null);
        expect(container.children()).toEqual([]);
        expect(container.indexOf(child0)).toEqual(-1);
        expect(container.indexOf(child1)).toEqual(-1);
        expect(container.indexOf(child2)).toEqual(-1);
    });

    it('Utils', (done) => {
        // Another menu fake
        Utils.startPopupSession({
            close: function () {
            }
        });
        expect(Utils.isPopupSession()).toBeTruthy();
        // Another menu fake
        Utils.startPopupSession({
            close: function () {
            }
        });
        expect(Utils.isPopupSession()).toBeTruthy();
        Utils.closePopupSession();
        Utils.closePopupSession();
        expect(Utils.isPopupSession()).toBeFalsy();
        const btn = document.createElement('button');
        document.body.appendChild(btn);
        let clicks = 0;
        const clickReg = Utils.on(btn, Utils.Events.CLICK, () => {
            clicks++;
        });
        btn.click();
        Utils.later(() => {
            expect(clicks).toEqual(1);
            clickReg.removeHandler();
            document.body.removeChild(btn);
            const fileField = Utils.selectFile(() => {
            }, '*.png');
            expect(fileField).toBeDefined();
            const colorField = Utils.selectColor(() => {
            }, '#ccc');
            expect(colorField).toBeDefined();
            const fileField2 = Utils.selectFile(() => {
            });
            expect(fileField2).toBeDefined();
            const colorField2 = Utils.selectColor(() => {
            });
            expect(colorField2).toBeDefined();
            done();
        });
    });
});
