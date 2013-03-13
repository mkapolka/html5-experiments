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
      revealed_by : [
         "look"
      ],
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
         "jostle" : function(me, jostler) {
            if (me.contents !== undefined)
            {
               for (var i in me.contents)
               {
                  if (Math.random() < .5)
                  {
                     pushGameText(me.contents[i].name + " falls out of " + me.name);
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

   holding : {
      revealed_by : [
         "look"
      ],
      values : function(value) {
         if (value !== undefined) {
            return "is holding " + value.name;
         } else {
            return "";
         }
      },
      functions : {
         "move" : function(me, x, y) {
            if (is(me.holding)) {
               moveObject(me.holding, x, y, true);
            }
         },
         "pickup" : function(me, object) {
            if (not(me.holding)) {
               pushGameText(me.name + " picks up " + object.name);
               moveObject(object, me.x, me.y);
               me.holding = object;
               object.obscured = 1;
            }
         }, 
         //Drop whatever this being is holding
         "drop" : function(me) {
            if (is(me.holding)) {
               pushGameText(me.name + " drops " + me.holding.name);
               moveObject(me.holding, me.x, me.y, true);
               setContainer(me.holding, me.parent);
               me.holding.obscured = 0;
               me.holding = undefined;
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

            if (Math.random() < .2 && not(me.flameEternal)) {
               pushGameText(me.name + "'s flames die out");
               me.burning -= 1;
            }
         }
      }
   },

   flameEternal : {
      values : {
         1: "will burn until the end of time"
      },
      revealed_by : [
         "magic_knowledge"
      ],
      types : [
         "magical"
      ]
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

   hard : {
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

   soft : {
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
         },
         "slash" : function(me, attacker) {
            if (is(me.contents) && not(me.open)) {
               if (me.open === undefined) me.open = 0;
               pushGameText(me.name + " is slashed open!");
               me.open +=1;
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
            if (not(me.parent.watertight) && not(me.parent.isRoom)) {
               pushGameText(me.name + " spills out of the " + me.parent.name);
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
      revealed_by : [
         "look"
      ],
      values: function(contents, object) {
         if (is(object.open)) {
            if (contents.length > 0) {
               var contents_string = "contains ";
               var os = object.contents.map(function(v){ return v.name; });
               contents_string += os.join(", ");
               return contents_string;
            } else {
               return "is empty";
            }
         } else {
            return "";
         }
      },
      actionsHeld : {
           "Pour" : function(me, caller, target) {
              if (target.isTile) {
                 moveAdjacentTo(caller, target);
                 pushGameText("You pour the contents of " + me.name + " out onto the floor");

                 //copy array to avoid concurrent modification error

                 while (me.contents.length > 0) {
                    var next = me.contents[0]; 
                    removeFromContainer(next);
                    moveObject(next, target.x, target.y, true);
                 }

                 return;
              }
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
   },

   material : {
      revealed_by : [
         "look"
      ],
      values : function(value) {
         if (value.name !== undefined) {
            return "is made of " + value.name;
         } else {
            return "";
         }
      }
   },

   living : {
      values: {
         0: "is dead",
         1: "is alive"
      },
      revealed_by : [
         "look", "biology_knowledge", "necromancy_knowledge"
      ],
      functions : {
         "kill" : function(me) {
            if (is(me.living)) {
               if (isVisible(me)) {
                  pushGameText("The life drains out of " + me.name);
               }
               me.living -= 1;
            }
         }
      }
   },

   oxygenated : {
      values: {
         1: "is rich with oxygen"
      },
      revealed_by : [
         "biology_knowledge", "chemistry_knowledge"
      ],
      functions : {
         "heartbeat" : function(me){
            if (not(me.oxygenated)) {
               me.oxygenated = 1;
            }
         }, 
         "tick" : function(me) {
            if (not(me.oxygenated)) {
               if (Math.random() < .1) {
                  call(me, "kill");
               }
            } else {
               if (Math.random() < .1 && is(me.oxygenated)) {
                  me.oxygenated -= 1;
               }
            }
         }
      }
   },

   isBlood : {
   },

   blood_pumping : {
      values: {
         1: "provides its host with blood"
      },
      revealed_by : [
         "biology_knowledge"
      ],
      functions : {
         "tick" : function(me) {
            if (me.parent !== undefined && not(me.parent.isRoom)) {
               var contents = me.parent.contents;
               
               if (is(me.parent.living) && 
                  //Does this creature have blood?
                  contents.some(function(a){ return is(a.isBlood); })) {
                  //Then pump it!
                  contents.forEach(function(a) { call(a, "heartbeat"); });
                  call(me.parent, "heartbeat");
               }
            }
         }
      }
   },

   clawed : {
      values: {
         1: "has claws"
      },
      revealed_by : [
         "look", "biology_knowledge"
      ],
      functions : {
         "attack" : function(me, target) {
            moveAdjacentTo(me, target);
            if (is(target.soft)) {
               pushGameText(me.name + " slashes at " + target.name + "!");
               call(target, "slash", me);
               return;
            }

            if (is(target.hard)) {
               pushGameText(me.name + " tries to slash at " + target.name + ", but it is too hard!");
               return;
            }

            if (Math.random() < .25) {
               pushGameText(me.name + " slashes at " + target.name + "!");
               call(target, "slash", me);
               return;
            }

            pushGameText(me.name + " slashes " + getPronoun(me) + " at " + target.name + ", but it is ineffective.");
         }
      }
   },

   playerThink : {
      values : {
         1: "allows you to think",
      },
      revealed_by : [
         "biology_knowledge"
      ],
      functions : {
         "heartbeat" : function(me) {
            if (me.parent !== undefined && not(me.parent.isRoom)) {
               if (is(me.parent.hungry)) {
                  if (Math.random() < .1) {
                     pushGameText("Your stomach growls");
                  }
               }
            }
         }
      }
   },

   //Humors
   calm : {
      values: {
         1: "is calm"
      },
      revealed_by : [
         "psychology_knowledge", "look",
      ],
      functions : {
         "calm" :  function(me) {
            if (is(me.angry)) {
               me.angry = 0;
            } else {
               if (not(me.calm)) {
                  me.calm = 1;
               }
            }
         },
      }
   },

   angry : {
      values: {
         1: "is angry",
      },
      revealed_by : [
         "psychology_knowledge", "look",
      ],
      functions : {
         "anger" : function(me) {
            if (is(me.calm)) {
               me.calm = 0;
            } else {
               if (not(me.angry)) {
                  me.angry = 1;
               }
            }
         }
      }
   },

   hungry : {
      values: {
         1: "is hungry",
      },
      revealed_by : [
         "psychology_knowledge", "look",
      ],
      functions : {
         "tick" : function(me) {
            if (is(me.hungry)) {
               if (Math.random() < .5) {
                  call(me, "anger");
               }
            } else {
               if (Math.random() < .1) {
                  call(me, "hunger");
               }
            }
         },
         "hunger" : function(me) {
            if (not(me.hungry)) {
               if (isVisible(me)) {
                  pushGameText(me.name + "'s stomach growls");
               }
               me.hungry = 1;
            }
         },
         "eat" : function(me) {
            if (is(me.hungry)) {
               me.hungry = 0;
            }
         }
      }
   },

   //Remember that this will typically be a property of stomachs
   //so if you want to do something to the creature use me.parent.parent
   //instead of just me.parent
   digesting : {
      values : {
         1: "is for digesting food"
      },
      revealed_by : [
         "biology_knowledge"
      ],
      functions : {
         "heartbeat" : function(me) {
            if (!is(me.contents)) return;
            if (me.contents.length > 0) {
               for (var c in me.contents) {
                  if (is(me.contents[c].digestible)) {
                     call(me.contents[c], "digest");
                  } else {
                     call(me, "gag", me.contents[c]);
                  }
               }
            }
         },
         "eat" : function(me, eaten) {
            if (is(me.contents)) {
               setContainer(eaten, me);
            }
         }
      }
   },

   gagReflex : {
      values : {
         1: "will vomit up food that isn't digestible"
      },
      revealed_by : [
         "biology_knowledge",
      ],
      functions : {
         "gag" : function(me, on) {
            var creature;
            if (me.parent !== undefined && me.parent.parent !== undefined) {
               creature = me.parent;
            } else {
               console.log("gagReflex.gag could not find containing creature!");
               return;
            }
            if (Math.random() < .8) {
               pushGameText(creature.name + " vomits up " + on.name);
               moveObject(on, creature.x, creature.y, true);
               setContainer(on, creature.parent);
            } else {
               pushGameText(creature.name + " retches");
            }
         }
      }
   },

   carnivoreGag : {
      values : {
         1: "can digest uncooked meat"
      },
      revealed_by : [
         "biology_knowledge"
      ],
      functions : {
         "addedObject" : function(me, what) {
            console.log(what);
            if (what.material === materials.flesh) {
               if (not(what.digestible)) {
                  if (what.digestible === undefined) what.digestible = 0;
                  what.digestible += 1;
               }
            }
         }
      }
   },

   scared : {
      values: {
         1: "is shaking with fear"
      },
      revealed_by : [
         "psychology_knowledge", "look"
      ],
   },

   sentient : {
      values: {
         1: "is sentient"
      },
      revealed_by : [
         "biology_knowledge"
      ],
      functions : {
         "heartbeat" : function(me) {
            if (is(me.living) && is(me.conscious)) {
               call(me, "think");               
            }
         }
      }
   },

   cookable : {
      values: {
         1: "can be cooked",
      },
      revealed_by : [
         "alchemy_knowledge",
      ],
      functions : {
         "heat" : function(me) {
            if (is(me.hot) && Math.random() < .1) {
               if (not(me.cooked) && not(me.burnt)) {
                  if (me.nutritious === undefined) me.nutritious = 0;      
                  if (me.edible === undefined) me.edible = 0;      
                  if (isVisible(me)) {
                     pushGameText(me.name + " begins to smell tasty!");
                  }
                  me.edible += 1;
                  me.nutritious += 1;
                  me.cooked = 1;
                  call(me, "cook");
               } else {
                  if (isVisible(me)) {
                     pushGameText(me.name + " begins to smell burnt.");
                  }
                  me.cooked = 0;
                  me.nutritious -= 1;
                  me.burnt = 1;
                  call(me, "cook");
               }
            }
         }
      }
   },

   cooked : {
      values : {
         1: "has been cooked"
      },
      revealed_by : [
         "look"
      ],
   },

   burnt : {
      values: {
         1: "was burnt from being cooked too long",
      },
      revealed_by : [
         "look"
      ]
   },

   edible : {
      values: {
         1: "looks edible"
      },
      revealed_by : [
         "look"
      ],
      actionsStanding : {
         //TODO: Held/Stationary actions
         "Eat" : function(me, caller, target){
            moveAdjacentTo(caller, me);
            pushGameText("You eat " + me.name);
            eat(caller, me);
         }
      }
   },

   nutritious : {
      values: {
         0: "is drained of nutrients",
         1: "is nutritious"
      },
      revealed_by : [
         "chemistry_knowledge", "biology_knowledge",
      ],
      types : [
         "chemical"
      ],
      functions : {
         "digest" : function(me) {
            var creature;
            if (parent !== undefined && parent.parent !== undefined) {
               creature = parent.parent;
            } else {
               console.log("Couldn't find object that is digesting " + me.name, me);
               return;
            }

            if (not(creature.sated)) {
               creature.sated = 1;
            }
         }
      }
   },

   digestible : {
      values: {
         1: "is easily digestible"
      },
      revelaled_by : [
         "biology_knowledge",
      ],
      functions : {
         "digest" : function(me) {
            deleteObject(me);
         }
      }
   },

   obscured : {
      //
   }
}
