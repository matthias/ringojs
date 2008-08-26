// Load helma app and logging
importModule("helma.app", "app");
importModule("helma.logging", "logging");
var logger = logging.getLogger(__name__);

// Load aida framework
importModule("aida.controller.request");
importModule("aida.config");
aida.config.setEnvironment("development");

// main method called to start application
function main() {
   app.start({ staticDir: aida.config.STATIC_DIR });
   logger.info("Started Aida on helma-ng." + aida.config.STATIC)
}

// handleRequest will be called by helma-ng on every HTTP request.
function handleRequest(req, res, session) {
   
   // Aidas handleRequest will take care about
   //  - setting up the request environment, 
   //  - evaluate the routing, 
   //  - get a controller instance,
   //  - call the filters
   //  - call an action,
   //  - render the ouput 
   //  - and send it back to the response
   aida.controller.request.handleRequest(req, res, session, "root");
}
