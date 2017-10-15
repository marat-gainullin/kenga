/* global expect */
/* global NaN */
import '../src/layout.css';
import '../src/theme.css';

import Id from 'septima-utils/id';
import Managed from 'septima-model/managed';
import Font from '../src/font';
import Color from '../src/color';
import Cursor from '../src/cursor';
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
    expect('left' in widget).toBeTruthy();
    expectValue(widget, 'left', 30);
    expect('width' in widget).toBeTruthy();
    expectValue(widget, 'width', 50);
    expect('top' in widget).toBeTruthy();
    expectValue(widget, 'top', 57);
    expect('height' in widget).toBeTruthy();
    expectValue(widget, 'height', 80);
    expect('enabled' in widget).toBeTruthy();
    expectValue(widget, 'enabled', true);
    expectValue(widget, 'enabled', false);
    expect('visible' in widget).toBeTruthy();
    expectValue(widget, 'visible', true);
    expectValue(widget, 'visible', false);
    expect('opaque' in widget).toBeTruthy();
    expectValue(widget, 'opaque', true);
    expectValue(widget, 'opaque', false);
    expect('cursor' in widget).toBeTruthy();
    expectValue(widget, 'cursor', Cursor.WAIT);
    expect('background' in widget).toBeTruthy();
    expectValue(widget, 'background', new Color('#fcfcfc'));
    expect('foreground' in widget).toBeTruthy();
    expectValue(widget, 'foreground', new Color(12, 45, 78, 35));
    expect('error' in widget).toBeTruthy();
    expectValue(widget, 'error', 'sample validation message');
    widget.error = null;
    expect('contextMenu' in widget).toBeTruthy();
    expectValue(widget, 'contextMenu', new widget.constructor());
    expect('toolTipText' in widget).toBeTruthy();
    expectValue(widget, 'toolTipText', ' sample tooltip');
    expect('focusable' in widget).toBeTruthy();
    expectValue(widget, 'focusable', true);
    expectValue(widget, 'focusable', false);
    expect('font' in widget).toBeDefined();
    expectValue(widget, 'font', new Font('Arial', Font.Style.ITALIC, 14));
    expect(widget.focus).toBeDefined();
    expect(typeof widget.focus).toEqual('function');
    widget.focus();

    expect('onShown' in widget).toBeTruthy();
    expectValue(widget, 'onShown', function () {});
    expect('onHidden' in widget).toBeTruthy();
    expectValue(widget, 'onHidden', function () {});
    expect('onMouseDragged' in widget).toBeTruthy();
    expectValue(widget, 'onMouseDragged', function () {});
    expect('onMouseReleased' in widget).toBeTruthy();
    expectValue(widget, 'onMouseReleased', function () {});
    expect('onFocusLost' in widget).toBeTruthy();
    expectValue(widget, 'onFocusLost', function () {});
    expect('onMousePressed' in widget).toBeTruthy();
    expectValue(widget, 'onMousePressed', function () {});
    expect('onMouseEntered' in widget).toBeTruthy();
    expectValue(widget, 'onMouseEntered', function () {});
    expect('onMouseMoved' in widget).toBeTruthy();
    expectValue(widget, 'onMouseMoved', function () {});
    expect('onActionPerformed' in widget).toBeTruthy();
    expectValue(widget, 'onActionPerformed', function () {});
    expect('onKeyReleased' in widget).toBeTruthy();
    expectValue(widget, 'onKeyReleased', function () {});
    expect('onKeyTyped' in widget).toBeTruthy();
    expectValue(widget, 'onKeyTyped', function () {});
    expect('onMouseWheelMoved' in widget).toBeTruthy();
    expectValue(widget, 'onMouseWheelMoved', function () {});
    expect('onFocusGained' in widget).toBeTruthy();
    expectValue(widget, 'onFocusGained', function () {});
    expect('onMouseClicked' in widget).toBeTruthy();
    expectValue(widget, 'onMouseClicked', function () {});
    expect('onMouseExited' in widget).toBeTruthy();
    expectValue(widget, 'onMouseExited', function () {});
    expect('onKeyPressed' in widget).toBeTruthy();
    expectValue(widget, 'onKeyPressed', function () {});
}

describe('Kenga Api', () => {
    it('Color Api', () => {
        const c1 = new Color('#ccc');
        expect(c1.red).toEqual(204);
        expect(c1.green).toEqual(204);
        expect(c1.blue).toEqual(204);
        expect(c1.alpha).toEqual(255);
        const c2 = new Color('rgb(12, 23, 34)');
        expect(c2.red).toEqual(12);
        expect(c2.green).toEqual(23);
        expect(c2.blue).toEqual(34);
        expect(c2.alpha).toEqual(255);
        const c22 = new Color(12, 23, 34);
        expect(c22.red).toEqual(12);
        expect(c22.green).toEqual(23);
        expect(c22.blue).toEqual(34);
        expect(c22.alpha).toEqual(255);
        const c3 = new Color('rgba(12, 23, 34, .5)');
        expect(c3.red).toEqual(12);
        expect(c3.green).toEqual(23);
        expect(c3.blue).toEqual(34);
        expect(c3.alpha).toEqual(127);
        const c33 = new Color(12, 23, 34, 45);
        expect(c33.red).toEqual(12);
        expect(c33.green).toEqual(23);
        expect(c33.blue).toEqual(34);
        expect(c33.alpha).toEqual(45);
    });
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
        const data = {
            path: {
                name: 'Merilin'
            }
        };
        Managed.listenable(data);
        Managed.listenable(data.path);
        let changes = 0;
        const listenReg = Bound.observePath(data, 'path.name', (evt) => {
            changes++;
        });
        data.path.name += '_';
        Managed.fire(data.path, {propertyName: 'name', oldValue: 'Merilin', newValue: 'Merilin_'});
        expect(changes).toEqual(1);
        listenReg.unlisten();
        data.path.name += '_';
        expect(changes).toEqual(1);
        Bound.setPathData(data, 'path.name', 'Jane');
        expect(data.path.name).toEqual('Jane');
        expect(Bound.getPathData(data, 'path.name')).toEqual('Jane');
    });
    it('Bound Api. Elements', () => {
        const data = {
            items: [
                {name: 'item1'},
                {name: 'item2'},
                {name: 'item3'}
            ]
        };
        Managed.listenable(data);
        Managed.listenable(data.items);
        data.items.forEach((item) => {
            Managed.listenable(item);
        });
        let changes = 0;
        const listenReg = Bound.observeElements(data.items, (evt) => {
            changes++;
        });
        data.items[1].name += '_';
        Managed.fire(data.items[1], {propertyName: 'name', oldValue: 'item2', newValue: 'item2_'});
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
});
