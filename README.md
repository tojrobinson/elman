#elements.js

Super fast and simple generic HTML element sorting and searching.

##Usage
Create an **element.js** object and sync it to a structure.

```javascript
var elements = elementsJS();

// for list like structures
elements.sync({
   containerId: 'id-of-container', // e.g. id of ul
   elementType: 'li'               // any valid HTML selector
});

// for table like structure
elements.sync({
   containerId: 'id-of-container', // e.g. id of tbody
   elementType: 'tr',              // any valid HTML selector
   cellType: 'td'                  // any valid HTML selector
});
```
Note: **elementType** and **cellType** should be relatively unique.

The **elements.js** object can be re-synced at any time by invoking the **sync** method again with the new structure's details. Additional instances of **elements.js** can be created by calling `elementsJS()` again.

###Sorting
To sort the synced structure, simply call the `elements.sort()` method. You can specify whether the sort should be numeric or text based as well as which field to sort by for table like structures by supplying the method with an options object. For example, to sort a table by its second column using a numeric sort, you would invoke the sort method as follows:
```html
<table>
   <thead>
      <tr>
        <th>string</th>
         <th>numeric</th>
      </tr>
   </thead>
   <tbody id="container">
      <tr class="sort-element"> <!-- optional class identifier. can select on tr if preffered -->
         <td>one</td>
         <td>8</td>
      </tr>
      <tr class="sort-element">
         <td>two</td>
         <td>42</td>
      </tr>
      <tr class="sort-element">
         <td>three</td>
         <td>6</td>
      </tr>
   </tbody>
</table>

<script>
   var elements = elementsJS();
    
   elements.sync({
      containerId: 'container',
      elementType: '.sort-element',
      cellType: 'td'
   });
   
   // sort
   elements.sort({
      numeric: true,
      field: 1
   });
</script>
```
List like structures do not require a field parameter, e.g., to sort the span elements using the default text based strategy:
```html
<div id="container">
   <span>one</span>
   <span>two</span>
   <span>three</span>
</div>
```
you could call `elements.sort()`.

## More Examples
example links
##License
The MIT License (MIT)

Copyright (c) 2014 Tully Robinson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
