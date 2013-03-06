function Thing() {
   this.properties = {};

   this.hasProperty = function(name)
   {
      return properties[name] != null;
   }

   this.getProperty = function(name)
   {
      return properties[name];
   }
}

function Property() {
   this.name = "property";
   this.value = 0;

   this.getValue = function()
   {
      return Math.floor(this.value);
   }

   this.setValue = function(input)
   {
      this.value = input;
   }

   this.describe = function()
   {
      
   }
}

function Event() {
   this.name = "Action";

   this.perform(thing)
   {
      
   }
}

function Container() {
   this.contents = [];

   this.addThing = function(thing)
   {
      contents.push(thing);
   }

   this.removeThing = function(thing)
   {
      for (var i in contents)
      {
         if (contents[i] === thing)
         {
            contents.splice(i, 1);
         }
      }
   }

   this.describe()
   {
      var output = "This contains...";

      for (var i in contents)
      {
         output += contents[i].name + "\n";
      }

      return output;
   }
}
