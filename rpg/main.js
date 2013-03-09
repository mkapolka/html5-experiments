//Global for organizing all the RPG specific values
var RPG = {};

function createThing(name)
{
   var thing = {};
   thing.name = name;
   return thing;
}

function getPropertyArchetype(name)
{
   return RPG.properties[name];
}

function duplicateObject(object)
{
   var output = {};

   for (var k in object)
   {
      if (typeof(object[k]) !== "number")
      {
         output[k] = duplicateObject(object[k]);
      } else {
         output[k] = object[k];
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
