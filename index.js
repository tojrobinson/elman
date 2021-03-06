'use strict';

module.exports = ElementManager;

function ElementManager() {
   if (!(this instanceof ElementManager))
      return new ElementManager();

   this.container = null;
   this.elementType = null;
   this.cellType = null;
   this.sortState = null;
   this.mutations = 0;
   this.elements = [];
   this.sortList = [];
}

function hideAll() {
   for (var i = 0; i < this.elements.length; ++i) {
      this.elements[i].obj.style.display = 'none';
   }
}

function resyncElements() {
   // this.elements.length = 0;
   this.elements = [];
   this.sortState.buildList = true;
   this.mutations = 0;

   var elements = this.container.querySelectorAll(this.elementType),
       currElement,
       cells,
       values;

   for (var i = 0; i < elements.length; ++i) {
      currElement = elements[i];

      if (!this.cellType) {
         values = [currElement.innerText || currElement.textContent || ''];
      } else {
         values = [];
         cells = currElement.querySelectorAll(this.cellType);
         for (var j = 0; j < cells.length; ++j) {
            values.push(cells[j].innerText || cells[j].textContent || '');
         }
      }

      this.elements.push({
         obj: elements[i],
         values: values,
         visible: true
      });
   }
}

ElementManager.prototype.clear = function() {
   if (this.container && this.container.childNodes.length) {
      while (this.container.childNodes.length > 0) {
         this.container.removeChild(this.container.firstChild);
      }
   }
}

ElementManager.prototype.sync = function(opt) {
   opt = opt || {};
   if (!opt.containerId || !opt.elementType) {
      throw new Error('[elman] must specify containerId and elementType');
   } else if (opt.elementType === opt.cellType) {
      throw new Error('[elman] elementType and cellType must be unique');
   }

   // TODO
   // if future:
   //    add mutation object
   this.container = document.getElementById(opt.containerId);
   this.elementType = opt.elementType;
   this.cellType = opt.cellType;
   this.sortState = {focusCell: null, order: -1, buildList: true};
   this.mutations = 0;
   this.elements = [];
   this.sortList = [];

   var elements = this.container.querySelectorAll(opt.elementType),
       currElement,
       cells,
       values;

   for (var i = 0; i < elements.length; ++i) {
      currElement = elements[i];

      if (!this.cellType) {
         values = [currElement.innerText || currElement.textContent || ''];
      } else {
         values = [];
         cells = currElement.querySelectorAll(this.cellType);
         for (var j = 0; j < cells.length; ++j) {
            values.push(cells[j].innerText || cells[j].textContent || '');
         }
      }

      this.elements.push({
         obj: elements[i],
         values: values,
         visible: true
      });
   }
}

ElementManager.prototype.mutated = function(opt) {
   opt = opt || {};
   ++this.mutations;
   // resync now else on next sort/search
   if ((opt.threshold > 0) && (this.mutations >= opt.threshold)) {
      resyncElements.call(this);
   }
}

ElementManager.prototype.sort = function(opt) {
   opt = opt || {};
   var cell = opt.cell || 0,
       order,
       i, 
       len;

   if (this.elements.length) {
      if (cell < 0 || cell >= this.elements[0].values.length) {
         throw new Error('[elements.js] Invalid sort cell.');
      }
   }

   // check for unsynced mutations
   if (this.mutations) {
      resyncElements.call(this);
   }

   if (this.sortState.buildList || (this.sortState.focusCell !== cell)) {
      this.sortState.focusCell = cell;
      this.sortState.buildList = false;
      this.sortList = [];
      for (i = 0; i < this.elements.length; ++i) {
         // only sort visible
         if (this.elements[i].visible) {
            this.sortList.push(this.elements[i]);
         }
      }
   }

   order = this.sortState.order *= -1;

   this.sortList.sort(function(a, b) {
      a = a.values[cell];
      b = b.values[cell];
      if (opt.numeric || false) {
         return (b - a)*order;
      } else {
         return a.localeCompare(b)*order;
      }
   }); 

   for (i = 0, len = this.sortList.length; i < len; ++i) {
      this.container.appendChild(this.sortList[i].obj);
   }
}

ElementManager.prototype.search = function(opt) {
   opt = opt || {};
   var pattern = new RegExp(opt.term.replace(/[$^*+?.-\/\\|()[\]{}]/g, '\\$&'), 'i'),
       currElement,
       allCells,
       cells,
       i,
       len;

   // check for unsynced mutations
   if (this.mutations) {
      resyncElements.call(this);
   }

   // notify sort
   this.sortState.buildList = true;

   for (i = 0, len = this.elements.length; i < len; ++i) {
      currElement = this.elements[i];
      currElement.visible = false;
      if (opt.cells) {
         var toSearch = '';

         opt.cells.forEach(function(cell) {
            toSearch += currElement.values[cell];
         });

         if(toSearch.match(pattern)) {
            this.elements[i].visible = true;
         }
      } else { // default to all cells
         allCells = currElement.values.join('');
         if (allCells.match(pattern)) {
            this.elements[i].visible = true;
         }
      }
   }

   hideAll.call(this);

   for (i = 0, len = this.elements.length; i < len; ++i) {
      if (this.elements[i].visible) {
         this.elements[i].obj.style.display = '';
      }
   }
}

ElementManager.prototype.clearSearch = function() {
   var i, len;

   for (i = 0, len = this.elements.length; i < len; ++i) {
      this.elements[i].visible = true;
      this.elements[i].obj.style.display = '';
   }
}
