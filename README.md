elements.js
===========

Super fast and simple generic HTML element sorting and searching.

Usage
=====
Create an element.js object and sync it to a structure. The object can be re-synced at any time or additional instances can be created to work simultaneously.

```javascript
var ejs = elementsJS();

// sync elements.js to table
ejs.sync({
   containerId: 'id-of-tbody',
   elementType: 'tr',
   cellType: 'td'
});

// re-sync elements.js to list
ejs.sync({
   containerId: 'id-of-ul',
   elementType: 'li',
});

var ejsNew = elementsJS();

// sync elements.js to anything that has elements contained in something
ejsNew.sync({
   containerId: 'id-of-container',
   elementType: 'div', // or any element type that is within #id-of-container
   cellType: 'div' // optional if the element type also contains sub elements
});
```

Sort
----
To sort the synced structure, simply call:

```javascript
ejs.sort(false, 0);
```

where the first argument of the sort method indicates whether or not the sort should be numeric (true|false), and the optional second argument indicates which cell (starting from 0) to sort by for table like structures. For example, to sort the 2nd row of the following table using a numeric sort:
```html
<table>
   <thead>
      <tr>
         <th>string</th>
         <th>numeric</th>
      </tr>
   </thead>
   <tbody id="container">
      <tr>
         <td>one</td>
         <td>two</td>
         <td>three</td>
      </tr>
      <tr>
         <td>2</td>
         <td>1</td>
         <td>3</td>
      </tr>
   </tbody>
</table>
```

you would call `ejs.sort(true, 1);`. List style structures do not require the second argument, e.g., to sort the span elements:
```html
<div id="container">
   <span>one</span>
   <span>two</span>
   <span>three</span>
</div>
```
you would call `ejs.sort(false)`.
