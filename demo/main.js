document.addEventListener("DOMContentLoaded", function(event) {
  var dom = document.getElementById('pdfViewer')
  pdfViewer.new({file: "./yes.pdf", dom: dom, preload: 10})
})
