importFromModule("aida.controller", "*");

function Step4Controller() {

   // Pass in multiple filters at once
   beforeFilter(privateFilter01);
   prependBeforeFilter(privateFilter01, privateFilter02);

   index_action = function() {
      // GET /step4
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
