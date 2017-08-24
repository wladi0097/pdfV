/*
 * pdfViewerElement instance
 * Preparing the full object
 * The dev only interacts with this object
 * @Param {obj} init:
 *               {string} file - URL to the pdf document
 *               {domObj} dom - Dom of the Viewer
*/
pdfV.pdfViewerElementsCreator = function(init) {
  var obj = {
    //infos
    dom: init.dom,
    preload: 2,
    allowAnimations: true,
    menu: true,
    domCreated: false,
    pagesLoaded: [],
    inputBlockedByAnimation: false,

    /*
     * The Event Handler
     * possible Events:
     * .on('pdfLoaded', true) - after pdf got loaded
     * .on('domCreated', true) - after dom got appended
     * .on('PageLoaded', int) - after a page got loaded inside the canvas
    */
    eventCallbacks: {},
    on: function(eventName, callback, context){
      if(this.eventCallbacks[eventName])
          this.eventCallbacks[eventName].push(callback.bind(context));
      else
          this.eventCallbacks[eventName] = [callback.bind(context)];
    },
    trigger: function(eventName, data){
      for(var i=0; this.eventCallbacks[eventName] &&
          i < this.eventCallbacks[eventName].length; i++)
          this.eventCallbacks[eventName][i](data);
    },

    /*
     * gets this instace
     * @Needs pdfV element
     * @returns {obj} pdfViewerElement - this element
    */
    me: function() {
      var i = pdfV.pdfViewerElements.indexOf(this)
      return pdfV.pdfViewerElements[i]
    },

    // checks if the pdf is already in this object
    isPdfLoaded: function() {
      if(!this.pdf) {
        console.error("pdf not loaded yet");
        return false;
      }
      return true;
    },

    // checks if the pdf and the dom are already in this object.
    isDomCreated: function() {
      if(!this.pdf || !this.domCreated){
        console.error("dom is not created");
        return false;
      }
      return true;
    },

    /*
     * Creates the dom and appends the first pages
     * @Param {int} preload - how many pages should ne preloaded
     * @returns {obj} this - this instace
    */
    build: function(preload) {
      if (!this.isPdfLoaded)
        return false;

      preload = (!preload) ? this.preload : preload;

      var _this = this;
      this.createDom(function() {
        _this.firstLoadPages(preload)
      })
      return this;
    },

    /*
     * Builds a dom
     * @Needs pdfV element
     * @returns {bool} callback - if finished
    */
    createDom: function(callback) {
      if (!this.isPdfLoaded)
        return false;

      _this = this;
      pdfV.buildElement({dom: this.dom, pdfInfo: this.pdfInfo}, function() {
        pdfV.bindPageEvents()

        _this.trigger('domCreated', true)
        _this.domCreated = true;
        callback(true)
      })
    },

    /*
     * Loads a Page into the prepared canvas
     * @Param {int} number - which Page should be loaded
     * @returns {bool} callback - after completed
    */
    loadPage: function(number, callback) {
      if (!this.isDomCreated
         || number > this.numPages
         || this.pagesLoaded.indexOf(number) !== -1)
        return false;

      this.pagesLoaded.push(number)

      var _this = this;
      this.pdf.getPage(number).then(function (page) {

        var canvas = document.getElementById(_this.fingerprint+'_'+ number);
        var renderContext = _this.prepareCanvas(canvas, page);
        page.render(renderContext);

        _this.trigger('PageLoaded', number)
        callback = (callback === undefined) ? '': callback(true);

      })
    },

    /*
     * prepares the Canvas for the page
     * @Param {domObj} canvas - the canvas to prepare
     *        {obj} page - the pageto display
     * @returns {obj} renderContext:
     *                  canvasContext - the prepared canvas
     *                  viewport  - page viewport
    */
    prepareCanvas: function(canvas, page) {
      canvas.className = 'loaded';

      var viewport = page.getViewport(1.5);

      var context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      return { canvasContext: context, viewport: viewport }
    },

    /*
     * Loads all Pages from 1 to given @Param
     * @Param {int} to - to which page should it go
    */
    firstLoadPages: function(to) {
      for (var i = 1; i < to + 1; i++) {
        this.loadPage(i)
      }
    },

    lazyload: function() {
      // TODO: transfer from pdfV.js
    },

    nextPage: function() {
      // TODO: transfer from pdfV.js
    },

    previousPage: function() {
      // TODO: transfer from pdfV.js
    },

  }
  return obj;
}


/*
 * After the Pdfinfos are loaded, get them into the object
 * @Param {obj} obj - The pdfViewerElement
 *        {obj} obj - The loaded pdf object
*/
pdfV.pdfViewerElementsAddPdf = function(obj, pdf) {
  //pdf infos
  obj.pdf = pdf;
  obj.pdfInfo = pdf.pdfInfo;
  obj.fingerprint = pdf.pdfInfo.fingerprint;
  obj.numPages = pdf.pdfInfo.numPages;
}
