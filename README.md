#Element Manager
**elman** is a fast and lightweight pure JavaScript module for generic HTML element sorting and searching. It does not impose any restrictions on how to mutate the controlled structure; instead, it efficiently monitors the structure for changes, allowing you to update it however you normally would (jQuery, document methods etc.).

##Usage
```javascript
npm install elman 
```

####List-like Structures
```javascript
var ElementManager = require('elman');
var elements = new ElementManager();

elements.sync({
   containerId: 'id-of-container', // e.g. id of ul
   elementType: 'li'               // any valid HTML selector
});
```

####Table-like Structures
```javascript
elements.sync({
   containerId: 'id-of-container', // e.g. id of tbody
   elementType: 'tr',              // any valid HTML selector
   cellType: 'td'                  // any valid HTML selector
});
```
Note: **elementType** and **cellType** should be relatively unique.

The **elements** object can be re-synced at any time by invoking the **sync** method again with the new structure's details.

###Sorting
```javascript
// default
elements.sort();

// specialised
elements.sort({
   numeric: true,  // defaults to string based sort
   cell: 1         // for table-like structures (column to sort by), defaults to 0
});
```

###Searching
```javascript
// search all cells
elements.search({
   term: searchTerm
});

// search specific cells
elements.search({
   term: searchTerm,
   cells: [1,3,5]
});

// clear search affects
elements.clearSearch();
```

###Mutating
After a value within the synced structure has been changed, simply call the `mutated()` method and **elman** will resync the values on the next `sort` or `search` invocation. Alternatively, you can set a threshold value to indicate the number of mutations that should occur before the structure is immediately resynchronised.

For example, assume you want to increment the `.click-count` cell in a table. The following would immidiately resync your **elman** object on the 10th incrementation (if neither `sort` or `search` were called in between).

```javascript
$('tr').click(function() {
   var rowClicks = $(this).find('.click-count'),
       currTotal = parseInt(rowClicks.text());

   rowClicks.text(currTotal + 1);

   elements.mutated({
      threshold: 10
   });
});
```

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
