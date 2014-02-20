/* exported elementsJS */
var elementsJS = function() {
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

   // ensure consistent internal usage of clear
   context.clear = function() {
      if (context.container && context.container.childNodes.length) {
         while (context.container.childNodes.length > 0) {
            context.container.removeChild(context.container.firstChild);
         }
      }
   }

   api.clear = context.clear;

   api.sync = function(options) {
      if (!options.containerId || !options.elementType) {
         throw new Error('[elements.js] must specify containerId and elementType');
      } else if (options.elementType === options.innerType) {
         throw new Error('[elements.js] elementType and innerType must be unique');
      }

      // TODO
      // if future:
      //    add mutation object
      context.container = document.getElementById(options.containerId);
      context.elementType = options.elementType;
      context.cellType = options.cellType;
      context.sortState = {focusField: null, order: -1};
      context.mutations = 0;
      context.elements = [];
      context.sortList = [];

      var elements = context.container.querySelectorAll(options.elementType),
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

   api.mutated = function(options) {
      if (++context.mutations >= options.threshold) {
         // resync
         context.mutations = 0;
      }
   }

   api.sort = function(options) {
      var field = options.field || 0,
          order,
          i, 
          len;

      if (context.elements.length) {
         if (field < 0 || field >= context.elements[0].values.length) {
            throw new Error('[elements.js] Invalid sort field.');
         }
      }

      if (!context.sortState.focusField || context.sortState.focusField !== field) {
         context.sortState.focusField = field;
         context.sortList = [];
         for (i = 0; i < context.elements.length; ++i) {
            if (context.elements[i].visible) {
               context.sortList.push(context.elements[i]);
            }
         }
      }

      order = context.sortState.order *= -1;

      context.sortList.sort(function(a, b) {
         a = a.values[field];
         b = b.values[field];
         if (options.numeric || false) {
            return (b - a)*order;
         } else {
            return a.localeCompare(b)*order;
         }
      }); 

      for (i = 0, len = context.sortList.length; i < len; ++i) {
         context.container.appendChild(context.sortList[i].obj);
      }
   }

   api.search = function(options) {
      var pattern = new RegExp(options.term.replace(/[$^*+?.-\/\\|()[\]{}]/g, '\\$&'), 'i'),
          currElement,
          allFields,
          field,
          i,
          len;

      if (options.hasOwnProperty('field')) {
         field = options.field;
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

      context.clear();

      for (i = 0, len = context.elements.length; i < len; ++i) {
         if (context.elements[i].visible) {
            context.container.appendChild(context.elements[i].obj);
         }
      }
   }

   return api;
}
