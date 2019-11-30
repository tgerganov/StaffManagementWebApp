
//Creating the event object
function Event(sender) {
    this._sender = sender;
    this._listeners = [];
}

//Defining the two main functions for notifying and attaching listeners
Event.prototype = {
    attach: function (listener) {
        this._listeners.push(listener);
    },
    notify: function (args) {
        let index;

        for (index = 0; index < this._listeners.length; index += 1) {
            this._listeners[index](this._sender, args);
        }
    }
};