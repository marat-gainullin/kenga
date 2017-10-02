import Event from '../event';

class ItemEvent extends Event {
    constructor(source, item) {
        super(source, item);

        Object.defineProperty(this, 'item', {
            get: function() {
                return item;
            }
        });
    }
}

export default ItemEvent;