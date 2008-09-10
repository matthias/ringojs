
importModule("javascript.prototype");
importModule("routing");

importModule('helma.logging', 'logging');
logging.setConfig(getResource('config/environments/development/log4j.properties').path);
 
(function () {
   
   var logger = logging.getLogger(__name__);
   
   this.getController = function(name) {
      if (typeof name === "string") {
         var className = (name.match(/^(.*)Controller$/)) ? name : getClassNameFromName(name);
         constructor = importModule("app.controllers." + name + "_controller")[className];
         if (!constructor) {
            throw new Error("Couldn't find controller " + getClassNameFromName(constructor) + " in app/controllers/" + constructor + "_controller");
         }         
      }
      // var proto = Object.clone(constructor.prototype);
      constructor.prototype = importModule("aida.controller");
      constructor.prototype.__name__ = className;
      // Object.extend(constructor.prototype, proto);
      return constructor;

//      c.importHelpers("application")
//      c.importHelpers(name)
   }

   /**
    * 
    */
   this.getControllerInstance = function(name) {
      var constructor = this.getController(name);
      return new constructor();
   }

   
   /**
    * Inherit from another controller.
    *
    */
   this.mixin = function(constructor) {
      if (typeof constructor === "string") {
         constructor = this.getController(constructor);
      }
      mixin(this, constructor);
   }
   
   this.actions = {};

   this.getClassNameFromName = function(name) {
      return name.capitalize() + "Controller";
   }

   /**
    * Returns an URL for this options.
    * 
    */
   this.urlFor = function(options) {
      return this.routes.generate(options, req, this);
   }


   this.getShortName = function() {
      var namePattern = /^(.*)Controller$/;
      return this.__name__.match(namePattern)[1].toLowerCase();
   }

}).call(this);

