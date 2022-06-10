const addListenerName = '-septima-listener-add-func';
const removeListenerName = '-septima-listener-remove-func';

function listen(target, listener) {
    const addListener = target[addListenerName];
    if (addListener) {
        addListener(listener);
        return () => {
            target[removeListenerName](listener);
        };
    } else {
        return null;
    }
}

function getPathData(anElement, aPath) {
    if (anElement && aPath) {
        let target = anElement;
        const path = aPath.split('.');
        let propName = path[0];
        for (let i = 1; i < path.length; i++) {
            target = target[propName];
            if (!target) {
                propName = null;
                break;
            } else
                propName = path[i];
        }
        if (propName) {
            return target[propName];
        } else
            return null;
    } else
        return null;
}

function setPathData(anElement, aPath, aValue) {
    if (anElement && aPath) {
        let target = anElement;
        const path = aPath.split('.');
        let propName = path[0];
        for (let i = 1; i < path.length; i++) {
            target = target[propName];
            if (!target) {
                propName = null;
            } else {
                propName = path[i];
            }
        }
        if (propName) {
            target[propName] = aValue;
        }
    }
}

function observeElements(target, propListener) {
    function subscribe(aData, aListener) {
        const nHandler = listen(aData, aListener);
        if (nHandler) {
            return nHandler;
        }
        return null;
    }

    const subscribed = [];
    target.forEach(item => {
        const remover = subscribe(item, propListener);
        if (remover) {
            subscribed.push(remover);
        }
    });
    return {
        unlisten: function () {
            subscribed.forEach(aEntry => {
                aEntry();
            });
        }
    };
}

function observePath(target, path, propListener) {
    function subscribe(aData, aListener, aPropName) {
        const listenReg = listen(aData, {
            change: aChange => {
                if (!aPropName || aChange.propertyName === aPropName) {
                    aListener.change(aChange);
                }
            }
        });
        if (listenReg) {
            return listenReg;
        } else {
            return null;
        }
    }

    let subscribed = [];

    const pathRebinder = {
        change: evt => {
            subscribed.forEach(aEntry => {
                aEntry();
            });
            listenPath();
            const pathDatum = getPathData(target, path);
            propListener.change({
                source: target,
                propertyName: path,
                oldValue: pathDatum,
                newValue: pathDatum
            });
        }
    };

    function listenPath() {
        subscribed = [];
        let data = target;
        const pathItems = path.split('.');
        for (let i = 0; i < pathItems.length; i++) {
            const propName = pathItems[i];
            const listener = i === pathItems.length - 1 ? propListener : pathRebinder;
            const cookie = subscribe(data, listener, propName);
            if (cookie) {
                subscribed.push(cookie);
                if (data[propName])
                    data = data[propName];
                else
                    break;
            } else {
                break;
            }
        }
    }

    if (target) {
        listenPath();
    }
    return {
        unlisten: function () {
            subscribed.forEach(removeSubscriber => {
                removeSubscriber();
            });
        }
    };
}

function Bound() {
    const self = this;

    let data = null;
    let path = null;

    let settingToWidget = false;

    function toWidget(datum) {
        if (!settingToData) {
            settingToWidget = true;
            try {
                self.value = datum;
            } finally {
                settingToWidget = false;
            }
        }
    }

    var settingToData = false;

    function toData(datum) {
        if (!settingToWidget) {
            settingToData = true;
            try {
                setPathData(data, path, datum);
            } finally {
                settingToData = false;
            }
        }
    }

    this.addValueChangeHandler(evt => {
        toData(evt.newValue);
    });

    let boundReg = null;

    function unbind() {
        if (boundReg) {
            boundReg.unlisten();
            boundReg = null;
        }
    }

    function bind() {
        if (data && path) {
            boundReg = observePath(data, path, {
                change: evt => {
                    toWidget(evt.newValue);
                }
            });
            toWidget(getPathData(data, path));
        } else {
            self.value = null;
        }
    }

    function rebind() {
        unbind();
        bind();
    }

    Object.defineProperty(this, 'data', {
        get: function () {
            return data;
        },
        set: function (aValue) {
            if (data !== aValue) {
                data = aValue;
                rebind();
            }
        }
    });
    Object.defineProperty(this, 'field', {
        get: function () {
            return path;
        },
        set: function (aValue) {
            if (path !== aValue) {
                path = aValue;
                rebind();
            }
        }
    });
}

class PathComparator {
    constructor(path, ascending = true, caseSensitive = false) {
        Object.defineProperty(this, 'ascending', {
            get: function () {
                return ascending;
            }
        });

        function oCompare(od1, od2) {
            if (od1 == null && od2 == null)
                return 0;
            else if (od1 == null)
                return 1;
            else if (od2 == null)
                return -1;
            if (!caseSensitive) {
                if (typeof od1 === 'string')
                    od1 = od1.toLowerCase();
                if (typeof od2 === 'string')
                    od2 = od2.toLowerCase();
            }
            if (od1 === od2)
                return 0;
            else if (od1 > od2)
                return 1;
            else
                return -1;
        }

        function compare(o1, o2) {
            const oData1 = Bound.getPathData(o1, path);
            const oData2 = Bound.getPathData(o2, path);
            const res = oCompare(oData1, oData2);
            return ascending ? res : -res;
        }

        Object.defineProperty(this, 'compare', {
            get: function () {
                return compare;
            }
        });
    }
}


Object.defineProperty(Bound, 'PathComparator', {
    get: function () {
        return PathComparator;
    }
});
Object.defineProperty(Bound, 'observeElements', {
    get: function () {
        return observeElements;
    }
});
Object.defineProperty(Bound, 'listen', {
    get: function () {
        return listen;
    }
});
Object.defineProperty(Bound, 'getPathData', {
    get: function () {
        return getPathData;
    }
});
Object.defineProperty(Bound, 'setPathData', {
    get: function () {
        return setPathData;
    }
});
Object.defineProperty(Bound, 'observePath', {
    get: function () {
        return observePath;
    }
});
export default Bound;
