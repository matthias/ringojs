importModule('helma.logging', 'logging');
importFromModule("helma.file", "File");
 
(function () {
   
   var logger = logging.getLogger(__name__);

   this.helpers = {};

   importHelpers = function(module, namespace) {
      loadHelpers(this, module, namespace);
   }

   /**
    * Loads and mount helpers from a file.
    * Loads the helper file located at <tt>app/helpers/$name_helpers.js</tt> and
    * adds it to the module. All loaded helpers will be available in the view.
    *
    * @param {object} module        controller module, where the helpers should be mounted
    * @param {string} name          name of the helpers (file)
    * @param {string} [namespace]   optional namespace, for the helpers which will be used in the view
    * @return {object} helper module
    */
   loadHelpers = function(module, name, namespace) {
      // FIXME:
      var helpersDir = new File(getResource("/app/helpers").path);
      
      var helpersPattern = /^([a-z][a-z_\-0-9]*_helpers).js$/i;
      var helpers;
      if (!module.helpers) module.helpers = {};
   
      // load helpers
      var helperResource = getResource("app/helpers/" + name + "_helpers.js");
      if (helperResource.exists()) {
         importModule("app.helpers." + name + "_helpers");
         helpers = app.helpers[name + "_helpers"];
         if (namespace) helpers._namespace = namespace;
         module.helpers[name] = helpers;      
         logger.info("loaded helpers for " + module.__name__ + " from " + helperResource);      
      }
   
      return helpers;
   }

}).call(this);