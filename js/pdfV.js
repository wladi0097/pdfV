var pdfViewer = {

  pdfViewerElements: [],
  iE: false,


  /*
   * Creates an new pdfViewer
   * @Param {obj} init:
   *               {string} file - URL to the pdf document
   *               {domObj} dom - Dom of the Viewer
   *               {int} preload - how many pages to preload
  */
  new: function(init) {
    var _this = this;
    this.iE = this.isIE()

    //first load the file
    this.loadPdfFile(init.file, function(pdf) {
      var pdfInfo = pdf.pdfInfo;

      // then append the canvas elements
      _this.buildElement({
        dom: init.dom,
        pdfInfo: pdfInfo,
      }, function() {

        // then bind events and load first pages
        _this.bindPageEvents()
        _this.firstLoad(pdf, init.preload)

        // save for later use
        _this.pdfViewerElements.push({
          pdf: pdf,
          fingerprint: pdfInfo.fingerprint,
        })

      })

    })
  },

  /*
   * Some features dont work in ie, so here is a test to disable them
   * @returns {Bool} isIE - True if user is IE
  */
  isIE: function() {
    userAgent = navigator.userAgent;
    return userAgent.indexOf("MSIE ") > -1 || userAgent.indexOf("Trident/") > -1;
  },


  /*
   * Build the whole HTML space
   * @Param {obj} build:
   *                {domObj} dom - the dom Obj to insert
   *                {obj} pdfInfo - info from the loaded PDF
   * @returns {bool} callback - is the html space ready
  */
  buildElement: function(build, callback) {
    var pages = build.pdfInfo.numPages;
    var fingerprint = build.pdfInfo.fingerprint;
    build.dom.className = 'pdfViewer pdfViewer_'+fingerprint;

    // the wrapper
    var wrapper = document.createElement("div");
    wrapper.className = "pdfViewerWrapper";
    build.dom.appendChild(wrapper)

    // the page Elements
    for (var i = 1; i < pages; i = i + 2) {
      var id = 'pdf_' + i;

      var elem = document.createElement("div");
      elem.className = "page pdfViewerPage";

      elem.innerHTML +=' \
        <div class="front"> \
          <canvas id="'+fingerprint+'_'+i+'"> </canvas>\
        </div> \
        <div class="back"> \
          <canvas id="'+fingerprint+'_'+ (i +1) +'"> </canvas>\
        </div> \ ';

      wrapper.insertBefore(elem, wrapper.firstChild);
    }
    // retrun callback after everything is done
    callback(true);
  },


  /*
   * Gets the PDF Object
   * @Param {string} file - the url to the pdf location
   * @returns {obj} callback - the pdf info as an object
  */
  loadPdfFile: function(file, callback) {
    PDFJS.getDocument(file).then(function(pdf) {
      callback(pdf)
    })
  },


  /*
   * Gets the PDF by fingerprint
   * @Param {string} fingerprint - the fingerprint of the pdf
   * @returns {obj} pdf - the wanted pdf
  */
  getPdfByFingerprint: function(fingerprint) {
    for (var i = 0; i < this.pdfViewerElements.length; i++) {
      if (this.pdfViewerElements[i].fingerprint === fingerprint) {
        return this.pdfViewerElements[i].pdf;
      }
    }
  },


  /*
   * loads number of pages inside the canvas
   * @Param {obj} pdf - the full pdf object grom load
   *        {int} display - which page to display
  */
  loadPdfIntoCanvas: function(pdf, display) {
    _this = this;
    if(display > pdf.pdfInfo.numPages)
      return
    pdf.getPage(display).then(function (page) {

      var canvas = document.getElementById(pdf.pdfInfo.fingerprint+'_'+ display);
      var renderContext = _this.prepareCanvas(canvas, page);
      page.render(renderContext);

    });
  },

  /*
   * prepares the Canvas or the page
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
   * Loads first pages of the pdf
   * @Param {obj} pdf - the full pdf obj
  */
  firstLoad: function(pdf, count) {
    count = (count !== undefined) ? count : 2
    for (var i = 1; i < count + 1; i++) {
      this.loadPdfIntoCanvas(pdf, i)
    }

  },


  /*
   * creates click Events on every page
  */
  bindPageEvents: function() {
    var front = document.getElementsByClassName('front');
    var back = document.getElementsByClassName('back');

    for (var i = 0; i < front.length; i++) {
      front[i].addEventListener('click', this.nextPage)
      back[i].addEventListener('click', this.previousPage)
    }
  },

  /*
   * Loads the Pages when its needed
   * @Param {domObj} elem - the next two fields
   *        {int} len - how many to load
  */
  lazyload: function(elem, len) {

    for (var i = 0; i < len; i++) {

      if(!elem.previousSibling)
        return;
      elem = elem.previousSibling

      for (var k = 0; k < 2; k++) {

        var canvas = elem.children[k].children[0];
        // if the page isnt loaded yet
        if (canvas.className !== 'loaded') {
          var splited = canvas.id.split('_');
          this.loadPdfIntoCanvas(this.getPdfByFingerprint(splited[0]),
            parseInt(splited[1]))
        };

      }
    }
  },

  inputBlockedByAnimation: false,
  /*
   * Show next page of instance
  */
  nextPage: function(e) {
    if(pdfViewer.inputBlockedByAnimation)
      return

    path = e.currentTarget.parentNode

    pdfViewer.animatePage(path, false, function() {

      // load next pages
      pdfViewer.lazyload(path, 2)

    });

    pdfViewer.zIndexFix(path);
  },


  /*
   * Show last page of instance
  */
  previousPage: function(e) {
    if(pdfViewer.inputBlockedByAnimation)
      return

    path = e.currentTarget.parentNode
    pdfViewer.animatePage(path, true);
    pdfViewer.zIndexFix(path);
  },


  /*
   * places the z-index to the dom like its a book
   * Its a Firefox Fix
   * @Param {domObj} path - the page to fix
  */
  zIndexFix: function(path) {
    path.style.zIndex = "2";

    if (path.previousSibling) {
      path.previousSibling.style.zIndex = "0";
      if(path.previousSibling.previousSibling) {
        path.previousSibling.previousSibling.style.zIndex = "-1";
      }
    }

    if (path.nextSibling) {
      path.nextSibling.style.zIndex = "1";
      if (path.nextSibling.nextSibling) {
        path.nextSibling.nextSibling.style.zIndex = "-1";
      }
    }
  },


  /*
   * animate the page showing
   * @Param {domObj} page - the animated page
   *        {bool} reverse - reverses the animation
   * @returns {bool} callback - after completed
  */
  animatePage: function(page, reverse, callback) {

    // ie workaround
    if (this.iE) {
      this.animatePageIE(page, reverse);
      callback = (callback === undefined) ? '': callback(true);
      return;
    }

    this.inputBlockedByAnimation = true;
    var animateDeg = (reverse) ? -180 : 0;
    var id = setInterval(frame, 2);
    var to = (reverse) ? 0 : -180;

    function frame() {
      if (animateDeg == to) {
          pdfViewer.inputBlockedByAnimation = false;
          clearInterval(id);
          callback = (callback === undefined) ? '': callback(true);
        } else {
          animateDeg += (reverse) ? 5 : -5;
          page.style.transform = "rotateY("+animateDeg+"deg)"
        }
    }

  },

  /*
   * Animation workaround for ie
   * @Param {domObj} page - the animated page
   *        {bool} reverse - reverses the animation
  */
  animatePageIE: function(page, reverse) {
    if (reverse) {
      page.classList.remove("showIe")

    } else {
      page.classList.add("showIe")
    }
  }

}
