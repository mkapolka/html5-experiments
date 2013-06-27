//The default value when a parameter doesn't define its own default value
var DEFAULT_DEFAULT_VALUE = 5;

function not(value) {
   return !is(value);
}

function is(value) {
   if (value === undefined) {
      return false;
   } else {
      switch (typeof value) {
         case "boolean":
            return value;
         break;

         case "number":
            return value > 0;
         break;

         case "string":
            return true;
         break;

         case "object":
            return true;
         break;

         case "undefined":
            return false;
         break;
      }
   }
}

function add(object, paramName) {
   if (object[paramName] === undefined) {
      object[paramName] = 0;
   }
   
   object[paramName]++;

   if (parameters[paramName]!==undefined 
      && parameters[paramName].functions !== undefined
      && parameters[paramName].functions.add !== undefined) {
      parameters[paramName].functions.add(object);
   }
}

function sub(object, paramName) {
   if (object[paramName] === undefined) {
      object[paramName] = 0;
   }
   
   object[paramName]--;

   if (parameters[paramName]!==undefined 
      && parameters[paramName].functions !== undefined
      && parameters[paramName].functions.sub !== undefined) {
      parameters[paramName].functions.sub(object);
   }
}

function del(object, paramName) {
   if (object[paramName] === undefined) {
      return;
   }

   if (parameters[paramName]!==undefined 
      && parameters[paramName].functions !== undefined
      && parameters[paramName].functions.sub !== undefined) {
      parameters[paramName].functions.sub(object);
   }

   delete object[paramName];

}

function call(caller, method, dotdotdot)
{
   if (typeof caller !== "object") console.log("bad caller in call(), arguments:", arguments);

   //Allow us to pass down multiple arguments to whatever method we found
   //without having to bundle them up in an array or w/e
   function call_method(method, args) {
      switch (args.length - 2)
      {
         case 0:
            method(caller);
         break;

         case 1:
            method(caller, args[2]);
         break;

         case 2:
            method(caller, args[2], args[3]);
         break;

         case 3:
            method(caller, args[2], args[3], args[4]);
         break;

         case 4:
            method(caller, args[2], args[3], args[4], args[5]);
         break;

         default:
            console.log("call() cannot take more than 4 parameters at the moment");
         break;
      }
   }

   //Object-specific functions
   if (caller.functions && caller.functions[method]) {
      call_method(caller.functions[method], arguments);
   }

   for (var p in caller)
   {
      if (caller.isDestroyed) return;
      if (parameters[p] !== undefined && parameters[p].functions !== undefined)
      {
         if (parameters[p].functions[method] !== undefined)
         {
            var m = parameters[p].functions[method];
            call_method(m, arguments);
         }
      }
   }
}

//Places the object inside the container.
//The container should be an object or room.
function setContainer(object, container)
{
   if (!object) {
      throw "Undefined object passed to setContainer";
   }

   //Fix for when duplicating objects copies over the "parent" value
   if (object.parent !== undefined &&
         object.parent.contents.indexOf(object) === -1) {
      object.parent = undefined;
   }
   //Nowhere to go
   if (object.parent === container) return;

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
   call(container, "addedObject", object);
   call(object, "enteredContainer", container);
}

//Moves this object into the container above itself
//Return true if successful, false otherwise
function removeFromContainer(object) {
   if (not(object.parent.isRoom)) {
      var oldParent = object.parent;
      setContainer(object, object.parent.parent);
      moveObject(object, oldParent.x, oldParent.y, false);
      return true;
   }

   return false;
}

function moveObject(object, x, y, callActions)
{
   object.x = x;
   object.y = y;

   var room = getRoom(object);
   if (room !== undefined) {
      if (object.x < 0) object.x = 0;
      if (object.y < 0) object.y = 0;
      if (object.x > room.width) object.x = room.width - 1;
      if (object.y > room.height) object.y = room.height - 1;
   }

   if (object.contents !== undefined)
   {
      for (var i in object.contents)
      {
         moveObject(object.contents[i], x, y, callActions);
      }
   }

   if (callActions) {
      call(object, "move", x, y);

      //if (Math.random() < .3) {
         //call(object, "jostle");
      //}
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
            output[v] = object[v];
         break;

         case "object":
            if (Array.isArray(object[v])) {
               output[v] = object[v].slice();
            } else {
               output[v] = object[v];
            }
         break;
      }
   }

   return output;
}

