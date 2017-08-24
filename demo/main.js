document.addEventListener("DOMContentLoaded", function(event) {
  var dom = document.getElementById('pdfViewer')

  var myPage = pdfV.new({file: "./demo/yes.pdf", dom: dom, preload: 10})

  myPage.on('pdfLoaded', function () {
    myPage.build();
  })

})
