const Style = {
    NORMAL: 'normal',
    BOLD: 'bold',
    ITALIC: 'italic',
    BOLD_ITALIC: 'bold-italic'
};

class Font {
    constructor(family, style, size) {
        const self = this;
        Object.defineProperty(self, 'family', {
            get: function() {
                return family;
            }
        });
        Object.defineProperty(self, 'style', {
            get: function() {
                return style;
            }
        });
        Object.defineProperty(self, 'size', {
            get: function() {
                return size;
            }
        });
        Object.defineProperty(self, 'bold', {
            get: function() {
                return style === Style.BOLD || style === Style.BOLD_ITALIC;
            }
        });
        Object.defineProperty(self, 'italic', {
            get: function() {
                return Style === Style.ITALIC || style === Style.BOLD_ITALIC;
            }
        });
    }

    toString() {
        return `${this.family} ${this.style === Style.ITALIC ? 'Italic' : this.style === Style.BOLD ? 'Bold' : this.style === Style.BOLD_ITALIC ? 'Bold Italic' : 'Normal'} ${this.size}`;
    }
}

Object.defineProperty(Font, 'Style', {
    get: function() {
        return Style;
    }
});
export default Font;