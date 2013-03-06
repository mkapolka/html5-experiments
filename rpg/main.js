//Global for organizing all the RPG specific values
var RPG = {};

function createThing(name)
{
   var thing = {};
   thing.name = name;
   return thing;
}

function describeThing(thing, method)
{
   var output = "This " + thing.name + "...\n"; 
   for (var p in thing.properties)
   {
      
   }
}

function getPropertyArchetype(name)
{
   return RPG.properties[name];
}

function describeProperty(name, property)
{
   var archetype = RPG.properties[name];

   if (archetype != null)
   {
      
   }
}
