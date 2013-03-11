templates = {};

room =  {
   name: "The Room",
   form: "room",
   contents: [],
   isRoom: true
}

player = {
   name: "You, the player",
   form: "player",
   contents: [],
   holding: undefined
}


templates.burning_thing = {
   name: "a burning thing",
   form: "none",
   temperature: 10,
   flammable: 5,
   burning: 5,
   phlogiston: 10,
   durability: 10
}

templates.lavender = {
   name: "lavender bush",
   form: "lavender",
   material: "plant",
   state: "solid",
   flammable: 3,
   temperature: 5,
   phlogiston: 10,
   aromatic: 5,
   calming: 6,
   edible: 4,
   soluble: 7,
   size: 3,
   density: 0,
   durability: 10,
}

templates.fire_pit = {
   form: "fire pit",
   name: "fire pit",
   material: "stone",
   state: "solid",
   flammable: 0,
   density: 9,
   hardness: 7,
   size: 8,
   temperature: 10,
   hollow: 10,
   contents : [],
   durability: 10
}

templates.water = {
   form: "water",
   name: "water",
   material: "water",
   state: "liquid",
   density: 5,
   temperature: 5,
   boilable: 6,
   isWater: 10
}

templates.tea_kettle = {
   form: "tea kettle",
   name: "tea kettle",
   material: "metal",
   state: "solid",
   flammable: 0,
   density: 5,
   hardness: 8,
   hollow: 10,
   size: 4,
   watertight: 9,
   openable: 10,
   temperature: 5,
   contents : ["water"],
   durability: 10
}

