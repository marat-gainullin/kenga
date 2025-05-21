import Ui from 'kenga/utils';

class Popup {
    constructor(element) {
        const self = this;

        this.element = element;
        this.element.classList.add('p-popup');
        this.element.id = `p-${Ui.next()}`;

        const gapsStyle = document.createElement('style');
        gapsStyle.innerHTML =
                `
                div#${self.element.id} > .p-widget {display: block;}
                div#${self.element.id} > .p-tabs {display: flex;}
                div#${self.element.id} > .p-holy-grail-column {display: flex;}
                div#${self.element.id} > .p-box-vertical {display: flex;}
                `;
        this.element.appendChild(gapsStyle);

        function showRelativeTo(anElement, horizontal = false, leftToRight = true, topToBottom = true) {
            if (!self.element.parentElement) {
                const targetTop = Ui.absoluteTop(anElement);
                const targetLeft = Ui.absoluteLeft(anElement);

                function tryToPlace(ltr, ttb) {
                  self.element.style.left = ''
                  self.element.style.right = ''
                  self.element.style.top = ''
                  self.element.style.bottom = ''
                  self.element.style.overflowY = ''
                  if (horizontal) {
                      self.element.classList.remove('p-popup-horizontal-rel');
                      self.element.classList.add('p-popup-vertical-rel');
                      if (ttb) {
                          self.element.style.top = `${targetTop}px`;
                      } else {
                          self.element.style.bottom = `${document.body.clientHeight - targetTop - anElement.offsetHeight}px`;
                      }
                      if (ltr) {
                          self.element.style.left = `${targetLeft + anElement.offsetWidth}px`;
                      } else {
                          self.element.style.right = `${document.body.clientWidth - targetLeft}px`;
                      }
                  } else {
                      self.element.classList.remove('p-popup-vertical-rel');
                      self.element.classList.add('p-popup-horizontal-rel');
                      if (ttb) {
                          self.element.style.top = `${targetTop + anElement.offsetHeight}px`;
                      } else {
                          self.element.style.bottom = `${document.body.clientHeight - targetTop}px`;
                      }
                      if (ltr) {
                          self.element.style.left = `${targetLeft}px`;
                      } else {
                          self.element.style.right = `${document.body.clientWidth - targetLeft - anElement.offsetWidth}px`;
                      }
                  }
                }
                document.body.appendChild(self.element);

                tryToPlace(leftToRight, topToBottom);
                const verticalOverflow1 = Math.max(0, (self.element.offsetTop + self.element.offsetHeight) - document.body.clientHeight)
                const verticalUnderflow1 = Math.max(0, -self.element.offsetTop)
                const verticalOverUnderFlow1 = verticalOverflow1 + verticalUnderflow1
                let verticalOverUnderFlow2 = 0
                if (verticalOverUnderFlow1 > 0) {
                    tryToPlace(leftToRight, !topToBottom);
                    const verticalOverflow2 = Math.max(0, (self.element.offsetTop + self.element.offsetHeight) - document.body.clientHeight)
                    const verticalUnderflow2 = Math.max(0, -self.element.offsetTop)
                    verticalOverUnderFlow2 = verticalOverflow2 + verticalUnderflow2
                    if (verticalOverUnderFlow2 < verticalOverUnderFlow1) {
                        topToBottom = !topToBottom
                    }
                }

                if (leftToRight) {
                    const horizontalOverflow = (self.element.offsetLeft + self.element.offsetWidth) - document.body.clientWidth
                    if (horizontalOverflow > 0) {
                        leftToRight = !leftToRight;
                    }
                } else {
                    const horizontalUnderflow = -self.element.offsetLeft
                    if (horizontalUnderflow > 0) {
                        leftToRight = !leftToRight;
                    }
                }

                tryToPlace(leftToRight, topToBottom);

                if (verticalOverUnderFlow1 > 0 && verticalOverUnderFlow2 > 0) {
                    if (topToBottom) {
                        self.element.style.bottom = '0px'
                    } else {
                        self.element.style.top = '0px'
                    }
                    self.element.style.overflowY = 'auto'
                }
                fireShown()
            }
        }
        Object.defineProperty(this, 'showRelativeTo', {
            get: function () {
                return showRelativeTo;
            }
        });

        function popupRelativeTo(anElement, horizontal = true, ltr = true, ttb = true) {
            Ui.startPopupSession(self);
            showRelativeTo(anElement, horizontal, ltr, ttb);
        }
        Object.defineProperty(this, 'popupRelativeTo', {
            get: function () {
                return popupRelativeTo;
            }
        });

        function showAt(left, top) {
            self.element.classList.remove('p-popup-horizontal-rel');
            self.element.classList.remove('p-popup-vertical-rel');
            self.element.style.top = `${top}px`;
            self.element.style.left = `${left}px`;
            if (!self.element.parentElement) {
              document.body.appendChild(self.element);
            }
            if (left + self.element.offsetWidth > window.innerWidth) {
                self.element.style.left = `${left - self.element.offsetWidth}px`;
            }
            if (top + self.element.offsetHeight > window.innerHeight) {
                self.element.style.top = `${top - self.element.offsetHeight}px`;
            }
            fireShown()
        }
        Object.defineProperty(this, 'showAt', {
            get: function () {
                return showAt;
            }
        });

        function popupAt(left, top) {
            Ui.startPopupSession(self);
            showAt(left, top);
        }
        Object.defineProperty(this, 'popupAt', {
            get: function () {
                return popupAt;
            }
        });

        Object.defineProperty(this, 'shown', {
            get: function () {
                return !!self.element.parentElement;
            }
        });

        function close() {
            if (self.element.parentElement) {
                self.element.parentElement.removeChild(self.element);
                fireHidden()
            }
        }
        Object.defineProperty(this, 'close', {
            get: function () {
                return close;
            }
        });

        function fireShown() {
            showHandlers.forEach(h => {
                Ui.later(() => {
                    h();
                });
            });
        }

        function fireHidden() {
            hideHandlers.forEach(h => {
                Ui.later(() => {
                    h();
                });
            });
        }

        const hideHandlers = new Set();

        function addHideHandler(handler) {
            hideHandlers.add(handler);
            return {
                removeHandler: function () {
                    hideHandlers.delete(handler);
                }
            };
        }

        const showHandlers = new Set();

        function addShowHandler(handler) {
            showHandlers.add(handler);
            return {
                removeHandler: function () {
                    showHandlers.delete(handler);
                }
            };
        }

        Object.defineProperty(this, 'addHideHandler', {
            get: function () {
                return addHideHandler;
            }
        });
        Object.defineProperty(this, 'addShowHandler', {
            get: function () {
                return addShowHandler;
            }
        });

        let onShow;
        let showReg;
        Object.defineProperty(this, 'onShow', {
            get: function () {
                return onShow;
            },
            set: function (aValue) {
                if (onShow !== aValue) {
                    if (showReg) {
                        showReg.removeHandler();
                        showReg = null;
                    }
                    onShow = aValue;
                    if (onShow) {
                        showReg = addShowHandler(() => {
                            if (onShow) {
                                onShow();
                            }
                        });
                    }
                }
            }
        });
        let onHide;
        let hideReg;
        Object.defineProperty(this, 'onHide', {
            get: function () {
                return onHide;
            },
            set: function (aValue) {
                if (onHide !== aValue) {
                    if (hideReg) {
                        hideReg.removeHandler();
                        hideReg = null;
                    }
                    onHide = aValue;
                    if (onHide) {
                        hideReg = addHideHandler(() => {
                            if (onHide) {
                                onHide();
                            }
                        });
                    }
                }
            }
        });
    }
}

export default Popup;
