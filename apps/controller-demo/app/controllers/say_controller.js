importFromModule("aida.controller", "*");

function SayController() {
   this.hello = "Hello World!";
   this.hello_action = function() {
      res.write(this.hello)
   }
}
