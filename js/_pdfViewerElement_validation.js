var _pdfViewerElementValidation = {
  /*
   * gets this instace
   * @Needs pdfV element
   * @returns {obj} pdfViewerElement - this element
  */
  me: function() {
    var i = pdfV.pdfViewerElements.indexOf(this);
    return pdfV.pdfViewerElements[i];
  },

  // checks if the pdf is already in this object
  isPdfLoaded: function() {
    if (!this.pdf) {
      console.error('pdf not loaded yet');
      return false;
    }
    return true;
  },

  // checks if the pdf and the dom are already in this object.
  isDomCreated: function() {
    if (!this.pdf || !this.domCreated) {
      console.error('dom is not created');
      return false;
    }
    return true;
  },
};
