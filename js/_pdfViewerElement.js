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
    dom: init.dom,
  };

  // all parts of the obj
  var viewerElements = [
    _pdfViewerElementVariables,
    _pdfViewerElementEvents,
    _pdfViewerElementValidation,
    _pdfViewerElementBuilder,
    _pdfViewerElementNavigator,
  ];

  // concat all obj part together
  for (var i = 0; i < viewerElements.length; i++) {
    var obj2 = viewerElements[i];
    for (var k in obj2) {
      obj[k]= obj2[k];
    };
  }

  return obj;
};


/*
 * After the Pdfinfos are loaded, get them into the object
 * @Param {obj} obj - The pdfViewerElement
 *        {obj} obj - The loaded pdf object
*/
pdfV.pdfViewerElementsAddPdf = function(obj, pdf) {
  // pdf infos
  obj.pdf = pdf;
  obj.pdfInfo = pdf.pdfInfo;
  obj.fingerprint = pdf.pdfInfo.fingerprint;
  obj.numPages = pdf.pdfInfo.numPages;
};
