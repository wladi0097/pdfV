# (pdfV) Pdf Book like Viewer

![demo gif](https://raw.githubusercontent.com/wladi0097/pdfV/master/demo/demo.gif)

### Tested and works with:

| Internet Explorer 	| Edge 	| Chrome 	| Firefox 	| Safari 	|
|-------------------	|------	|--------	|---------	|--------	|
| 11  (no animations)|  40   |   60   	|    55   	|   10   	|

### Demo:

##### [Click me](http://wladi0097.github.io/pdfV)

using the ``demo/yes.pdf`` and ``demo/main.js``

## Basic feature list:

 * Load .pdf Files
 * Book like view
 * Preload Pages when needed
 * Works on the most used browsers
 * No jQuery


## How does it work ?

1. Start a WebServer (like apache oder node.js) to avoid the "Cross Origin Problem"
1. place the ``build/pdfV.js`` and the ``build/pdfV.worker.js`` into the same directory
1. include the ``build/pdfV.js`` and the ``css/pdfV.min.css`` into your html
1. create an element in your html
```html
<div id="pdfViewer"></div>
```
5. get the dom element and run pdfV with the location to your pdf:

```javascript
var dom = document.getElementById('pdfViewer')

var myPage = pdfV.new({file: "./demo/yes.pdf", dom: dom})

myPage.on('pdfLoaded', function () {
  myPage.build();
})
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
myPage.on('pdfLoaded', function(res) {
  // gets fired after the pdf is ready
  // ! IMPORTANT ! you can access the pdf info only after load.
  // Check "How does it work ?" to see the usage
});

myPage.on('domCreated', function(res) {
  // gets fired after the dom elements have been created
  // @Param {bool} res - conformation, True if all went ok
});

myPage.on('PageLoaded', function(res) {
  // gets fired after an pdf page load
  // @Param {int} res - the loaded page of the pdf
});
```

### Values
```javascript
myPage.dom; // {domObj} Your Dom element
myPage.domCreated; // {bool} if dom is created
myPage.pagesLoaded; // {[int]} all loaded pages
```

### Methods
```javascript
myPage.on(EventName, ()=>{}); // register an event

myPage.isPdfLoaded(); // returns true if the pdf is loaded
myPage.isDomCreated(); // returns true if the dom is created

myPage.build(int); // created the dom and append {int} pages
myPage.createDom(()=>{}); // only creates the dom
myPage.loadPage(int, ()=>{}) // load the {int} page of the pdf
myPage.firstLoadPages(int); // loads all pages till {int}
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
