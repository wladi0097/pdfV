var _pdfViewerElementNavigator = {
  /*
   * returns the page dom by number
   * @Param {int} number - the page number
   * @returns {domObj} elem - The Page dom which holds rhe number
  */
  getPageDomByNum: function(number) {
    var elem = document.getElementById(this.fingerprint + '_' + number);
    return elem.parentNode.parentNode;
  },

  /*
   * binds click event on the pages for naviagtion
  */
  bindPageEvents: function() {
    var pages = this.dom.children[0].children;
    for (var i = 0; i < pages.length; i++) {
      pages[i].children[0].addEventListener('click', this.globalNextPage);
      pages[i].children[1].addEventListener('click', this.globalPreviousPage);
    }
  },

  /*
   * loads pages only if they are needed
   * @Param {domObj} elem - the Page dom
   *        {domObj} len - how many pages should be loaded
  */
  lazyload: function(elem, len) {
    for (var i = 0; i < len; i++) {
      if (!elem.previousSibling) {
        return;
      }
      elem = elem.previousSibling;
      for (var k = 0; k < 2; k++) {
        var canvas = elem.children[k].children[0];
        // if the page isnt loaded yet
        if (canvas.className !== 'loaded') {
          var splited = canvas.id.split('_');
          this.loadPage(parseInt(splited[1]));
        };
      }
    }
  },

  /*
   * Global Events, because you cant access them with "this"
  */
  globalNextPage: function(e) {
    var fingerprint = e.currentTarget.children[0].id.split('_')[0];
    pdfV.getPdfElementByFingerprint(fingerprint).nextPage();
  },

  globalPreviousPage: function(e) {
    var fingerprint = e.currentTarget.children[0].id.split('_')[0];
    pdfV.getPdfElementByFingerprint(fingerprint).previousPage();
  },

  /*
   * navigates to the next page
  */
  nextPage: function() {
    if (this.inputBlockedByAnimation) {
      return;
    }
    path = this.getPageDomByNum(this.currentPage);

    // up the currentPage
    if (this.currentPage <= this.numPages -2) {
        this.currentPage += 2;
    } else if (this.currentPage <= this.numPages -1) {
      this.currentPage += 1;
    }

    _this = this;
    pdfV.animatePage(path, false, function() {
      // load next pages
      _this.lazyload(path, 2);
    });

    pdfV.zIndexFix(path);
  },

  /*
   * Navigates to the previous page
  */
  previousPage: function() {
    if (pdfViewer.inputBlockedByAnimation) {
      return;
    }

    // down the currentPage
    if (this.currentPage % 2 == 0) {
      this.currentPage -= 1;
    } else if (this.currentPage > 1) {
        this.currentPage -= 2;
    }

    path = this.getPageDomByNum(this.currentPage);
    pdfV.animatePage(path, true);
    pdfV.zIndexFix(path);
  },
};
