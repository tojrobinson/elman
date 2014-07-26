module.exports = function() {
   'use strict';

   var context = {
      container: null,
      elementType: null,
      cellType: null,
      sortState: null,
      mutations: 0,
      elements: [],
      sortList: []
   },
   api = {};

   context.hideAll = function() {
      for (var i = 0; i < context.elements.length; ++i) {
         context.elements[i].obj.style.display = 'none';
      }
   }

   context.resyncElements = function() {
      //context.elements.length = 0;
      context.elements = [];
      context.sortState.buildList = true;
      context.mutations = 0;

      var elements = context.container.querySelectorAll(context.elementType),
          currElement,
          cells,
          values;

      for (var i = 0; i < elements.length; ++i) {
         currElement = elements[i];

         if (!context.cellType) {
            values = [currElement.innerText || currElement.textContent || ''];
         } else {
            values = [];
            cells = currElement.querySelectorAll(context.cellType);
            for (var j = 0; j < cells.length; ++j) {
               values.push(cells[j].innerText || cells[j].textContent || '');
            }
         }

         context.elements.push({
            obj: elements[i],
            values: values,
            visible: true
         });
      }
   }

   api.clear = function() {
      if (context.container && context.container.childNodes.length) {
         while (context.container.childNodes.length > 0) {
            context.container.removeChild(context.container.firstChild);
         }
      }
   }

   api.sync = function(opt) {
      opt = opt || {};
      if (!opt.containerId || !opt.elementType) {
         throw new Error('[elements.js] must specify containerId and elementType');
      } else if (opt.elementType === opt.innerType) {
         throw new Error('[elements.js] elementType and innerType must be unique');
      }

      // TODO
      // if future:
      //    add mutation object
      context.container = document.getElementById(opt.containerId);
      context.elementType = opt.elementType;
      context.cellType = opt.cellType;
      context.sortState = {focusField: null, order: -1, buildList: true};
      context.mutations = 0;
      context.elements = [];
      context.sortList = [];

      var elements = context.container.querySelectorAll(opt.elementType),
          currElement,
          cells,
          values;

      for (var i = 0; i < elements.length; ++i) {
         currElement = elements[i];

         if (!context.cellType) {
            values = [currElement.innerText || currElement.textContent || ''];
         } else {
            values = [];
            cells = currElement.querySelectorAll(context.cellType);
            for (var j = 0; j < cells.length; ++j) {
               values.push(cells[j].innerText || cells[j].textContent || '');
            }
         }

         context.elements.push({
            obj: elements[i],
            values: values,
            visible: true
         });
      }
   }

   api.mutated = function(opt) {
      opt = opt || {};
      ++context.mutations;
      // resync now else on next sort/search
      if ((opt.threshold > 0) && (context.mutations >= opt.threshold)) {
         context.resyncElements();
      }
   }

   api.sort = function(opt) {
      opt = opt || {};
      var field = opt.field || 0,
          order,
          i, 
          len;

      if (context.elements.length) {
         if (field < 0 || field >= context.elements[0].values.length) {
            throw new Error('[elements.js] Invalid sort field.');
         }
      }

      // check for unsynced mutations
      if (context.mutations) {
         context.resyncElements();
      }

      if (context.sortState.buildList || (context.sortState.focusField !== field)) {
         context.sortState.focusField = field;
         context.sortState.buildList = false;
         context.sortList = [];
         for (i = 0; i < context.elements.length; ++i) {
            // only sort visible
            if (context.elements[i].visible) {
               context.sortList.push(context.elements[i]);
            }
         }
      }

      order = context.sortState.order *= -1;

      context.sortList.sort(function(a, b) {
         a = a.values[field];
         b = b.values[field];
         if (opt.numeric || false) {
            return (b - a)*order;
         } else {
            return a.localeCompare(b)*order;
         }
      }); 

      for (i = 0, len = context.sortList.length; i < len; ++i) {
         context.container.appendChild(context.sortList[i].obj);
      }
   }

   api.search = function(opt) {
      opt = opt || {};
      var pattern = new RegExp(opt.term.replace(/[$^*+?.-\/\\|()[\]{}]/g, '\\$&'), 'i'),
          currElement,
          allFields,
          field,
          i,
          len;

      // check for unsynced mutations
      if (context.mutations) {
         context.resyncElements();
      }

      // notify sort
      context.sortState.buildList = true;

      // TODO allow search on subset of fields rather than 1 or all
      if (opt.hasOwnProperty('field')) {
         field = opt.field;
         if (field < 0 || field >= context.elements[0].values.length) {
            throw new Error('[elements.js] Invalid search field.');
         }
      } else {
         field = false;
      }

      for (i = 0, len = context.elements.length; i < len; ++i) {
         currElement = context.elements[i];
         currElement.visible = false;
         if (field !== false) {
            if(currElement.values[field].match(pattern)) {
               context.elements[i].visible = true;
            }
         } else { // default to all fields
            allFields = currElement.values.join(' ');
            if (allFields.match(pattern)) {
               context.elements[i].visible = true;
            }
         }
      }

      context.hideAll();

      for (i = 0, len = context.elements.length; i < len; ++i) {
         if (context.elements[i].visible) {
            context.elements[i].obj.style.display = '';
         }
      }
   }

   return api;
}
