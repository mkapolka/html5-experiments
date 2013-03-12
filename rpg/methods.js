//The default value when a parameter doesn't define its own default value
var DEFAULT_DEFAULT_VALUE = 5;

function not(value) {
   if (value === undefined) {
      return true;
   } else {
      if (typeof value == "boolean") {
         return !value;
      } else {
         return value <= 0;
      }
   }
}

function is(value) {
   if (value === undefined) {
      return false;
   } else {
      if (typeof value === "boolean") {
         return value;
      } else {
         return value > 0;
      }
   }
}

//Places the object inside the container.
//The container should be an object or room.
function setContainer(object, container)
{
   if (object.parent !== undefined)
   {
      if (object.parent.contents.indexOf(object) !== -1)
      {
         object.parent.contents.splice(object.parent.contents.indexOf(object), 1);
         call(object.parent, "removedObject", object);
         call(object, "leftContainer", object.parent);
      }
   }

   if (container === undefined) return;

   var array = container.contents;
   object.parent = container;

   if (!container.isRoom)
   {
      object.x = container.x;
      object.y = container.y;
   }

   array.push(object);
   call(container, "addedObject", container);
   call(object, "enteredContainer", container);
}

//Return true if successful, false otherwise
function removeFromContainer(object) {
   if (not(object.parent.isRoom)) {
      var oldParent = object.parent;
      setContainer(object, object.parent.parent);
      moveObject(object, oldParent.x, oldParent.y);
      return true;
   }

   return false;
}

function moveObject(object, x, y)
{
   object.x = x;
   object.y = y;

   if (object.contents !== undefined)
   {
      for (var i in object.contents)
      {
         moveObject(object.contents[i], x, y);
      }
   }

   call(object, "move", x, y);
}

function open(object)
{
   if (object.openable)
   {
      if (object.watertight !== undefined)
      {
         object.max_watertightness = object.watertight;
         object.watertight = 0;
      }
      object.opened = 10;
   }
}

function close(object)
{
   if (object.openable)
   {
      if (object.watertight !== undefined)
      {
         object.watertight = object.max_watertightness;
      }
      object.opened = 0;
   }
}

function getObjectCapacity(object)
{
   var size = object.size === undefined?1:object.size;

   return Math.pow(size, 2);
}

//Containers can fit up to 3 objects one size class lower than it and unlimited
//two size classes lower
function canContainerFit(object, container)
{
   if (container.small > 1) return false;

   var capacity = 3;

   if (container.big > 1) {
      for (var c in container.contents) {
         if (!container.contents[c].small) {
            capacity -= 1;
         }
      }

      return capacity >= 0;
   }

   if (!container.small) {
      for (var c in container.contents) {
         capacity -= 1;
      }

      return capacity >= 0;
   }
}

function canObjectEnter(object, container) {
   if (!canContainerFit(object, container)) return false;

   if (!container.open) {
      return false;
   }
}

//Warning: shallow copies arrays!
function duplicateObject(object)
{
   var output = {};

   for (var v in object)
   {
      switch (typeof object[v])
      {
         case "number":
         case "string":
         case "undefined":
         case "boolean":
         case "function":
         case "object":
            output[v] = object[v];
         break;

         case "array":
            output[v] = object[v].slice();
         break;
      }
   }

   return output;
}

function splitObject(object, newsize)
{
   var os = object.size !== undefined?1:object.size;
   if (newsize > os) return undefined;

   var output = duplicateObject(object);
   output.size = newsize;
   object.size -= newsize;

   return output;
}

function deleteObject(object)
{
   if (object.parent === undefined) return;
   setContainer(object, undefined);
}

//Merges objects
function mergeObjects(object_a, object_b, add_size)
{
   for (var k in object_b)
   {
      if (typeof object_b[k] === "number")
      {
         if (object_a[k] !== undefined)
         {
            object_a[k] += object_b[k]; 
            object_a[k] /= 2;
         } else {
            object_a[k] = object_b[k];
         }
      } else if (typeof object_b[k] === "string")
      {
         if (object_a[k] === undefined)
         {
            object_a[k] = object_b[k];
         }
      }
   }

   if (add_size)
   {
      object_a.size += object_b.size;
   }
}

