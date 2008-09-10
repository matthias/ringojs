
importModule("javascript.prototype");
importFromModule("controller", "*");
importModule("routing");
importModule('helma.rhino', 'rhino');

importModule('helma.logging', 'logging');
logging.setConfig(getResource('config/environments/development/log4j.properties').path);
 
(function () {
   
   var logger = logging.getLogger(__name__);
   
   /**
    * Tries to resolve the incoming request, and call the matching controllers action.
    * It will be called by the global handleRequest.
    *
    * @param {object} controller   Controller object
    * @param {object} req          Request object, passed by helma-ng
    * @param {object} res          Response object, passed by helma-ng
    * @param {object} session      Session object, passed by helma-ng
    */
   this.handleRequest = function(req, res, session, controllerName) {
      rhino.invokeCallback('onRequest', null, [req]);
      // install req, res and session as globals
      global.req = req;
      global.res = res;
      global.session = session;      
      
      if (!controllerName) controllerName = "root";
      logger.debug("[" + controllerName + "] handleRequest " + req.path);
      
      var routeSet = routing.loadRoutes(controllerName).routeSet;
      logger.debug("use routeSet " + routeSet + " from " + controllerName);

      req.route = req.route || routeSet.recognizeRequest(req);
      
      if (req.route) {
         logger.debug("found matching route " + req.route);
      } else {
         logger.error("couldn't find a matching route. Return 404.");
         return notfound();
      }
      Object.extend(req.data, req.route.params);
      Object.extend(req.params, req.route.params);

      var controller = getControllerInstance(req.route.controllerName);
      if (controller) {
         logger.debug("use controller instance " + controller + " for " + req.route.controllerName);
      } else {
         logger.error("couldn't find a controller for " + req.route.controllerName + ". Return 404.");
         return notfound();
      } 
      
      req.route.handler = controller.getAction(req.route);
      if (controller) {
         logger.debug("found an action handler for this route.");
      } else {
         logger.error("couldn't find an action handler for this routes. Return 404.");
         return notfound();
      }
            
      req.actionName = req.route.action;
      res.content = {};

      if (!controller.beforeFiltersPass()) return;
      
      try {
         req.route.handler.call(controller);
         if (!res.calledRender) controller.render();
         controller.applyAfterFilters(res.content);
         res.write(res.content);
      } catch (e) {
         error(e);
      } finally {
         rhino.invokeCallback('onResponse', null, [res]);
      }
   }
   

   /**
    * Standard error page
    * @param e the error that happened
    */
   function error(e) {
       res.status = 500;
       res.contentType = 'text/html';
       res.writeln('<h2>', e, '</h2>');
       if (e.fileName && e.lineNumber) {
           res.writeln('<p>In file<b>', e.fileName, '</b>at line<b>', e.lineNumber, '</b></p>');
       }
       if (e.rhinoException) {
           res.writeln('<h3>Script Stack</h3>');
           res.writeln('<pre>', e.rhinoException.scriptStackTrace, '</pre>');
           res.writeln('<h3>Java Stack</h3>');
           var writer = new java.io.StringWriter();
           var printer = new java.io.PrintWriter(writer);
           e.rhinoException.printStackTrace(printer);
           res.writeln('<pre>', writer.toString(), '</pre>');
       }
       return null;
   }

   /**
    * Standard notfound page
    */
   function notfound() {
       res.status = 404;
       res.contentType = 'text/html';
       res.writeln('<h1>Not Found</h1>');
       res.writeln('The requested URL', req.path, 'was not found on the server.');
       return null;
   }   

}).call(this);
