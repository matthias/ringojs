importFromModule("aida.controller", "*");

function Step1Controller() {
   
   // Add filters with anonymouse functions.
   beforeFilter(function() { 
      res.contentType = "text/plain; charset=UTF-8"
   });
            
   index_action = function() {
      // GET /step1
      res.writeln("This should be displayed as plain text in your browsers.")
      res.writeln("Line breaks will be respected.")
   }

   foo_action = function() {
      // GET /step1/foo
      res.writeln("This is the foo action.")
      res.writeln("It outputs plain text as well.")
   }
      
}
