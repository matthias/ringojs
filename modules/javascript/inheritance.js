Function.prototype.extend = function(constructor) {
   var proto = {};
   for (var i in constructor.prototype) proto[i] = constructor.prototype[i];
   // constructor.prototype = new this();
   var parent = new this();
   parent.__proto__ = constructor.__parent__;
   constructor.__proto__ = parent;
   
/*   ctor.prototype = app.controllers[name + "_controller"];
   Object.extend(ctor.prototype, proto);
   ctor.prototype.__name__ = getClassNameFromName(name);
   var c = new ctor(); */
      
   return constructor;
} 
