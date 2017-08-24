/*
 * Build the whole HTML space
 * @Param {obj} build:
 *                {domObj} dom - the dom Obj to insert
 *                {obj} pdfInfo - info from the loaded PDF
 * @returns {bool} callback - is the html space ready
*/
pdfV.buildElement = function(build, callback) {
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
      <div class="pdfV_front"> \
        <canvas id="'+fingerprint+'_'+i+'"> </canvas>\
      </div> \
      <div class="pdfV_back"> \
        <canvas id="'+fingerprint+'_'+ (i +1) +'"> </canvas>\
      </div> \ ';

    wrapper.insertBefore(elem, wrapper.firstChild);
  }
  // retrun callback after everything is done
  callback(true);
}