//Combines two object and returns the result
//Callback is a method that takes the form (objectA, objectB, propertyName, typeof)
//and returns the value of propertyName that the output should have
function combineObjects(output, objectA, objectB, callback) {
   var parms = {};
   for (var i in objectA) {
      parms[i] = typeof(objectA[i]);
   }
   for (var i in objectB) {
      parms[i] = typeof(objectB[i]);
   }

   for (var i in parms) {
      output[i] = callback(objectA, objectB, i, parms[i]);
   }

   return output;
}

//Combines two objects, but only the parameters that match a certain type
//Callback takes the form function(objectA, objectB, propertyName, typeof)
function combineByType(output, objectA, objectB, type, callback) {
   var parms = {};

   var paramsA = [];
   var paramsB = [];
   if (typeof type === "array") {
      for (var a in type) {
         paramsA = paramsA.join(getParamsByType(objectA, type[a]));
         paramsB = paramsB.join(getParamsByType(objectB, type[a]));
      }
   } else {
      paramsA = getParamsByType(objectA, type);
      paramsB = getParamsByType(objectB, type);
   }

   for (var i in paramsA) {
      parms[paramsA[i]] = typeof objectA[paramsA[i]];
   }
   for (var i in paramsB) {
      parms[paramsB[i]] = typeof objectB[paramsB[i]];
   }

   for (var i in parms) {
      output[i] = callback(objectA, objectB, i, parms[i]);
   }

   return output;
}

//Dissolve a into b, transferring any properties with type 'type'
function dissolve(objectA, objectB) {
   output = combineByType(objectB, objectA, objectB, "chemical", function(a, b, param, type) {
      switch (type) {
         case "number":
            if (a[param] === undefined) {
               return b[param];
            }
            if (b[param] === undefined) {
               return a[param];
            }
            return Math.max(a[param] , b[param]);
         break;

         default:
            return a[param];
         break;
      }
   });

   deleteObject(objectA);
   
   return objectB;
}

//When two liquids meet this is the method that should be called
function combineLiquids(objectA, objectB) {
   var s1 = Math.pow(paramSafeGet(objectA, "size"), 3);
   var s2 = Math.pow(paramSafeGet(objectB, "size"), 3);
   if (s1 > s2) {
      ratio = s2 / s1;
   } else {
      ratio = s1 / s2;

      var b = objectB;
      objectB = objectA;
      objectA = b;
   }
   objectA.temp = {};
   objectA.temp.s1 = s1;
   objectA.temp.s2 = s2;
   objectA.temp.ratio = ratio;

   //ObjA should always be the larger one
   var output = combineObjects(objectA, objectB, function(objA, objB, prop, type) {
      if (prop == "size") {
         return Math.pow(objA.temp.s1 + objA.temp.s2, 1/3);
      }
      switch (type) {
         case "number":
            return (objA[prop] * (1 - ratio)) + (objB[prop] * ratio);
         break;

         default:
            return objA[prop];
         break;
      }
   });

   return output;
}

function submerge(liquid, submersed)
{
   if (submerged.watertight !== undefined && submerged.watertight < 5)
   {
       var rc = getRemainingCapacity(submersed);
       if (rc > liquid.size) {
          addToContainer(liquid, submersed);
       } else {
          var newLiquid = splitObject(liquid, rc);
          addToContainer(newLiquid, submersed);
       }
   }
}

//Returns an array that contains the different strings that are revealed
//output[0] = The lead in, aka "The such and such..."
//output[1..n] = The descriptions of all the properties that can be revealed via the given
//reveal method
function reveal(object, method)
{
   var output = [];
   output[0] = "The " + object.name + "...";
   var props_revealed = 0;
   for (var k in object)
   {
      if (parameters[k] !== undefined && parameters[k].revealed_by !== undefined)
      {
         if (parameters[k].revealed_by.indexOf(method) !== -1)
         {
            var last = "";
            for (var i in parameters[k].values)
            {
               if (i <= object[k])
               {
                  last = parameters[k].values[i];
               }
            }
            if (last !== "")
            {
               //output += "\t" + last + "\n";
               output.push(last);
               props_revealed += 1;
            }
         }
      }
   }

   //Special logic for contents
   if (object.contents !== undefined && is(object.open)) {
      var contents_string = "contains ";
      var os = object.contents.map(function(v){ return v.name; });
      contents_string += os.join(",");
      output.push(contents_string);
   }

   if (props_revealed === 0)
   {
      //output = "You cannot discern anything about this object in this way!";
      output[0] = "You cannot discern anything about this object in this way!";
   }
   
   return output;
}

