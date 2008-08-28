importFromModule("aida.controller", "*");

function Step2Controller() {
   
   // Load a filter function from a module
   // You MUST use var here. Otherwise you will overwrite the filters chain.
   var filters = importModule("app/modules/filters");
   beforeFilter(filters.someModuleFilter);

   // Use a private function as a filter
   beforeFilter(privateFilter);

   // Use a public module function as a filter
   this.publicFilter = function() {
      res.write("I'm a public filter function within the \
         <tt>app/controllers/step2_controller.js</tt> module.<br />")      
   }   
   beforeFilter(this.publicFilter);
            
   this.index_action = function() {
      // GET /step2
      res.writeln("&lt;- That's the output from the before filters. ");
   }
   
   this.foo_action = function() {
      // GET /step2/foo
      res.writeln("&lt;- foo. ");
   }
   
   // filters
   function privateFilter() {
      res.write("I'm a private filter function within the \
         <tt>app/controllers/step2_controller.js#Step2Controller()</tt> constructor.<br />")
   }
   
}
