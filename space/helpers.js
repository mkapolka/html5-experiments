Array.prototype.pickRandom = function(){
   return this[Math.floor(Math.random() * this.length)];
}

Array.prototype.find = function(callback) {
   for (var i = 0; i < this.length; i++) {
      if (callback(this[i])) return this[i];
   }
   return undefined;
}

Array.prototype.remove = function(what) {
   var index = this.indexOf(what);
   if (index !== -1) {
      this.splice(this.indexOf(what), 1);
   }
   return this;
}
