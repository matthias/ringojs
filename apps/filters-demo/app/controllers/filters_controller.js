importFromModule("aida.controller", "*");

function FiltersController() {
   
   // Add filters with anonymouse functions.
   beforeFilter(function() { res.write("before") });
   beforeFilter(function() { res.write(", and more before.<br />") });
   
/*   beforeFilter(authenticate, auth2, { except : ["index2", "foo", "indexx"] });
   beforeFilter(new OutputCompressionFilter())
   afterFilter(afterFilter1);
   afterFilter(afterFilter2); */
            
   index_action = function() {
      res.write("Index Action.")
      render({layout:null});
   }

   

   // filters
   
   function OutputCompressionFilter() {
      this.filter = function() {
         logger.info("###########");
      }
   }   
   
   function authenticate() {
      logger.info("---------xxxxx--------" + this.bla)
      return true; // (req.data.action === "index");
   }

   function auth2() {
      logger.info("---------x22xxxx--------")
      return true;
   }

   
   function afterFilter1() {
      // logger.info("do some logging after request:" + req.route)
   }
   
   function afterFilter2(content) {
      return this.content +=  ("!!!!!!!!");
   }   
      
}
