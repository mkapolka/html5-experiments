//The default value when a parameter doesn't define its own default value
var DEFAULT_DEFAULT_VALUE = 5;


function addToContainer(object, containing_object)
{
   containing_object.container.push(object);

   //check for liquids to merge
   if (object.state === "liquid")
   {
      container_liquids(object, containing_object);
   }
}

function container_liquids(object, containing_object)
{
   for (var i in containing_object.contents)
   {
      var other = containing_object.contents[i];
      if (other.state === "liquid")
      {
         mergeObjects(object, other, true);
      }
   }
}

function tick(object) {
   if (object.temperature !== undefined)
   {
      temperature_tick(object);    
   }
}

function temperature_tick(object)
{
   if (object.contents !== undefined)
   {
      if (!Array.isArray(object.contents)) console.log("Contents not array! What happened?");
      var total_temp = object.temperature;
      var total_items = 1;
      for (var o in object.contents)
      {
         var content = object.contents[o];
         total_temp += content.temperature; 
         total_items += 1;
      }

      var average_temp = total_temp / total_items;
      object.temperature = average_temp;

      for (var o in object.contents)
      {
         object.contents[o].temperature = avarage_temp;
      }
   }
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

function getRemainingCapacity(object)
{
   if (object.contents !== undefined && Array.isArray(object.contents))
   {
      var capacity = getObjectCapacity(object);

      //Get total size of contents
      var total_size = 0;
      for (var c in object.contents)
      {
         var content = object.contents[c];
         var cs = content.size === undefined?1:content.size;
         total_size = cs;
      }

      if (total_size > capacity)
      {
         return 0;
      } else {
         return capacity - total_size;
      }
   } else {
      return undefined;
   }
}

function canContainerFit(object, container)
{
   var os = object.size === undefined?1:object.size;
   return getRemainingCapacity(container) >= os;
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
   if (Array.isArray(object.parent))
   {
      object.parent.splice(object.parent.indexOf(object));
   } else { //must be an object
      for (var o in object.parent)
      {
         if (object.parent[o] === object)
         {
            delete object.parent[o];
         }
      }
   }
}

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
      if (descriptions[k] !== undefined && descriptions[k].revealed_by !== undefined)
      {
         if (descriptions[k].revealed_by.indexOf(method) !== -1)
         {
            var last = "";
            for (var i in descriptions[k].values)
            {
               if (i <= object[k])
               {
                  last = descriptions[k].values[i];
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
      if (descriptions[p] !== undefined && descriptions[p].functions !== undefined)
      {
         if (descriptions[p].functions[method] !== undefined)
         {
            var m = descriptions[p].functions[method];
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

function param_invert(param_name, value)
{
   if (descriptions[param_name] !== undefined && descriptions[param_name].max_value !== undefined)
   {
      return value - descriptions[param_name].max_value;
   }

   return 10 - value;
}

function param_safe_get(who, param_name)
{
   if (who[param_name] !== undefined)
   {
      return who[param_name];
   } else {
      if (descriptions[param_name] !== undefined)
      {
         if (descriptions[param_name].default !== undefined)
         {
            return descriptions[param_name].default;
         } else {
            return DEFAULT_DEFAULT_VALUE;
         }
      }
   }
}

function get_string_template(param_name, param_value)
{
   if (descriptions[param_name] !== undefined)
   {
      return descriptions[param_name][param_value];
   }
}

function get_param_types(param_name)
{
   if (descriptions[param_name] === undefined) return [];
   return descriptions[param_name].types;
}

function get_params_by_type(object, type)
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

function doTick()
{
   for (var i in game_objects) {
      call(game_objects[i], "tick"); 
   }
}