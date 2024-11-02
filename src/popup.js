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
                  if (horizontal) {
                      self.element.classList.remove('p-popup-horizontal-rel');
                      self.element.classList.add('p-popup-vertical-rel');
                      if (ttb) {
                          self.element.style.top = `${targetTop}px`;
                          self.element.style.bottom = ''
                      } else {
                          self.element.style.top = '';
                          self.element.style.bottom = `${document.body.clientHeight - targetTop - anElement.offsetHeight}px`;
                      }
                      if (ltr) {
                          self.element.style.left = `${targetLeft + anElement.offsetWidth}px`;
                          self.element.style.right = '';
                      } else {
                          self.element.style.left = '';
                          self.element.style.right = `${document.body.clientWidth - targetLeft}px`;
                      }
                  } else {
                      self.element.classList.remove('p-popup-vertical-rel');
                      self.element.classList.add('p-popup-horizontal-rel');
                      if (ttb) {
                          self.element.style.top = `${targetTop + anElement.offsetHeight}px`;
                          self.element.style.bottom = ''
                      } else {
                          self.element.style.top = '';
                          self.element.style.bottom = `${document.body.clientHeight - targetTop}px`;
                      }
                      if (ltr) {
                          self.element.style.left = `${targetLeft}px`;
                          self.element.style.right = '';
                      } else {
                          self.element.style.left = '';
                          self.element.style.right = `${document.body.clientWidth - targetLeft - anElement.offsetWidth}px`;
                      }
                  }
                }
                tryToPlace(leftToRight, topToBottom)
                document.body.appendChild(self.element);
                if (topToBottom) {
                  if (self.element.offsetTop + self.element.offsetHeight > document.body.clientHeight) {
                    topToBottom = !topToBottom
                  }
                } else {
                  if (self.element.offsetTop < 0) {
                    topToBottom = !topToBottom
                  }
                }
                if (leftToRight) {
                  if (self.element.offsetLeft + self.element.offsetWidth > document.body.clientWidth) {
                    leftToRight = !leftToRight
                  }
                } else {
                  if (self.element.offsetLeft < 0) {
                    leftToRight = !leftToRight
                  }
                }
                tryToPlace(leftToRight, topToBottom)
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
            }
        }
        Object.defineProperty(this, 'close', {
            get: function () {
                return close;
            }
        });
    }
}

export default Popup;
