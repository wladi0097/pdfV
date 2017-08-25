var _pdfViewerElementEvents = {
  /*
   * The Event Handler
   * possible Events:
   * .on('pdfLoaded', true) - after pdf got loaded
   * .on('domCreated', true) - after dom got appended
   * .on('PageLoaded', int) - after a page got loaded inside the canvas
  */
  eventCallbacks: {},
  on: function(eventName, callback, context) {
    if (this.eventCallbacks[eventName]) {
        this.eventCallbacks[eventName].push(callback.bind(context));
    } else {
        this.eventCallbacks[eventName] = [callback.bind(context)];
    }
  },
  trigger: function(eventName, data) {
    for (var i=0; this.eventCallbacks[eventName] &&
        i < this.eventCallbacks[eventName].length; i++) {
        this.eventCallbacks[eventName][i](data);
      }
  },
};
