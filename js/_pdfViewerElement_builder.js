var _pdfViewerElementBuilder = {
  /*
   * Creates the dom and appends the first pages
   * @Param {int} preload - how many pages should ne preloaded
   * @returns {obj} this - this instace
  */
  build: function(preload) {
    if (!this.isPdfLoaded || this.numPages <= 1) {
      console.error('pdf is not loaded or pdf has less then one page');
      return false;
    }
    preload = (!preload) ? this.preload : preload;
    this.createDom();
    this.firstLoadPages(preload);

    return this;
  },

  /*
   * Builds a dom
   * @Needs pdfV element
  */
  createDom: function() {
    if (!this.isPdfLoaded) {
      return false;
    }

    _this = this;
    this.buildElement();
    this.bindPageEvents();

    this.trigger('domCreated', true);
    this.domCreated = true;
  },

  /*
   * Loads a Page into the prepared canvas
   * @Param {int} number - which Page should be loaded
   * @returns {bool} callback - after completed
  */
  loadPage: function(number, callback) {
    if (!this.isDomCreated
       || number > this.numPages
       || number === 'blank'
       || this.pagesLoaded.indexOf(number) !== -1) {
         return false;
       }

    this.pagesLoaded.push(number);

    var _this = this;
    this.pdf.getPage(number).then(function(page) {
      var canvas = document.getElementById(_this.fingerprint+'_'+ number);
      var renderContext = _this.prepareCanvas(canvas, page);
      page.render(renderContext);

      _this.trigger('PageLoaded', number);
      callback = (callback === undefined) ? '': callback(true);
    });
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

    return {canvasContext: context, viewport: viewport};
  },

  /*
   * Loads all Pages from 1 to given @Param
   * @Param {int} to - to which page should it go
  */
  firstLoadPages: function(to) {
    for (var i = 1; i < to + 1; i++) {
      if (i >= this.numPages && i != 1) {
        continue;
      }
      this.loadPage(i);
    }
  },

  /*
   * Build the whole HTML space (only if it is more than one page)
  */
  buildElement: function() {
    // BUG: cannot display odd numberd pdfs
    var pages = this.numPages;
    var fingerprint = this.fingerprint;
    this.dom.className = 'pdfViewer pdfViewer_'+fingerprint;

    // the wrapper
    var wrapper = document.createElement('div');
    wrapper.className = 'pdfViewerWrapper';
    this.dom.appendChild(wrapper);
    // the page Elements
    for (var i = 1; i < pages; i = i + 2) {

      var elem = document.createElement('div');
      elem.className = 'page pdfViewerPage';

      elem.innerHTML +=' \
        <div class="pdfV_front"> \
          <canvas id="'+fingerprint+'_'+i+'"> </canvas>\
        </div> \
        <div class="pdfV_back"> \
          <canvas id="'+fingerprint+'_'+ (i +1) +'"> </canvas>\
        </div> \ ';

      wrapper.insertBefore(elem, wrapper.firstChild);
    }

    // if the pagenum is odd then insert a blank one
    if (pages % 2 !== 0) {
      var elem = document.createElement('div');
      elem.className = 'page pdfViewerPage';
      elem.innerHTML +=' \
        <div class="pdfV_front"> \
          <canvas id="'+fingerprint+'_'+i+'"> </canvas>\
        </div> \
        <div class="pdfV_back"> \
          <canvas id="'+fingerprint+'_blank"> </canvas>\
        </div> \ ';
      wrapper.insertBefore(elem, wrapper.firstChild);
    }
  },
};
