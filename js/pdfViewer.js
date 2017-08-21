var pdfViewer = {

  pdfViewerElements: [],


  /*
   * Creates an new pdfViewer
   * @Param {obj} init:
   *               {string} file - URL to the pdf document
   *               {domObj} dom - Dom of the Viewer
   *               {int} preload - how many pages to preload
  */
  new: function(init) {
    var _this = this;

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
    pdf.getPage(display).then(function (page) {

    //prepare canvas
    var scale = 1.5;
    var viewport = page.getViewport(scale);
    var canvas = document.getElementById(pdf.pdfInfo.fingerprint+'_'+ display);
    canvas.className = 'loaded';
    var context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;


     //append canvas
     var renderContext = { canvasContext: context, viewport: viewport };
     page.render(renderContext); });
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
   * @Param {obj} elems:
   *                {domObj} dom - the next two fields
   *                {domObj} dom2 - the next four fields
   *                {string} fingerprint - to find the pdf
  */
  lazyload: function(elems) {
    doms = [elems.dom, elems.dom2];
    for (var i = 0; i < 2; i++) {
      for (var k = 0; k < 2; k++) {
        var canvas = doms[i].children[k].children[0];
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
    console.log(e);
    if(pdfViewer.inputBlockedByAnimation)
      return
    path = e.currentTarget.parentNode

    pdfViewer.animatePage(path, false, function() {

      pdfViewer.lazyload({
        dom: path.previousSibling,
        dom2: path.previousSibling.previousSibling,
        fingerprint: path.parentNode.parentNode,
      })

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
    this.inputBlockedByAnimation = true;
    var animateDeg = (reverse) ? 180 : 0;
    var id = setInterval(frame, 2);

    var to = (reverse) ? 0 : 180;

    function frame() {
      if (animateDeg == to) {
          pdfViewer.inputBlockedByAnimation = false;
          clearInterval(id);
          callback = (callback === undefined) ? '': callback(true);
        } else {
          animateDeg += (reverse) ? -1 : 1;
          page.style.transform = "rotateY("+animateDeg+"deg)"
        }
    }

  }

}
