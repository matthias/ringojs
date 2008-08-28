importFromModule("aida.controller", "*");

function FilterconditionsController() {

   // Pass in multiple filters at once
   beforeFilter(authenticate, { except : ["login", "logout"] });
   beforeFilter(function() { context.title = "This Is Foo!"  }, { only : "foo" });

   this.index_action = function() {
      // GET /filter_conditions
      res.writeln("Index. Hello " + req.cookies.user + "!");
      res.writeln("<a href=\"/filterconditions/logout\">logout</a>");
      res.writeln(" | <a href=\"/filterconditions/foo\">go to foo</a>");
   }

   this.foo_action = function() {
      // GET /filter_conditions
      res.writeln("<h2>" + context.title + "</h2>");
   }

   this.login_action = function() {
      // GET /filterconditions/login
      if (req.data.user) {
         res.setCookie("user", req.data.user);
         res.redirect("/filterconditions");
      }
   }
   
   this.logout_action = function() {
      // GET /filterconditions/logout
      res.setCookie("user", "");
      res.redirect("/filterconditions");
   }   
   
   // private filters
   function authenticate() {
      if (!req.cookies.user) {
         res.redirect("/filterconditions/login");
      }
   }
      
}
