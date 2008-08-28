importFromModule("aida.controller", "*");

function Step2extraController() {
   
   this.mixin("step2");
   beforeFilter(this.publicFilter);
            
   this.index_action = function() {
      // GET /step1
      res.writeln("&lt;- That's the output from the before filters. ");
   }
         
}
