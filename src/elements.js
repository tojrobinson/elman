var elementsJS = function() {
   'use strict';

   var context = {
      container: null,
      elementType: null,
      cellType: null,
      currField: null,
      elements: [],
      sortList: []
   },
   api = {};

   api.sync = function(settings) {
      context.container = document.getElementById(settings.containerId);
      context.elementType = settings.elementType;
      context.cellType = settings.cellType;
      context.elements = [];
      context.sortList = [];
      context.currField = {index: -1, order: -1};
      var elements = document.getElementById(settings.containerId).getElementsByTagName(settings.elementType);
      for (var i = 0; i < elements.length; ++i) {
         context.elements.push({
            obj: elements[i],
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

   api.sort = function(numeric, field) {
      var order, i, len;

      if (field !== context.currField.index) {
         context.currField.index = field;
         context.currField.order = -1;
         // context.sortList.length = 0;
         context.sortList = [];

         for (i = 0; i < context.elements.length; ++i) {
            var element = context.elements[i],
                comparisonObject = {
                   element: element.obj
                };

            if (!element.visible) {
               continue;
            }

            if (context.cellType) {
               var cell = element.obj.getElementsByTagName(context.cellType)[field];
               comparisonObject.value = cell.innerText || cell.textContent;
            } else {
               comparisonObject.value = element.obj.innerText || element.obj.textContent;
            }

            context.sortList.push(comparisonObject);
         }
      }

      order = context.currField.order *= -1;

      context.sortList.sort(function(a, b) {
         if (numeric) {
            return (b.value - a.value)*order;
         } else {
            return a.value.localeCompare(b.value)*order;
         }
      }); 

      for (i = 0, len = context.sortList.length; i < len; ++i) {
         context.container.appendChild(context.sortList[i].element);
      }
   }

   api.search = function() {
      for (var i = 0, len = context.elements.length; i < len; ++i) {
         // TODO
         // build results/eliminate non-matching
      }
   }

   return api;
}
