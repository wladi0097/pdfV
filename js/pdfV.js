/*
 * The main (pdfV)
 *  - _buildElements.js - The HTML Generator
 *  - _pdfViewerElement.js - A PDFV instance
*/

var pdfV = {

  pdfViewerElements: [],
  iE: false,


  /*
   * Creates an new pdfViewer
   * @Param {obj} init:
   *               {string} file - URL to the pdf document
   *               {domObj} dom - Dom of the Viewer
  */
  new: function(init) {
    var _this = this;
    this.iE = this.isIE()

    //creates instace (see pdfViewerElements.js)
    this.pdfViewerElements.push(_this.pdfViewerElementsCreator(init))
    var obj = this.pdfViewerElements[_this.pdfViewerElements.length -1]


    //first load the file
    this.loadPdfFile(init.file, function(pdf) {
      _this.pdfViewerElementsAddPdf(obj, pdf);
      obj.trigger('pdfLoaded', true);
    })

    return obj;
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
   * Some features dont work in ie, so here is a test to disable them
   * @returns {Bool} isIE - True if user is IE
  */
  isIE: function() {
    userAgent = navigator.userAgent;
    return userAgent.indexOf("MSIE ") > -1 || userAgent.indexOf("Trident/") > -1;
  },

  /*
   * Gets the PDF by fingerprint
   * @Param {string} fingerprint - the fingerprint of the pdf
   * @returns {obj} pdf - the wanted pdf
  */
  getPdfElementByFingerprint: function(fingerprint) {
    for (var i = 0; i < this.pdfViewerElements.length; i++) {
      if (this.pdfViewerElements[i].fingerprint === fingerprint) {
        return this.pdfViewerElements[i];
      }
    }
  },

  /*
   * creates click Events on every page
  */
  bindPageEvents: function() {
    var front = document.getElementsByClassName('pdfV_front');
    var back = document.getElementsByClassName('pdfV_back');

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
          this.getPdfElementByFingerprint(splited[0]).loadPage(parseInt(splited[1]))
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

    pdfV.animatePage(path, false, function() {

      // load next pages
      pdfV.lazyload(path, 2)

    });

    pdfV.zIndexFix(path);
  },


  /*
   * Show last page of instance
  */
  previousPage: function(e) {
    if(pdfV.inputBlockedByAnimation)
      return

    path = e.currentTarget.parentNode
    pdfV.animatePage(path, true);
    pdfV.zIndexFix(path);
  }

}