//Removes the object from the game. And optionally 
//keeps the contents around. keepContents defaults to true
//because that is the expected default in the game logic
function deleteObject(object, keepContents)
{
   if (keepContents === undefined) keepContents = true;
   if (object.parent === undefined) return;
   if (object.contents && keepContents) {
      var toRemove = object.contents.slice();
      for (var v in toRemove) {
         removeFromContainer(toRemove[v]);
      }
   }
   object.isDestroyed = true;
   setContainer(object, undefined);
}

//Iterates over all the properties of the two object, calling callback on every property
//the callback has the form: callback(valueA, valueB) and its return value will become objectTo's
//value for that property
function combine(objectTo, objectFrom, callback) {
   for (var o in objectFrom) {
      objectTo[o] = callback(objectTo[o], objectFrom[o]);
   }
}


//Combines two objects, but only the parameters that match a certain type
//Callback takes the form function(objectA, objectB, propertyName, typeof)
function combineByType(output, objectA, objectB, types, callback) {
   if (callback === undefined) {
      callback = function(a, b, prop, type) {
         switch (type) {
            case "number":
               if (a[prop] === undefined) return b[prop];
               if (b[prop] === undefined) return a[prop];
               return Math.max(a[prop],b[prop]);
            break;

            default:
               return a[prop];
            break;
         }
      }
   }
   var parms = {};

   var paramsA = [];
   var paramsB = [];
   if (typeof types === "object") {
      for (var a in types) {
         paramsA = paramsA.concat(getParamsByType(objectA, types[a]));
         paramsB = paramsB.concat(getParamsByType(objectB, types[a]));
      }
   } else {
      paramsA = getParamsByType(objectA, types);
      paramsB = getParamsByType(objectB, types);
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

//Merges object B into object A, destroying objectB and transferring
//properties with the specified types into object A
function mergeObject(objectA, objectB, types) {
   combineByType(objectA, objectA, objectB, types);
   deleteObject(objectB);
   return objectA;
}

function mergeBySize(objectA, objectB, types) {
   var cmp = sizeCompare(objectA, objectB);
   var bigger, smaller;
   switch(cmp) {
      case -1:
         bigger = objectB;
         smaller = objectA;
      break;

      case 0:
         if (Math.random() < .5) {
            bigger = objectB;
            smaller = objectA;
         } else {
            bigger = objectA;
            smaller = objectB;
         }
      break;

      case 1:
         bigger = objectA;
         smaller = objectB;
      break;
   }

   return mergeObject(bigger, smaller, types);
}

//Returns -1 if objectA < objectB,
//Returns 1 if objectA > objectB
//Returns 0 if objectA == objectB
function sizeCompare(objectA, objectB) {
   if (is(objectA.big) && not(objectB.big)) {
      return 1; 
   } else 
   if (is(objectB.big) && not(objectA.big)) {
      return -1;
   } else 
   if (is(objectA.small) && not(objectB.small)) {
      return -1;
   } else 
   if (is(objectB.small) && not(objectA.small)) {
      return 1;
   } else {
      return 0;
   }
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
   if (typeof method === "string") method = [method];
   var output = [];
   output[0] = object.name + "...";
   var props_revealed = 0;
   for (var k in object)
   {
      if (parameters[k] !== undefined && parameters[k].revealed_by !== undefined)
      {
         if (parameters[k].revealed_by.some(function(a) {
            return method.indexOf(a) !== -1;
         }))
         {
            //Functions for describing non-number values
            if (typeof parameters[k].values == "function") {
               last = parameters[k].values(object[k], object);
            } else {
               //Use array to describe everything else
               //TODO: Revisit description mechanics in light of new non-integer
               //game logic
               var last = "";
               for (var i in parameters[k].values)
               {
                  if (i <= object[k])
                  {
                     last = parameters[k].values[i];
                  }
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

   if (props_revealed === 0)
   {
      //output = "You cannot discern anything about this object in this way!";
      output[0] = "You cannot discern anything about " + object.name + " in this way!";
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


//Returns the types of the parameter with this name
function getParamTypes(param_name)
{
   if (parameters[param_name] === undefined) return [];
   return parameters[param_name].types;
}

//Returns an array of the names of the properties
//as strings
function getParamsByType(object, type)
{
   var output = [];
   for (var i in object)
   {
      var types = getParamTypes(i);
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
      moveObject(mover, tx, ty, true);
   }
}

function doTick(room)
{
   //Tick all rooms by default
   if (room === undefined) {
      for (var v in rooms) {
         doTick(rooms[v]);
      }

      var gt = $(".gametext");
      gt.removeClass("gametext");
      $("#textcontainer").prepend("<hr>");
      $("#textcontainer").prepend("<ul class='gametext'></ul>");
      
      setHoverTextTile(getRoom(getPlayer()), hoveredTileX, hoveredTileY);
      return;
   }

   cull = [];
   for (var i in room.contents) {
      function callTick(obj)
      {
         if (obj.isDestroyed){ cull.push(obj); return; };
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

   for (var i in cull) {
      room.contents.splice(room.contents.indexOf(cull[i]), 1);
   }

}

function getGlyph(object)
{
   if (object === undefined) return ".";
   if (object.symbol !== undefined) {
      return object.symbol;
   }

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

   if (output.holding !== undefined) {
      output.holding = createObjectFromTemplate(output.holding);
   }

   return output;
}

function getObjectsTouching(object) {
   if (object.parent === undefined) return [];
   if (object.parent.isRoom) return [];
   if (object.parent.contents !== undefined)
   {
      var output = [];

      for (var i in object.parent.contents){
         if (object.parent.contents[i] !== object) {
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
         var actions;
         if (typeof parameters[i].actionsStanding === "function") {
            actions = parameters[i].actionsStanding(object);
         } else {
            actions = parameters[i].actionsStanding;
         }

         for (var a in actions) {
            output[a] = actions[a];
         }
      }
   }
   return output;
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
      combine(object, object[stName], function(to, from) {
         switch (typeof from) {
            case "number":
               if (to === undefined) to = 0;
               return to-from;
            break;

            case "array":
               if (to === undefined) to = [];
               for (var i in from) {
                  if (to.indexOf(from[i]) !== -1) {
                     to.splice(to.indexOf(from[i]), 1);
                  }
               }
               return to;
            break;

            case "object":
               if (to === undefined) to = {};
               for (var i in from) {
                  delete to[i];
               }
               return to;
            break;

            default:
               return to;
            break;
         }
      });
   }

   //Remove any events

   object[stName] = stValue;

   //Add the new values
   combine(object, object[stName], function(to, from) {
      switch (typeof from) {
         case "number":
            if (to === undefined) to = 0;
            return to+from;
         break;

         case "array":
            if (to === undefined) to = [];
            for (var i in from) {
               to.push(from[i]);
            }
            return to;
         break;

         case "object":
            if (to === undefined) to = {};
            for (var i in from) {
               to[i] = from[i];
            }
            return to;
         break;

         default:
            if (to === undefined) return from;
            if (from === undefined) return to;
            return to;
         break;
      }
});
}

function getVisibleObjectsAt(x,y,seer) {
   return getObjectsAt(getRoom(seer), x, y, true).filter(function(a) {
      return isVisible(a, seer);
   });
}

function getVisibleObjects(seer) {
   return getRoom(seer).contents.filter(function(a) {
      return isVisible(a,seer);
   });
}

function isVisible(object, seer) {
   if (getRoom(object) !== getRoom(seer)) return false;

   var f = function(me) {
      if (!me.parent) return true;
      if (me.parent === seer.parent) return true;
      if (not(me.parent.open)) return false;
      return f(me.parent);
   }

   return f(object);
}

function getRoom(object) {
   //Topmost object is the best we can do
   if (object === undefined || is(object.isRoom)) {
      return object;
   } else {
      return getRoom(object.parent);
   }
}

function eat(who, target) {
   if (!who || !target) return;
   
   if (who.contents) {
      setContainer(target, who);
   }

   call(who, "eat", target);
}

function getPronoun(object, type) {
   if (is(object.male)) {
      switch (type) {
         case "his":
            return "his";
         break;

         case "him":
            return "him";
         break;

         case "he's":
            return "he's";
         break;

         case "he":
            return "he";
         break;
      }
   } else if (is(object.female)) {
      switch (type) {
         case "his":
            return "her";
         break;

         case "him":
            return "her";
         break;

         case "he's":
            return "she's";
         break;

         case "he":
            return "she";
         break;
      }
   } else {
      switch (type) {
         case "his":
            return "its";
         break;

         case "him":
            return "it";
         break;

         case "he's":
            return "it's";
         break;

         case "he":
            return "it";
         break;
      }
   }
}

//Removes the specified object from this array, in place.
//WARNING: Does not preserve order
function arrayRemove(array, object) {
   var index = array.indexOf(object);
   if (index === -1) return;
   var t = array[0];
   array[0] = object;
   array[index] = t;
   array.shift();
}

function pickRandom(array) {
   if (array === undefined) return undefined;

   //Array is actually an object, convert to array
   var a;
   if (array.length === undefined) {
      a = [];
      for (var v in array) {
         a.push(array[v]);
      }
   } else {
      a = array;
   }

   if (a.length === 0) return undefined;

   return (a[Math.floor(Math.random() * a.length)]);
}

function getBrainOwner(brain) {
   if (!(brain.parent)) return undefined;
   if (not(brain.parent.animated)) return undefined;
   return brain.parent;
}

function getPlayerBrain() {
   return getBrain(getPlayer());
}

function getBrain(object) {
   for (var v in object.contents) {
      if (is(object.contents[v].sentient)) {
         return object.contents[v];
      }
   }
}

function canCarry(object) {
   if (not(object.isLiquid) && not(object.isGas) && not(object.rooted)) {
      return true;
   }

   return false;
}

function scatter(objects, range) {
   for (var v in objects) {
      moveRandom(objects[v], range);
   }
}

function moveRandom(object, range) {
      var dx = Math.floor(-range + (Math.random() * range * 2));
      var dy = Math.floor(-range + (Math.random() * range * 2));
      var tx = object.x + dx;
      var ty = object.y + dy;

      moveObject(object, tx, ty);
}

function getNearest(object) {
   if (not(object.parent.isRoom)) {
      return pickRandom(object.parent.contents);
   }

   var contents = object.parent.contents.slice();

   var sorted = contents.sort(function(a,b) {
      var ax = Math.abs(a.x - object.x); 
      var ay = Math.abs(a.y - object.y); 
      var bx = Math.abs(b.x - object.x); 
      var by = Math.abs(b.y - object.y); 
      
      var ad = ax * ax + ay * ay;
      var bd = bx * bx + by * by;

      if (ad > bd) {
         return 1;
      } else if (ad < bd) {
         return -1;
      } else {
         return 0;
      }
   });

   sorted.splice(sorted.indexOf(object), 1);

   return sorted[0];
}

function isWithin(who, target, range) {
   var dx = Math.abs(who.x - target.x);
   var dy = Math.abs(who.y - target.y);
   var dt = Math.sqrt(dx * dx + dy * dy);

   return range < dt;
}

//Was pushGameText originally,
//this allows an object to notify the player that something
//happened. "wavelengths" is a property that allows for filtering
function say(message, sender, wavelengths) {
   if (!sender) {
      console.log("I won't say anything if I don't have a sender.");
      return;
   }

   if (typeof wavelengths === "string") {
      wavelengths = [wavelengths];
   }
   
   var push = false;
   wavelengths.forEach(function(a) {
      switch (a) {
         case "say":
            if (isVisible(sender, getPlayer())){
               push = true;
            }
         break;

         case "see":
            if (isVisible(sender, getPlayer())) {
               push = true;
            }
         break;

         //Something the player did, always show
         case "do":
            push = true;
         break;

         case "feel":
            if (sender === getPlayer() && not(getPlayer().numb)) {
               push = true;
            }
         break;
      }
   });

   if (push) {
      pushGameText(message);
   }
}

function getObjectsAt(room, x, y, contents)
{
   var output = [];
   for (var i in room.contents)
   {
      var obj = room.contents[i];
      if (obj.x == x && obj.y == y)
      {
         output.push(obj);

         if (contents && obj.contents !== undefined)
         {
            for (var o in obj.contents)
            {
               output.push(obj.contents[o]);
            }
         }
      }
   }
   return output;
}

//Contains objects so their index can be used as a UID
randUIDs = [];
//Contains random value information. keys should be UID + calling method
rands = {};
//Returns true roughly every "calls" times it is called,
//with the actual randomness determined by randomness.
//0 randomness means it will always return true after
//"calls" calls and 1 means it has an even likelyhood
//on every call. id is a value to keep track of who is
//calling this method. this needs to be unqiue for every
//check that is done
function rand(calls, randomness) {
   var me = rand.caller.arguments[0];
   if (!me) throw "rand() not called in a proper context!";
   var uid = randUIDs.indexOf(me);
   if (uid === -1) uid = randUIDs.push(me) - 1;
   var object = "" + uid + rand.caller;

   if (!rands[object]) { rands[object] = 0; }
   var r = rands[object];

   var target = 1 - (1 / calls);
   var roll = (r * (1 - randomness)) + (Math.random() * randomness);
   if (roll >= target) {
      rands[object] = 0;
      return true;
   } else {
      rands[object] += 1 / calls;
      return false;
   }
}

function lendProperties(lendee, lender, type) {
   var ptypes = getParamsByType(lender, type);
   for (var v in ptypes) {
      lendee[ptypes[v]] = lender[ptypes[v]];
      delete lender[ptypes[v]];
   }
}
