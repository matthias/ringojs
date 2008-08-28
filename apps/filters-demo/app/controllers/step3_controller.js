importFromModule("aida.controller", "*");

function Step3Controller() {

   // Pass in multiple filters at once
   beforeFilter(privateFilter01, privateFilter02, privateFilter01);

   index_action = function() {
      // GET /step3
      res.writeln("&lt;- That's the output from the before filters. ");
   }
   
   // private filters
   function privateFilter01() {
      res.write("one.<br />")
   }

   function privateFilter02() {
      res.write("two.<br />")
   }
      
}