parameters = {
   openable : {
      values: {
         1: "can be opened",
      },
      default: 0,
      types: ["mechanical"],
      functions : {
         "open" : function(me) {
            if (me.opened === undefined || me.opened < 1)
            {
               pushGameText(me.name + " was opened");
               me.open = 1;
            }
         },
         "close" : function(me) {
            if (me.opened !== undefined || me.opened > 0)
            {
               pushGameText(me.name + " was closed");
               me.open = undefined;
            }
         }
      }
   },

   open : {
      values : {
         0: "is closed",
         1: "is open"
      },
      types: ["mechanical"],
      functions : {
         "jostle" : function(me, jostler, force) {
            if (me.contents !== undefined)
            {
               for (var i in me.contents)
               {
                  if (Math.random() < .1)
                  {
                     
                  }
               }
            }
         }//jostle
      }//functions
   },

   boilable: {
      values: {
         0: "would boil at room temperature",
         5: "would boil",
         6: "would boil if heated",
         10: "could conceivably boil"
      },
      default: 10,
      types: [ "chemical" ],
      functions : {
         "tick": function(me) {
            var temp = param_safe_get(me, "temperature");
            var boiling = param_safe_get(me, "boiling");
            if (temp > me.boilable && boiling <= 1)
            {
               pushGameText(me.name + " started boiling!");
               me.boiling = 10;
            }
         }
      }
   },

   boiling : {
      values: {
         5: "is boiling"
      },
      revealed_by : [
         "look"
      ],
      default: 0
   },

   flammable: {
      values: {
         0: "is completely inflammable",
         5: "is flammable",
         7: "is highly flammable",
         10: "is extremely flammable",
      },
      revealed_by : [
         "alchemy_knowledge"
      ],
      functions : {
         "tick" : function(me)  {
            if (me.temperature > param_invert("flammable", me.flammable) && !me.burning > 0)
            {
               pushGameText("The " + me.name + " bursts into flames!");
               me.burning = me.flammable;
            }
         }
      }
   },

   temperature: {
      values: {
         0: "is ice cold",
         5: "is lukewarm",
         7: "is quite hot",
         8: "is radiating waves of heat",
         10: "is faintly glowing with extreme heat"
      },
      revealed_by : [
         "feel", "look"
      ],
      functions : {
         "tick" : function(me) {
            if (me.contents !== undefined)
            {
               if (!Array.isArray(me.contents)) console.log("Temperature.tick: Contents not array! What happened?");
               var total_temp = me.temperature;
               var total_items = 1;
               for (var o in me.contents)
               {
                  var content = me.contents[o];
                  total_temp += content.temperature; 
                  total_items += 1;
               }

               var average_temp = total_temp / total_items;
               //me.temperature = average_temp;

               for (var o in me.contents)
               {
                  //me.contents[o].heat = average_temp;
                  me.contents[o].temperature = me.temperature;
                  call(me.contents[o], "heat", me.temperature);
               }
            }

            if (me.parent !== undefined)
            {
               call(me.parent, "heat", me, me.temperature);
            }
         }, 
         "heat" : function(me, caller, amount) {
            if (me === caller) return;
            if (me.temperature < amount) {
               me.temperature = amount;
            }
         }
      }
   },

   burning: {
      values : {
         1: "is flickering with small flames",
         5: "is on fire!",
         10: "is covered in powerful flames!",
      },
      revealed_by: [
         "look",
      ],
      functions : {
         "tick": function(me) {
            call(me, "burn", me.burning);
         }
      }
   },

   phlogiston: {
      values : {
         1: "would easily shrug off a fire",
         5: "would be consumed by a fire",
         10: "would blink out of existence at the sight of a fire"
      },
      revealed_by: [
         "alchemy_knowledge"
      ],
      default: 0,
      functions : {
         "burn" : function(me, amount) {
            var phlog = param_safe_get(me, "phlogiston") * .1;
            call(me, "damage", amount * phlog);
         }
      }
   },

   density: {
      values: {
         0: "is almost insubstantial",
         4: "is fairly dense",
         10: "is extremely dense"
      }, 
      revealed_by : [
         "feel"
      ]
   }, 

   hardness: {
      values: {
         0: "is as soft as down",
         5: "is somewhat hard",
         10: "feels impenetrable"
      },
      revealed_by : [
         "feel"
      ]
   },

   size: {
      values: {
         0: "is almost invisibly tiny",
         1: "is as small as an acorn",
         2: "is no bigger than a fist",
         3: "is not bigger than a skull",
         5: "is about the size of a person",
         10: "is about as big as a house"
      }, 
      revealed_by : [
         "look"
      ]
   },

   durability: {
      values: {
         1: "is hanging onto existence by a string",
         5: "is quite damaged",
         10: ""
      },
      revealed_by: [
         "look",
      ],
      default: 10,
      functions : {
         "damage" : function(me, amount)
         {
            me.durability -= amount;

            if (me.durability < 0)
            {
               pushGameText(me.name + " is destroyed!");
               deleteObject(me);
               updateTileText(room);
            }
         }
      }
   },

   soluble : {
      values: {
         0: "would disintigrate the moment it touched water",
         5: "could be dissolved into water",
         10: "could, theoretically, dissolve into water"
      },
      revealed_by : [
         "alchemy_knowledge"
      ],
      default: 5,
      functions : {
         "tick" : function(me) {
            if (me.parent !== undefined && me.parent.contents !== undefined) {
               for (var i in me.parent.contents)
               {
                  if (me.parent.contents[i].state === "liquid")
                  {
                     if (me.parent.contents[i].temperature > me.soluble)
                     {
                        pushGameText(me.name + " dissolves into " + me.parent.contents[i].name);
                        chemParams = getParamsByType(me, "chemical");
                        for (var j in chemParams)
                        {
                           if (me.parent.contents[i][chemParams[j]] == undefined) {
                              me.parent.contents[i][chemParams[j]] = 0;
                           }
                           me.parent.contents[i][chemParams[j]] += me[chemParams[j]];
                        }
                        deleteObject(me);
                     }
                  }
               }
            }
         }
      }
   }, // soluble

   calming : {
      values: {
          0: "has no calming properties",
          5: "has some calming properties",
          7: "has very strong calming properties"
      },
      revealed_by : [
         "alchemy_knowledge"
      ],
      types: [
         "chemical"
      ],
      default: 0
   }, 

   isWater : {
      functions : {
         "tick" : function(me) {
            var to = getTouchingObjects(me);
            for (var i in to) {
               if (to[i].wet === undefined) to[i].wet = 0;
               if (to[i].wet < me.isWater) {
                  call(to[i], "dampen", 2);
               }
            }
         }
      }
   },

   wet : {
      values : {
         1: "is a little damp",
         5: "is a bit wet",
         7: "is soaked through"
      },
      revealed_by : [
         "feel", "look"
      ],
      functions : {
         "tick" : function(me) {
            if (me.temperature > 5) {
               call(me, "dampen", -1);
            }
         }, 
         "dampen" : function(me, amount) {
            if (amount > 0) {
               pushGameText(me.name + " gets a bit wetter.");
            } else {
               pushGameText(me.name + " dries out a bit.");
            }

            me.wet += amount;
            me.flammable -= amount;
         }
      }
   }
}

forms = {
   "player" : {
      name: "player",
      symbol: "@",
      actions : {
         "move" : {
            
         }
      }
   }
}
