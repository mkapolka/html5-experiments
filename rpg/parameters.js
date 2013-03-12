/*
Parameters.js is for storing all the information in the "parameters" global - 
how parameters should be named, what their actions are, etc.
*/
parameters = {
   //Something that is openable has some sort of latch or lid
   //that can be manipulated in order to open it
   openable : {
      values: {
         1: "can be opened",
      },
      default: 0,
      types: ["mechanical"],
      actionsStanding : {
         "Open" : function(me, caller) {
            moveAdjacentTo(caller, me);
            if (me.open === undefined || me.open < 1)
            {
               pushGameText("You open the " + me.name);
               me.open = 1;
            }
         },
         "Close" : function(me, caller) {
            moveAdjacentTo(caller, me);
            if (me.open > 0)
            {
               pushGameText("You close the " + me.name);
               me.open = 0;
            }
         }
      }
   },

   //Something that is open has its contents exposed with nothing in between
   //the value represents the size of the largest hole
   open : {
      values : {
         0: "is closed",
         1: "is open"
      },
      revealed_by: [
         "look"
      ],
      types: ["mechanical"],
      functions : {
         "jostle" : function(me, jostler, force) {
            if (me.contents !== undefined)
            {
               for (var i in me.contents)
               {
                  if (Math.random() < .1)
                  {
                     removeFromContainer(me.contents[i]);      
                  }
               }
            }
         }//jostle
      }//functions
   },

   //Object can be boiled. Higher value = requires more heat
   boilable: {
      values: {
         0: "would boil at room temperature",
         5: "would boil",
         6: "would boil if heated",
         10: "could conceivably boil"
      },
      default: 10,
      types: [ "physical" ],
      functions : {
         "tick": function(me) {
            if (is(me.hot) && not(me.boiling)) {
               if (isVisible(me)) {
                  pushGameText(me.name + " starts to boil");
               }
               me.boiling = 1;
            }
         }
      }
   },

   boiling : {
      values: {
         1: "is boiling"
      },
      revealed_by : [
         "look"
      ],
      default: 0,
      functions : {
         "tick" : function(me) {
            //TODO: Add boiling logic here
         }
      }
   },

   flammable : {
      values: {
         0: "is not flammable",
         1: "is flammable"
      },
      revealed_by : [
         "alchemy_knowledge"
      ],
      types : [
         "physical"
      ],
      functions : {
         "burn" : function(me) {
            if (me.burning === undefined) {
               pushGameText(me.name + " bursts into flames!");
               me.burning = 1;
            }

            if (me.burning < 1) {
               pushGameText(me.name + " bursts into flames!");
               me.burning += 1;
            }
         }
      }
   },

   hot: {
      values: {
         1: "is hot",
      },
      revealed_by : [
         "feel"
      ],
      types : [
         "physical",
      ],
      functions : {
         "tick" : function(me) {
            //TODO: Revisit heat mechanics
            if (me.contents !== undefined)
            {
               for (var o in me.contents) {
                  call(me.contents[o], "heat");
                  me.contents[o].hot = 1;
               }
            }

            if (me.parent !== undefined && Math.random() > .1)
            {
               //Sometimes heat parent
               if (Math.random() < .1) {
                  call(me.parent, "heat");
                  me.parent.hot = 1;
               }
            }

            //Small chance to cool down every tick
            if (Math.random() < .1) {
               call(me, "cool");
               me.hot = undefined;
            }
         } 
      }
   },

   burning: {
      values : {
         1: "is on fire!",
      },
      revealed_by: [
         "look","feel"
      ],
      types : [
         "physical",
      ],
      functions : {
         "tick": function(me) {
            var touching = getTouchingObjects(me);
            for (var i in touching) {
               if (!touching[i].hot) touching[i].hot = 1;
               call(touching[i], "heat", me.burning);
               call(touching[i], "burn", me.burning);
            }

            call(me, "burn", me.burning);

            if (Math.random() < .2) {
               pushGameText(me.name + "'s flames die out");
               me.burning -= 1;
            }
         }
      }
   },

   phlogiston: {
      values : {
         1: "would be consumed by a fire",
      },
      revealed_by: [
         "alchemy_knowledge"
      ],
      types : [
         "physical",
      ],
      default: 0,
      functions : {
         "burn" : function(me, amount) {
            if (me.burning > 0) {
               if (Math.random() < .001) {
                  deleteObject(this);
                  pushGameText(me.name + " was consumed by fire!");
               }
            }
         }
      }
   },

   dense : {
      values: {
         1: "is quite dense"
      },
      types : [
         "physical"
      ],
      revealed_by: [
         "feel"
      ]
   },

   hard: {
      values: {
         1: "is very hard",
      },
      types : [
         "physical"
      ],
      revealed_by : [
         "feel"
      ]
   },

   soft: {
      values: {
         1: "is very soft",
      },
      types : [
         "physical"
      ],
      revealed_by : [
         "feel"
      ],
      functions : {
         "tick" : function(me) {
            if (me.hard > 1) {
               me.hard = undefined;
               me.soft = undefined;
            }
         }
      }
   },

   big : {
      values: {
         1: "is very big"
      },
      revealed_by : [
         "look"
      ]
   },

   small : {
      values: {
         1: "is quite little"
      },
      revealed_by : [
         "look"
      ],
      functions : {
         "tick" : function(me) {
            if (me.large > 0){
               me.large = undefined;
               me.small = undefined;
            }
         }
      }
   },

   //TODO: Going purist about durability for now, but maybe revisit
   //and turn durability into integer logic? Durability is an understandable
   //enough concept after all
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
         1: "can be dissolved into water",
      },
      revealed_by : [
         "alchemy_knowledge"
      ],
      types : [
         "physical"
      ],
      default: 0,
      functions : {
         "tick" : function(me) {
            var touching = getTouchingObjects(me);
            for (t in touching) {
               if (touching[t].isLiquid > 0 && touching[t].hot > 0) {
                  pushGameText(me.name + " dissolves into " + touching[t].name);
                  dissolve(me, touching[t]);
                  return;
               }
            }
         },
         "jostle" : function(me, jostler, amount) {
            var touching = getTouchingObjects(me);
            for (var t in touching) {
               if (touching[t].isLiquid > 0) {
                  pushGameText(me.name + " dissolves into " + touching[t].name);
                  dissolve(me, touching[t]);
                  return;
               }
            }
         }
      }
   }, // soluble

   calming : {
      values: {
          1: "has calming properties",
      },
      revealed_by : [
         "alchemy_knowledge"
      ],
      types: [
         "chemical"
      ],
      default: 0
   }, 

   //TODO: Intereing logic for these chemical properties
   astringent : {
      values: {
          1: "has astringent properties",
      },
      revealed_by : [
         "alchemy_knowledge"
      ],
      types: [
         "chemical"
      ],
      default: 0
   }, 

   angering : {
      values: {
          1: "has rage-inducing properties",
      },
      revealed_by : [
         "alchemy_knowledge"
      ],
      types: [
         "chemical"
      ],
      default: 0
   }, 

   hunger_inducing : {
      values: {
          1: "has hunger-inducing properties",
      },
      revealed_by : [
         "alchemy_knowledge"
      ],
      types: [
         "chemical"
      ],
      default: 0
   }, 

   anaesthetic : {
      values: {
          1: "has anaesthetic properties",
      },
      revealed_by : [
         "alchemy_knowledge"
      ],
      types: [
         "chemical"
      ],
      default: 0
   }, 

   isLiquid : {
      values : {
         1: "is a liquid"
      },
      revealed_by : [
         "look",
      ],
      functions : {
         "tick" : function(me) {
            if (not(me.parent.watertight)) {
               setGameText(me.name + " spills out of the " + me.parent.name);
               removeFromContainer(me);
            }
            var to = getTouchingObjects(me);
            for (var i in to) {
               to[i].wet = 0;
               call(to[i], "dampen");
            }
         }, 
         "enteredContainer" : function(me, container) {
            if (not(container.watertight) && not(container.isRoom)) {
               pushGameText(me.name + " spills out of the " + me.parent.name);
               removeFromContainer(me); 
               return;
            }

            var touching = getTouchingObjects(me);

            for (var t in touching) {
               if (touching[t].isLiquid > 0) {
                  var combined = combineLiquids(me, touching[t]);
                  deleteObject(me);
                  deleteObject(touching[t]);
                  setContainer(combined, me.parent);
                  return;
               }
            }
         }
      }
   },

   wet : {
      values : {
         1: "is wet",
      },
      revealed_by : [
         "feel", "look"
      ],
      functions : {
         "tick" : function(me) {
            var amount = .2;
            if (me.hot > 0) {
               amount = .5;
            }
            if (Math.random() < amount) {
               call(me, "dry");
            }
         }, 
         "dampen" : function(me) {
            if (me.wet < 1) {
               me.wet = 1;
               me.flammable -= 1;
            }
         },
         "dry" : function(me) {
            if (me.wet >= 1) {
               me.wet -= 1;
               me.flammable += 1;
            }
         },
         "burn" : function(me) {
            pushGameText(me.name + " sizzles");
            call(me, "dry");
         }
      }
   },

   contents : {
      actionsHeld : {
           "Pour" : function(me, caller, target) {
              if (target.contents !== undefined) {
                 pushGameText("You pour the contents of " + me.name + " into " + target.name);  
                 for (var v in me.contents) {
                    setContainer(me.contents[v], target);
                 }
              } else {
                 pushGameText("Cannot pour " + me.name + " into that!");
              }
           }
        }
      }
}
