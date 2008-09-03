importModule('helma.skin'); 
importModule("helma.logging", "logging");
 
(function () {
   var logger = logging.getLogger(__name__);

   render = function(templatePath, context) {
      logger.debug("Render skin at " + templatePath);
      helma.skin.render(templatePath, context);
   }
   
}).call(this); 
