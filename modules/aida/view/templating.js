importFromModule("aida.controller.formats", "Formats");
 
importModule("helma.logging", "logging");
importModule("aida.config", "config");
 
(function () {
   
   DEFAULT_TEMPLATE_TYPE = "skin";
   TEMPLATE_TYPES = ["jstl", "este", "ejs", "skin"];

   var logger = logging.getLogger(__name__);
   this.layoutChain = [];
   
   this.render = function(options, context) {
      if (!options) options = {};
      if (!options.type) options.type = determineTemplateType(options) || DEFAULT_TEMPLATE_TYPE;
      var templatePath = getTemplatePath(options);
      logger.debug("templatePath:" + templatePath);
      if (!templateFileExists(templatePath)) {
         throw new NoTemplateFoundError(options);
      }
      var renderer = this.getRenderer(options.type);
      
      if (renderer) {
         renderer.render(templatePath, context);         
      } else {
         res.write(getResource(templatePath).getContent())
      }
   }

   this.determineTemplatePath = function(options) {
      if (!options.action || !options.controller || !options.format) return;
      if (!options.type) options.type = determineTemplateType(options);
      var templatePath = getTemplatePath(options);
      if (!templateFileExists(templatePath)) return;
      return templatePath;
   }
   
   this.templateFileExists = function(optionsOrPath) {
      return getTemplateSource(optionsOrPath).exists();
   }

   // Exceptions
   this.NoRendererError = function(data) {
      var message = "Couldn't find renderer for template type " + data.type + ".";
      logger.error(message);
      this.toString = function() {
         return message;
      }
      return message;
   }
   
   this.NoTemplateFoundError = function(data) {
      var message = "Couldn't find template file " + getTemplatePath(data) + " for options " + uneval(data) + ".";
      logger.error(message);
      this.toString = function() {
         return message;
      }
      return message;
   }
   
   this.getRenderer = function(type) {
      try {
         importModule("templating." + type, "Renderer");
         return Renderer;      
      } catch (err) {
         return;
      }
   }   

   this.determineTemplateType = function(options) {
      if (options.type) return options.type;
      var types = TEMPLATE_TYPES.clone(); // ["jstl", "este", "ejs", "skin"]
      types.push((options || {}).format);
      for (var i=0; i<types.length; i++) {
         if (
            getTemplateSource(
               getTemplatePath(
                  Object.extend(options, {type:types[i]})
               )
            ).exists()
         ) {
            return types[i];
         }
      }
      return;
   }

   this.getTemplateSource = function(optionsOrPath) {
      var templatePath = (typeof optionsOrPath === "string") ? optionsOrPath : getTemplatePath(optionsOrPath);
      return getResource(templatePath);
   }

   this.getTemplatePath = function(options) {
      var result = 
         (config.TEMPLATE_ROOT || "app/views") + 
         '/' + options.controller + 
         '/' + options.action + 
         '.' + options.format + 
         ((options.type != options.format) ? ('.' + options.type) : '');
      return result;
   } 

}).call(this); 
