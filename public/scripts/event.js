// reference: https://medium.com/@soffritti.pierfrancesco/create-a-simple-event-bus-in-javascript-8aa0370b3969

/*
 * Constructor for an event bus 
 * two public functions publish and subscribe
 */
function EventBus() {
    var events = []; // private variable

    // public functions
    EventBus.prototype.subscribe = subscribe;
    EventBus.prototype.publish = publish;

    /*
     * Triggers the callbacks for the given event
     * @param eventType (string): event to trigger
     * @param args (array): arguments to pass to callbacks
     */
    function publish(eventType, args) {
        event = findEvent(eventType);
        if (!event) {
            console.log("Event '" + eventType + "' has no subscribers!");
            return;
        }
        event.callbacks.forEach(executeCallback);

        /*
         * executes the specified callback uses the provided arguments
         * @param callback (function): callback to execute
         */
        function executeCallback(callback) {
            callback(args);
        }
    }

    /* 
     * subscribes the callback to the given event
     * adds a new event to event bus if doesn't exist
     * @param eventType (string): event to subscribe to
     * @param callback function to subscribe to specified event
     */
    function subscribe(eventType, callback) {
        event = findEvent(eventType);
        if (event == undefined) {
            event = new Event(eventType);
            events.push(event);
        }
        event.addCallback(callback);
    }

    /*
     * Searches for the specified event in the EventBus
     * returns undefined if not found
     * @param eventType (string): event to find
     */
    function findEvent(eventType) {
        // console.log(events);
        return events.find(search);

        function search(element) {
            return element.type == eventType;
        }
    }

    /*
     * Constructor for a new event
     * @param eventType (string): the type of event
     */
    function Event(eventType) {
        this.type = eventType;
        this.callbacks = [];
        this.addCallback = addCallback;

        /*
         * adds a callback function to the event
         * @param callback (function): callback to add
         */
        function addCallback(callback) {
            this.callbacks.push(callback);
        }
    }
}
