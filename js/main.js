document.addEventListener("DOMContentLoaded", function(event) {
  var dom = document.getElementById('pdfViewer')
  pdfViewer.new({file: "./yess.pdf", dom: dom})

  // var dom2 = document.getElementById('pdfViewer2')
  // pdfViewer.new({file: "./INNSIDE_Juni.pdf", dom: dom2})
  // 
  // var dom3 = document.getElementById('pdfViewer3')
  // pdfViewer.new({file: "./INNSIDE_Februar.pdf", dom: dom3})
})
