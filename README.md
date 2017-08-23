# (pdfV) Pdf Book like Viewer

### Tested and works with:

| Internet Explorer 	| Edge 	| Chrome 	| Firefox 	| Safari 	|
|-------------------	|------	|--------	|---------	|--------	|
| 11  (no animations)	|  40 √ |   60 √ 	|    55 √  	|   10 √ 	|

### Demo:

##### [Click me](http://wladi0097.github.io/pdfV)

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

 pdfViewer.new({
 	file: "./yes.pdf",
 	dom: dom,
 })
```

6. Profit ?

## Options
The folloing Options can be used in ``pdfViewer.new(  OPTIONS  )``
```JSON
file: "",         // the location of your .pdf file
dom: domObj,      // the given dom object to load the whole pdfV in
preload: 2,       // how many pages should be loaded on activation  - DEFAULT: 3
```

## Work on it
I am using [Gulp](https://gulpjs.com/) to concat the ``.js`` files. Just run ``gulp`` to do this.  
If you just want to edit the ``pdfV.js``, then you can just run ``gulp js``.

The css is made with [SCSS](http://sass-lang.com/), you have to [compile](http://sass-lang.com/install) the ``.scss`` to get the ``.css`` File.  

Basically, do what you want.

---

### Made with:

 * [pdf.js](https://mozilla.github.io/pdf.js/) the Mozilla pdf worker

### License
* [MIT](https://github.com/wladi0097/pdfV/blob/origin/master/LICENSE)
