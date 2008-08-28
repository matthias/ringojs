importFromModule("aida.controller", "*");

function BeforeafterController() {

   // Pass in multiple filters at once
   beforeFilter(authenticate, { except : ["index", "login"] });
   
   // You can use after filters for logging
   // or you can manipulate the res.content string, which contains the final output
   // after calling the action and the render() function.
   afterFilter(function() { 
      logger.info("called after filter.");
      res.content = res.content.toUpperCase() 
   });
   afterFilter(function() { 
      res.content = res.content.substr(0, res.content.length-1) + ", hello!!"; 
   });

   this.index_action = function() {
      // GET /filter_conditions
      res.write("Index.");
   }

   this.protected_action = function() {
      // GET /filter_conditions
      res.writeln("Protected!");
   }
      
   // private filters
   function authenticate() {
      if (!req.cookies.user) {
         res.redirect("/filterconditions/login");
      }
   }
      
}
