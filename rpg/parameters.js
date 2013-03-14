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
            if (not(me.open))
            {
               pushGameText("You open the " + me.name);
               add(me, "open");
            }
         },
         "Close" : function(me, caller) {
            moveAdjacentTo(caller, me);
            if (is(me.open))
            {
               pushGameText("You close the " + me.name);
               sub(me, "open");
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
            if (me.contents !== undefined && is(me.open))
            {
               var fallouts = [];
               for (var i in me.contents)
               {
                  if (Math.random() < .5)
                  {
                     pushGameText(me.contents[i].name + " falls out of " + me.name);
                     fallouts.push(me.contents[i]);
                  }
               }

               for (var i in fallouts) {
                  removeFromContainer(fallouts[i]);      
                  moveRandom(fallouts[i], 1);
               }
            }
         },//jostle
      }//functions
   },

   //Object can be boiled. Higher value = requires more heat
   boilable : {
      values: { 1: "can be boiled" },
      revealed_by : [ "chemistry_knowledge" ],
      types: [ "physical" ],
      functions : {
         "tick": function(me) {
            if (is(me.hot) && not(me.boiling)) {
               if (isVisible(me)) {
                  pushGameText(me.name + " starts to boil");
               }
               add(me, "boiling");
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
            if (is(me.boiling) && Math.random() < .1) {
               if (isVisible(me)) {
                  pushGameText(me.name + " boils away!");
               }
               deleteObject(me);
            }
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
            if (not(me.burning)) {
               pushGameText(me.name + " bursts into flames!");
               add(me, "burning");
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
                  add(me.contents[o], "hot");
               }
            }

            if (me.parent !== undefined && Math.random() > .1)
            {
               //Sometimes heat parent
               if (Math.random() < .1) {
                  call(me.parent, "heat");
                  add(me.parent, "hot");
               }
            }

            //Small chance to cool down every tick
            if (Math.random() < .1) {
               call(me, "cool");
               sub(me, "hot");
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
            var touching = getObjectsTouching(me);
            for (var i in touching) {
               if (!touching[i].hot) touching[i].hot = 1;
               call(touching[i], "heat", me.burning);
               call(touching[i], "burn", me.burning);
            }

            call(me, "burn", me.burning);

            if (Math.random() < .2 && not(me.flameEternal)) {
               pushGameText(me.name + "'s flames die out");
               sub(me, "burning");
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
            if (is(me.hard)) {
               me.hard = undefined;
               me.soft = undefined;
            }
         },
         "slash" : function(me, attacker) {
            if (is(me.contents) && not(me.open)) {
               if (me.open === undefined) me.open = 0;
               pushGameText(me.name + " bursts open!");
               add(me, "open");
               return;
            }

            if (is(me.open)) {
               pushGameText(me.name + " is torn to shreds!");
               var contents = me.contents.slice();
               deleteObject(me);
               scatter(contents, 3);
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
            if (me.big){
               me.big = undefined;
               me.small = undefined;
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
            var touching = getObjectsTouching(me);
            for (t in touching) {
               if (is(touching[t].isLiquid) && is(touching[t].hot)) {
                  pushGameText(me.name + " dissolves into " + touching[t].name);
                  mergeObject(touching[t], me, ["chemical"]);
                  return;
               }
            }
         },
         "jostle" : function(me, jostler, amount) {
            var touching = getObjectsTouching(me);
            for (var t in touching) {
               if (is(touching[t].isLiquid)) {
                  pushGameText(me.name + " dissolves into " + touching[t].name);
                  mergeObject(touching[t], me, ["chemical"]);
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

            var touching = getObjectsTouching(me);
            for (var t in touching) {
               if (is(touching[t].isLiquid)) {
                  mergeBySize(me, touching[t], ["chemical", "physical"]);
                  return;
               } else {
                  if (is(touching[t].open) && is(touching[t].contents)) {
                     pushGameText(me.name + " fills the " + touching[t].name);
                     var dup = duplicateObject(me);
                     setContainer(dup, touching[t]);
                  }

                  add(touching[t], "wet");
               }
            }
         }, 
         "jostle" : function(me) {
            if (is(me.parent.open) && not(me.parent.isRoom)) {
               pushGameText(me.name + " spills out of the " + me.parent.name);
               removeFromContainer(me);
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
               sub(me, "wet");
            }
         }, 
         "add" : function(me) {
            sub(me, "flammable");
         },

         "sub" : function(me) {
            add(me, "flammable");
         },
         "burn" : function(me) {
            pushGameText(me.name + " sizzles");
            sub(me, "wet");
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
                 if (not(me.open)) {
                     if (not(me.openable)) {
                        pushGameText("You cannot pour because it isn't open and you can't open it!");
                     } else {
                        add(me, "open");
                     }
                 }
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
         if (value === undefined) return "";
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
         "tick" : function(me) {
            if (not(me.oxygenated) && is(me.living)) {
               if (Math.random() < .5) {
                  sub(me, "living");
               }
            }
         },

         "sub" : function(me) {
            if (isVisible(me)) {
               pushGameText("The life drains out of " + me.name);
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
         "tick" : function(me) {
            if (Math.random() < .1) {
               sub(me, "oxygenated");
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
                  contents.forEach(function(a) { call(a, "heartbeat"); add(a, "oxygenated") });
                  add(me.parent, "oxygenated");
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

            if (Math.random() < .4) {
               pushGameText(me.name + " slashes at " + target.name + "!");
               call(target, "slash", me);
               return;
            }
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

               if (not(me.oxygenated)) {
                  if (Math.random() < .25) {
                     pushGameText("You feel lightheaded.");
                  }
               }
            }
         }
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
         "tick" : function(me) {
            if (Math.random() < .3) {
               sub(me, "anger");
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
            if (what.material === materials.flesh || is(what.isBlood)) {
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

   //Used to determine if an object is living in the 
   //in the visual sense. Is this object walking around?
   animated : {
      //
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
                  if (isVisible(me)) {
                     pushGameText(me.name + " begins to smell tasty!");
                  }
                  add(me, "edible");
                  add(me, "nutritious");
                  add(me, "cooked");
                  call(me, "cook");
               } else {
                  if (isVisible(me)) {
                     pushGameText(me.name + " begins to smell burnt.");
                  }
                  sub(me, "cooked");
                  sub(me, "nutritious");
                  add(me, "burnt");
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

   spawnsMice : {
      functions : {
         "tick" : function(me) {
            if (Math.random() < .1) {
               var room = getRoom(me);
               if (room !== undefined) {
                  var mouse = createObjectFromTemplate("mouse");
                  moveObject(mouse, me.x, me.y);
                  setContainer(mouse, room);
                  pushGameText(mouse.name + " scurries out of " + me.name);
               }
            }
         }
      }
   },

   obscured : {
      //
   },

   rooted: {
      values : {
         1: "cannot be moved",
      },
      revealed_by : [
         "look"
      ],
      types : [
         "physical"
      ]
   },

   isSpring : {
      functions: {
         "tick":function(me) {
            var haswater = false;
            for (var c in me.contents) {
               if (me.contents[c].material === "water") {
                  haswater = true;
               }
            }

            if (!haswater) {
               var water = createObjectFromTemplate("water");
               setContainer(water, me);
            }
         }
      }
   }
}
