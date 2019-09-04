# Kenga
Kenga is an ultra lightweight visual widgets library for a browser.
It uses only morden approaches to layout handling, input widgets building.

It contains no layout resize code, uses HTML5 inputs, etc.
It is written solely in ES6.

There is a WYSIWYG editor of kenga views, composed of kenga widgets itself - [Winnie](https://github.com/marat-gainullin/winnie).

You can try [KengaJS Designer Demo](http://kengajs.com/demo/winnie.html)

## Install
To install `kenga` package to your project, type the following command:
```
npm install kenga --save
```

## Using
To use kenga widgets, install and use one of the following packages:
- `kenga-containers`
- `kenga-labels`
- `kenga-buttons`
- `kenga-model-buttons`
- `kenga-fields`
- `kenga-model-fields`
- `kenga-menu`
- `kenga-window`
- `kenga-grid`

or implement your own awesome widget.

After widget is ready, you can write something like this:
```
const w = new MyAwesome(); document.body.appendChild(w.element);
```

## Architecture
Widget is a JavaScript class. It incapsulates a DOM element, and its layout rules. Layout rules are implmemented as pure CSS3 rules.

This package contains base classes for widgets:
* `Widget` base class for all widgets. It contains `parent` and `element` properties, simple events handling, etc.
* `Container` base class for container widgets. It supports container contract, i.e. methods `add`, `remove`, `count`, `child(index)`, `children`.
* `BoxField` base class for input widgets. It can be used as a core of decorated input widget.
* `Bound` mixin, that implements two way data binding for any widget. Se how it is used in package `kenga-model-buttons` and `kenga-model-fields`.
* `Decorator` mixin, that adds decorations to a widget, that allow a user to clear a widget's value and select a value with custom value selection dialog.