function revealToConsole(revelation)
{
   console.log(revelation[0] + "\n");

   for (var i=1; i < revelation.length; i++)
   {
      console.log("\t" + revelation[i] + "\n");   
   }
}

function revealToHTML(revelation)
{
   var output = "<p>";
   output += revelation[0];

   output += "<ul>";
   for (var i=1; i < revelation.length; i++)
   {
      output += "<li>" + revelation[i] + "</li>";
   }
   output += "</ul>";
   output += "</p>";

   return output;
}

function call(caller, method, dotdotdot)
{
   for (var p in caller)
   {
      if (caller.isDestroyed) return;
      if (parameters[p] !== undefined && parameters[p].functions !== undefined)
      {
         if (parameters[p].functions[method] !== undefined)
         {
            var m = parameters[p].functions[method];
            switch (arguments.length - 2)
            {
               case 0:
                  m(caller);
               break;

               case 1:
                  m(caller, arguments[2]);
               break;

               case 2:
                  m(caller, arguments[2], arguments[3]);
               break;

               case 3:
                  m(caller, arguments[2], arguments[3], arguments[4]);
               break;

               case 4:
                  m(caller, arguments[2], arguments[3], arguments[4], arguments[5]);
               break;

               default:
                  console.log("call() cannot take more than 4 parameters at the moment");
               break;
            }
         }
      }
   }
}

function paramInvert(param_name, value)
{
   if (parameters[param_name] !== undefined && parameters[param_name].max_value !== undefined)
   {
      return value - parameters[param_name].max_value;
   }

   return 10 - value;
}

function paramSafeGet(who, param_name)
{
   if (who[param_name] !== undefined)
   {
      return who[param_name];
   } else {
      if (parameters[param_name] !== undefined)
      {
         if (parameters[param_name].default !== undefined)
         {
            return parameters[param_name].default;
         } else {
            return DEFAULT_DEFAULT_VALUE;
         }
      }
   }
}

function get_string_template(param_name, param_value)
{
   if (parameters[param_name] !== undefined)
   {
      return parameters[param_name][param_value];
   }
}

function get_param_types(param_name)
{
   if (parameters[param_name] === undefined) return [];
   return parameters[param_name].types;
}

//Returns an array of strings
function getParamsByType(object, type)
{
   var output = [];
   for (var i in object)
   {
      var types = get_param_types(i);
      if (types !== undefined)
      {
         if (types.indexOf(type) !== -1)
         {
            output.push(i);
         }
      }
   }

   return output;
}

function moveAdjacentTo(mover, other)
{
   var ld = Number.MAX_VALUE;
   var tx, ty;
   for (var x = -1; x < 2; x++)
   {
      for (var y = -1; y < 2; y++)
      {
         var dx = Math.abs((other.x + x) - mover.x);
         var dy = Math.abs((other.y + y) - mover.y);
         if (dx + dy < ld) {
            ld = dx + dy;
            tx = other.x + x; 
            ty = other.y + y;
         }
      }
   }

   if (tx !== undefined)
   {
      mover.x = tx;
      mover.y = ty;
   }
}

function doTick(room)
{
   for (var i in room.contents) {
      function callTick(obj)
      {
         call(obj,"tick");
         if (obj.contents !== undefined)
         {
            for (var o in obj.contents)
            {
               callTick(obj.contents[o]);   
            }
         }
      }

      callTick(room.contents[i]);
   }
}

function getGlyph(object)
{
   if (object === undefined) return ".";
   if (object.form !== undefined)
   {
      return object.form.symbol;
   }

   return object.name.charAt(0).toUpperCase();
}

function isObjectAdjacent(objectA, objectB)
{
   return isAdjacent(objectA.x, objectA.y, objectB.x, objectB.y);
}

function isAdjacent(x1,y1,x2,y2)
{
   var dx = Math.abs(x1 - x2);
   var dy = Math.abs(y1 - y2);
   return (dx <= 1 && dy <= 1);
}

