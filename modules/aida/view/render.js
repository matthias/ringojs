importFromModule("formats", "Formats");
importModule("aida.config", "config")
importModule("templating");
importFromModule("layout", "*");
 
importModule("helma.logging", "logging");
 
(function () {

   var logger = logging.getLogger(__name__);
   this.layoutChain = [];
   
   /**
    * Writes content to the response, by using template and/or a layout files.
    * 
    * <p>Depending on the options you pass to the function it will do the following
    *
    * <dl> 
    * <dt>render()</dt><dd>
    *  With no parameter, the render method renders the default template 
    *  for the current controller and action. The following code will render the 
    *  template <span class=path>app/views/blog/index.skin</span>
    *  <pre class=javascript>
    * importModule(“aida.controller”, “Controller”);
    * this.__proto__ = Controller;
    * 
    * function index() {
    * 	render();
    * }
    *  </pre>
    *
    *  <p>render() may just be called once per request. If you don't call render() in your
    *  action method, Controller, or to be more specific - handleRequest, will
    *  perform it without any parameters.
    *  <p>If you don't specify a handler method for the action, Action Controller will try
    *  to find the corresponding template (skin) and call it. If it can't find a method nor 
    *  a template for the matching route (controller/action) it will call the action "notfound"
    *  for the controller.
    * </dd> 
    * 
    * <dt>render({text:<string>})</dt><dd>
    *  <p>Sends the given string to the response. 
    *  No template interpretation or HTML escaping is performed.
    *  <pre class=javascript>
    * function index_action() {
    *	    render({text: "Hello there!"});
    * }
    *  </pre>
    * </dd>
    *
    * <dt>render({template:<string>, type:<skin|extension>, context:<object>})</dt><dd>
    *  <p>Interprets string as the source to a template of the given type, rendering the 
    *  results back to the client. If the :locals hash is given, the contents are used 
    *  to set the values of local variables in the template. 
    *  <p>The following code adds method_missing to a controller if the application is 
    *  running in development mode. If the controller is called with an invalid action, 
    *  this renders an inline template to display the action’s name and a formatted version 
    *  of the request parameters.
    *  <code class=javascript>
    * function welcome_action() {
    *	  render({
    *     template: 
    *       '&lt;h2&gt;Hello &lt;% name %>!&lt;/h2&gt; \
    *        &lt;p&gt;Welcome, and have a nice day!&lt;/p&gt;',
    *     context : { name : "Matthias" }
    *   });
    * }
    *  </code> 
    *  <p>Note: You have to end each line of the multi line string with a backslash,
    *  otherwise you will get an “unterminated string literal” error from Rhino.
    * </dd>
    *
    * <dt>render({action:<string>})</dt><dd>
    *  <p>Renders the template for a given action in this controller.
    *  <pre class=javascript>
    * function display_cart_action() {
    *	  if (cart.isEmpty()) { 
    *     render({action:"index"});
    *   } else {
    *     // ...
    *   }
    * }
    *  </pre>
    *  Note that calling render({action:...}) does not call the action method; 
    *  it simply displays the template. If the template needs instance variables, 
    *  these must be set up by the method that calls the render.
    * </dd>
    * </dl>
    * 
    * @param {object} options Options for defining the output. See description.
   */
   this.render = function(options) {
      if (res.calledRender) throw new DoubleRenderError();
      res.calledRender = true;
      if (!options) options = {};
      
      // set contetType
      if (!res.contentType) res.contentType = Formats.getMimeType(req.route.format);
      
      var action = options.action || req.route.action;
      var context = prepareContext.call(this, options.context);

      res.pop(); // the current res.buffer is stored in context.content;
      delete options.context;
      
      if (options.layout !== undefined) {
         controller.useLayout(options.layout);
         delete options.layout;
      }

      res.push();
      if (typeof options === "string" && options !== "") {
         logger.debug("called function render() with a string: " + options.clip(20));
         res.write(options);
      } else if (options && options.inline) {
         logger.error("options.inline isn't implemented yet for render()")
      } else {
         logger.debug("called function render() without specifying a template or content.");
         try {
            templating.render(Object.extend({
               controller : this.getShortName(),
               action : action,
               format : req.route.format
            }, options), context);  
         } catch(err) {
            if (err instanceof this.templating.NoTemplateFoundError && context.content != null) {
               res.write(context.content);
            } else {
               throw err;
            }
         }
      }
      context.content = {
         main : res.pop()
      };
      
      res.push();
      var layoutPath = this.getLayoutPath();
      if (layoutPath && getResource(layoutPath).exists()) {
         var renderer = this.templating.getRenderer("skin");
         renderer.render(layoutPath, context);         
      } else {
         res.write(context.content.main);
      }
      res.content = res.pop();
      return res.content;
   }   

   // private functions

   function prepareContext(context) {
      var result = {};
      for (var name in this.helpers) {
         logger.info("load helpers " + name);
         if (this.helpers[name]._namespace) {
            result[this.helpers[name]._namespace] = this.helpers[name];
         } else {
            result = Object.extend(result, this.helpers[name]);         
         }
      }
      result = Object.extend(
         result,
         {
            "this" : this,
            controller : this.prototype,
            flash : req.flash,
            content : res.buffer,
            logger : logger, 
            request : req,
            params : req.data,
            headers : req.headers, 
            response : res,
            session : session
         },
         this.context || {}
      );
      result = Object.extend(result, context || {});
      return result;
   }
      
   // ERROR Objects

   function DoubleRenderError() {
      this.toString = function() {
         return "render() may just be called once."
      }
   }   

}).call(this); 
