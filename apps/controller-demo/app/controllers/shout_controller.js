importFromModule("aida.controller", "*");

function ShoutController() {
   this.mixin("say");
   
   this.hello_action = function() {
      res.write(this.hello.toUpperCase() + "!!!");
   }
}