function createObjectFromTemplate(name)
{
   if (templates[name] === undefined) {
      console.log("Template \"" + name + "\" does not exist!");
      return undefined;
   }

   var output = duplicateObject(templates[name]); 

   //Set form
   //expects a string here
   var form = output.form;
   //set undefined here so that it doesn't try to remove the old values
   output.form = undefined;
   setForm(output, form);

   //set material (same as form)
   var material = output.material;
   //set undefined here so that it doesn't try to remove the old values
   output.material = undefined;
   setMaterial(output, material);

   if (output.contents !== undefined) {
      var objects = [];
      var newContainer = [];
      for (var i in output.contents)
      {
         var object = createObjectFromTemplate(output.contents[i]);
         objects.push(object);
      }

      output.contents = [];

      for (var i in objects)
      {
         setContainer(objects[i], output);
      }
   }

   return output;
}

function getTouchingObjects(object) {
   if (object.parent === undefined) return [];
   if (object.parent.isRoom) return [];
   if (object.parent.contents !== undefined)
   {
      var output = [];

      for (var i in object.parent.contents){
         if (object.parent.contents[i] != object) {
            output.push(object.parent.contents[i]);
         }
      }

      return output;
   }
}

//Actions that can be performed on an object when the player is holding it
function getHeldActions(object) {
   var output = {};
   for (var a in object.actionsHeld) {
      output[a] = object.actionsHeld[a];
   }
   for (var i in object) {
      if (parameters[i] !== undefined && parameters[i].actionsHeld !== undefined){
         for (var a in parameters[i].actionsHeld) {
            output[a] = parameters[i].actionsHeld[a];
         }
      }
   }
   return output;
}

//Actions that can be performed on an object while it's hanging out
//in the game world
function getStandingActions(object) {
   var output = {};
   for (var a in object.actionsStanding) {
      output[a] = object.actionsStanding[a];
   }
   for (var i in object) {
      if (parameters[i] !== undefined && parameters[i].actionsStanding !== undefined){
         for (var a in parameters[i].actionsStanding) {
            output[a] = parameters[i].actionsStanding[a];
         }
      }
   }
   return output;
}

function objectCombine(objectTo, objectFrom, callback) {
   for (var o in objectFrom) {
      objectTo[o] = callback(objectFrom[o], objectTo[o]);
   }
}

function setForm(object, form) {
   //accept either string or object form
   if (typeof form === "string") {
      var fn = form;
      form = forms[form];
      //Cannot continue if cannot find form data
      if (form === undefined) {
         console.log("Couldn't find data for form: " + fn);
         return;
      };
   }

   setSubTemplate(object, "form", form);
}

function setMaterial(object, material) {
   //accept either string or object material
   if (typeof material === "string") {
      var fn = material;
      material = materials[material];
      //Cannot continue if cannot find material data
      if (material === undefined) {
         console.log("Couldn't find data for material: " + fn);
         return;
      };
   }

   setSubTemplate(object, "material", material);
}

//Sets a sub-template. This is for things like forms and materials that
//allow an object to inherit several properties
function setSubTemplate(object, stName, stValue) {

   //Subtract the old values
   if (object[stName] !== undefined) {
      objectCombine(object, object[stName], function(a, b) {
         switch (typeof b) {
            case "number":
               if (a === undefined) a = 0;
               return a-b;
            break;

            case "array":
               if (a === undefined) a = [];
               for (var i in b) {
                  if (a.indexOf(b[i]) !== -1) {
                     a.splice(a.indexOf(b[i]), 1);
                  }
               }
               return a;
            break;

            case "object":
               if (a === undefined) a = {};
               for (var i in b) {
                  delete a[i];
               }
               return a;
            break;

            default:
               return a;
            break;
         }
      });
   }

   //Remove any events

   object[stName] = stValue;

   //Add the new values
   objectCombine(object, object[stName], function(a, b) {
      switch (typeof b) {
         case "number":
            if (a === undefined) a = 0;
            return a+b;
         break;

         case "array":
            if (a === undefined) a = [];
            for (var i in b) {
               a.push(b[i]);
            }
            return a;
         break;

         case "object":
            if (a === undefined) a = {};
            for (var i in b) {
               a[i] = b[i];
            }
            return a;
         break;

         default:
            return a;
         break;
      }
});
}

function isVisible(object) {
   if (is(object.parent.isRoom)) {
      return true;
   }

   if (not(object.parent.open)) {
      return false;   
   }

   return true;
}
