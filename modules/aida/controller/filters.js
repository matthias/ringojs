
importModule("javascript.prototype");

importModule('helma.logging', 'logging');
logging.setConfig(getResource('config/environments/development/log4j.properties').path);
var logger = logging.getLogger(__name__);

/**
 * Filters enable controllers to run shared pre- and post-processing code for its actions. These filters can be used to do
 * authentication, caching, or auditing before the intended action is performed. Or to do localization or output
 * compression after the action has been performed. Filters have access to the request, response, and all the instance
 * variables set by other filters in the chain or by the action (in the case of after filters) by using "this".
 **/
 
/**
 * Constructor for filter object.
 */
function Filter(filter, type, param) {
   this.filter = filter.filter ? filter.filter : filter;
   this.param = param || {};
   if (this.param.only && !Object.isArray(this.param.only)) this.param.only = [this.param.only];
   if (this.param.except && !Object.isArray(this.param.except)) this.param.except = [this.param.except];
   this.type = type;
}

Filter.before = "before";
Filter.after  = "after";


/**
 * Calls all before filters and returns true, if all filters return true,
 * or if there are no before filters.
 * @return {Boolean}
 */
function beforeFiltersPass() {
   for (var i=0; i<this.beforeFilters.length; i++) {
      var f = this.beforeFilters[i];
      if (f.param.only && !f.param.only.include(req.route.action)) continue;
      if (f.param.except && f.param.except.include(req.route.action)) continue;
      if (f.filter.apply(this) === false) return false;
   }   
   return true;
}


/**
 * Calls all after filters and returns the manipulated content.
 * @return {String}
 */
function applyAfterFilters() {
   for (var i=0; i<this.afterFilters.length; i++) {
      var f = this.afterFilters[i];
      if (f.param.only && !f.param.only.include(req.route.action)) continue;
      if (f.param.except && f.param.except.include(req.route.action)) continue;
      f.filter.call(this);
   }
}


/**
 * @ignore
 */
function createFilterObjects(args, type) {
   var filters = $A(args);
   var param = {};
   var last = filters[filters.length-1];
   if (!last.filter &&  !Object.isFunction(last)) {
      param = filters.pop();
   }
   filters = filters.collect(function(f) {
      return new Filter(f, type, param)
   });
   return filters;
}
 

/**
 * Array of before-filter functions for this controller.
 */
this.beforeFilters = [];


/**
 * Alias for appendBeforeFilter
 * @see appendBeforeFilter
 */
var beforeFilter = appendBeforeFilter;


/**
 * The passed filters will be appended to the array of filters that 
 * run before actions on this controller are performed.
 * @param {Function} filter*  A filter function which returns true, if the filter passed.
 * @see beforeFilter
 */
function appendBeforeFilter() {
   Array.prototype.push.apply(
      this.beforeFilters, 
      createFilterObjects(arguments, Filter.before)
   );
}


/**
 * The passed filters will be prepended to the array of filters that 
 * run before actions on this controller are performed.
 * @param {Function} filter  A filter function which returns true, if the filter passed.
 * @see beforeFilter
 */
function prependBeforeFilter() {
   Array.prototype.unshift.apply(
      this.beforeFilters, 
      createFilterObjects(arguments, Filter.before)
   );
}


/**
 * Array of before-filter functions for this controller.
 */
this.afterFilters = [];


/**
 * Alias for appendAfterFilter
 * @see appendAfterFilter
 */
var afterFilter = appendAfterFilter;


/**
 * The passed filters will be appended to the array of filters that 
 * run after actions on this controller are performed.
 * @param {Function} filter
 *    A filter function which returns the filtered output string. 
 *    output, req, res, session will be passed as arguments to the filter function.
 * @see afterFilter
 */
function appendAfterFilter() {
   Array.prototype.push.apply(
      this.afterFilters, 
      createFilterObjects(arguments, Filter.after)
   );
}


/**
 * The passed filters will be prepended to the array of filters that 
 * run after actions on this controller are performed.
 * @param {Function} filter*  
 *    A filter function which returns the filtered output string. 
 *    output, req, res, session will be passed as arguments to the filter function.
 * @see afterFilter
 */
function prependAfterFilter() {
   Array.prototype.unshift.apply(
      this.afterFilters, 
      createFilterObjects(arguments, Filter.after)
   );
}
