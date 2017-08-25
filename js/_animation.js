/*
 * places the z-index to the dom like its a book
 * Its a Firefox Fix
 * @Param {domObj} path - the page to fix
*/
pdfV.zIndexFix = function(path) {
  path.style.zIndex = '2';

  if (path.previousSibling) {
    path.previousSibling.style.zIndex = '0';
    if (path.previousSibling.previousSibling) {
      path.previousSibling.previousSibling.style.zIndex = '-1';
    }
  }

  if (path.nextSibling) {
    path.nextSibling.style.zIndex = '1';
    if (path.nextSibling.nextSibling) {
      path.nextSibling.nextSibling.style.zIndex = '-1';
    }
  }
};


/*
 * animate the page showing
 * @Param {domObj} page - the animated page
 *        {bool} reverse - reverses the animation
 * @returns {bool} callback - after completed
*/
pdfV.animatePage = function(page, reverse, callback) {
  // ie workaround
  if (this.iE) {
    this.animatePageIE(page, reverse);
    callback = (callback === undefined) ? '': callback(true);
    return;
  }
  this.inputBlockedByAnimation = true;
  var animateDeg = (reverse) ? -180 : 0;
  var id = setInterval(frame, 2);
  var to = (reverse) ? 0 : -180;
  /*
   * The single Frame of the animation
  */
  function frame() {
    if (animateDeg == to) {
        pdfV.inputBlockedByAnimation = false;
        clearInterval(id);
        callback = (callback === undefined) ? '': callback(true);
      } else {
        animateDeg += (reverse) ? 5 : -5;
        page.style.transform = 'rotateY('+animateDeg+'deg)';
      }
  }
};

/*
 * Animation workaround for ie
 * @Param {domObj} page - the animated page
 *        {bool} reverse - reverses the animation
*/
pdfV.animatePageIE = function(page, reverse) {
  if (reverse) {
    page.classList.remove('showIe');
  } else {
    page.classList.add('showIe');
  }
};
