# (pdfV) Pdf Book like Viewer

![demo gif](https://raw.githubusercontent.com/wladi0097/pdfV/master/demo/demo.gif)

### Tested and works with:

| Internet Explorer 	| Edge 	| Chrome 	| Firefox 	| Safari 	|
|-------------------	|------	|--------	|---------	|--------	|
| 11  (no animations)|  40   |   60   	|    55   	|   10   	|

### Demo:

##### [Click me](http://wladi0097.github.io/pdfV)

Using the ``demo/yes.pdf`` and ``demo/main.js``

## Basic feature list:

 * Load .pdf Files
 * Book like view
 * Preload Pages when needed
 * Works on the most used browsers
 * No jQuery
 * Not made with ES6 or new css features, that every browser can run it


## How does it work ?

1. Start a WebServer (like apache oder node.js) to avoid the "Cross Origin Problem"
1. Place the ``build/pdfV.js`` and the ``build/pdfV.worker.js`` into the same directory
1. Include the ``build/pdfV.js`` and the ``css/pdfV.min.css`` into your html
1. Create an element in your html
```html
<div id="pdfViewer"></div>
```
5. Get the dom element and run pdfV with the location to your pdf:

```javascript
var dom = document.getElementById('pdfViewer')

var myPage = pdfV.new({file: "./demo/yes.pdf", dom: dom})

myPage.on('pdfLoaded', function () {
  myPage.build();
})

/// OR ///

var dom = document.getElementById('pdfViewer')

var myPage = pdfV.new({file: "./demo/yes.pdf", dom: dom}, function(e) {})
```

6. Profit ?

## Options
The following Options can be used in ``pdfViewer.new(  OPTIONS  )``
```JSON
file: "",         // the location of your .pdf file
dom: domObj,      // the given dom object to load the whole pdfV in
preload: 2,       // how many pages should be loaded on activation  - DEFAULT: 3
```

## API

Create an instance:
```javascript
var dom = document.getElementById('pdfViewer')
var myPage = pdfV.new({file: "./demo/yes.pdf", dom: dom})
```

### Events
```javascript
// gets triggered after the pdf is loaded
// @Param {bool} res - conformation, true if all went ok
myPage.on('pdfLoaded', function(res) {});

// gets triggered after the dom elements have been created
// @Param {bool} res - conformation, true if all went ok
myPage.on('domCreated', function(res) {});

// gets triggered after the pdf page load
// @Param {int} res - the loaded page of the pdf
myPage.on('PageLoaded', function(res) {});
```

### Values
```javascript
// ! IMPORTANT ! you can access the pdf info only after load.
// Check 'How does it work ?' to see the usage
myPage.dom; // {domObj} Your Dom element
myPage.domCreated; // {bool} if dom is created
myPage.pagesLoaded; // {[int]} all loaded pages
```

### Methods
```javascript
myPage.isPdfLoaded(); // returns true if the pdf is loaded
myPage.isDomCreated(); // returns true if the dom is created

myPage.build(int); // runs myPage.createDom and myPage.firstLoadPages({int})
myPage.createDom(()=>{}); // only creates the dom elements

myPage.loadPage(int, ()=>{}) // load the {int} page of the pdf into its dom canvas
myPage.firstLoadPages(int); // loads all pages till {int} into its dom canvas

myPage.nextPage(); // shows next Page with an animation
myPage.previousPage(); // show previous Page with an animation
```

## Work on it
with``npm install`` you can get all the devtools needed.

I am using [Gulp](https://gulpjs.com/) to concat the ``.js`` files. Just run ``gulp`` to do this.  
If you just want to edit the ``pdfV.js``, then you can just run ``gulp js``.

The css is made with [SCSS](http://sass-lang.com/), you have to [compile](http://sass-lang.com/install) the ``.scss`` to get the ``.css`` File.  

Basically, do what you want.

---

### Made with:

 * [pdf.js](https://mozilla.github.io/pdf.js/) the Mozilla pdf worker

### License
* [MIT](https://github.com/wladi0097/pdfV/blob/origin/master/LICENSE)
