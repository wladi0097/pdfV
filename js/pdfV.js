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
  new: function(init, build) {
    var _this = this;
    this.iE = this.isIE();

    // creates instace (see pdfViewerElements.js)
    this.pdfViewerElements.push(_this.pdfViewerElementsCreator(init));
    var obj = this.pdfViewerElements[_this.pdfViewerElements.length -1];
    // first load the file
    this.loadPdfFile(init.file, function(pdf) {
      // pass the pdf to the obj
      _this.pdfViewerElementsAddPdf(obj, pdf);
      obj.trigger('pdfLoaded', true);

      if (build && typeof build === 'function') {
        obj.build();
      }
    });

    return obj;
  },

  /*
   * Gets the PDF Object
   * @Param {string} file - the url to the pdf location
   * @returns {obj} callback - the pdf info as an object
  */
  loadPdfFile: function(file, callback) {
    PDFJS.getDocument(file).then(function(pdf) {
      callback(pdf);
    });
  },

  /*
   * Some features dont work in ie, so here is a test to disable them
   * @returns {Bool} isIE - True if user is IE
  */
  isIE: function() {
    userAgent = navigator.userAgent;
    return userAgent.indexOf('MSIE ') > -1 || userAgent.indexOf('Trident/') > -1;
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
};
