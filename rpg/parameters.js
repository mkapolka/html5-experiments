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
               say("You open the " + me.name, me, "do");
               add(me, "open");
            }
         },
         "Close" : function(me, caller) {
            moveAdjacentTo(caller, me);
            if (is(me.open))
            {
               say("You close the " + me.name, me, "do");
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
                     say(me.contents[i].name + " falls out of " + me.name, me, "see");
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
            if (is(me.hot) && not(me.boiling) && rand(10, .1)) {
               if (isVisible(me)) {
                  say(me.name + " starts to boil", me, "see");
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
         "tick" : function(me) {
            if (is(me.holding) && me.holding.parent !== me.parent) {
               setContainer(me.holding, me.parent);
            }
            if(me.holding && me.holding.isDeleted) {
               delete me.holding;
            }
         },
         "move" : function(me, x, y) {
            if (is(me.holding)) {
               if (getRoom(me) !== getRoom(me.holding)) {
                  setContainer(me.holding, getRoom(me));
               }
               moveObject(me.holding, x, y, true);
            }
         },
         "pickup" : function(me, object) {
            if (not(me.holding)) {
               say(me.name + " picks up " + object.name, me, "see");
               moveObject(object, me.x, me.y);
               me.holding = object;
               object.obscured = 1;
            }
         }, 
         //Drop whatever this being is holding
         "drop" : function(me) {
            if (is(me.holding)) {
               say(me.name + " drops " + me.holding.name, me, "see");
               moveObject(me.holding, me.x, me.y, true);
               setContainer(me.holding, me.parent);
               me.holding.obscured = 0;
               me.holding = undefined;
            }
         },
         "attack" : function(me, attacker, target) {
            if (not(me.holding)) return;
            call(me.holding, "attack", me, target);
         }
      }
   },

   attached_to : {
      values: function(me) {
         if (is(me.attached_to)) {
            return "moves where " + me.attached_to.name + " moves.";
         } else {
            return "";
         }
      },
      functions : {
         "tick" : function(me) {
            if (is(me.attached_to)) {
               if (me.attached_to.x !== me.x || me.attached_to.y !== me.y || getRoom(me)) {
                  moveObject(me, me.attached_to.x, me.attached_to.y);
               }

               if (getRoom(me.attached_to) !== getRoom(me)) {
                  
               }
            }
         }
      }
   },

   iridescent : {
      revealed_by : [ "look" ],
      values: { 0: "shimmers curiously in the light" },
      types : [ "physical", "aesthetic" ],
      functions : {
         "tick" : function(me) {
            me.color = pickRandom(["red", "green", "blue", "white", "black", "purple", "orange", "yellow"]);
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
      functions : {
         "tick" : function(me) {
            if (not(me.hot)) {
               sub(me, "boiling");
            }

            if (is(me.boiling) && is(me.hot) && rand(20,.2)) {
               say(me.name + " boils away!", me, "see");
               deleteObject(me);
            }
         },
         "add" : function(me) {
            say(me.name + " begins to boil.", me, "see");
         },
         "sub": function(me) {
            say(me.name + " stops boiling.", me, "see");
         }
      },
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
               say(me.name + " bursts into flames!", me, "see");
               add(me, "burning");
            }
         }
      }
   },

   hot : {
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
            if (not(me.hot)) return;

            if (me.contents !== undefined)
            {
               if (rand(5, .2)) {
                  for (var o in me.contents) {
                     if (not(me.contents[o].hot)) {
                        add(me.contents[o], "hot");
                     }
                  }
               }
            }

            //Small chance to cool down every tick
            if (rand(10, .2)) {
               sub(me, "hot");
            }
         },
         "add" : function(me) {
            say(me.name + " heats up.", me, "see");
         },
         "sub" : function(me) {
            say(me.name + " cools down.", me, "see");
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
               if (!touching[i].hot) {
                  add(touching[i], "hot");
               }
               call(touching[i], "burn", me.burning);
            }

            if (not(me.hot)) {
               add(me, "hot");
            }

            call(me, "burn", me.burning);

            if (Math.random() < .2 && not(me.flameEternal)) {
               say(me.name + "'s flames die out", me, "see");
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
                  say(me.name + " was consumed by fire!", me, "see");
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
            if (not(me.soft)) return;
            if (is(me.contents) && not(me.open)) {
               say(me.name + " bursts open!", me, "see");
               add(me, "open");
               return;
            }

            if (is(me.open) || not(me.contents)) {
               say(me.name + " is torn to shreds!", me, "see");
               var contents = me.contents.slice();
               deleteObject(me);
               scatter(contents, 3);
            }
         },
         "bash" : function(me, attacker) {
            if (is(me.contents)) {
               for (var v in me.contents) {
                  call(me.contents[v], "bash", attacker);
               }
            }
         },
         "pierce" : function(me, attacker) {
            if (is(me.watertight)) {
               say(me.name + " is poked full of holes!", me, "see");
               sub(me, "watertight");
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
                  say(me.name + " dissolves into " + touching[t].name, me, "see");
                  mergeObject(touching[t], me, ["chemical"]);
                  return;
               }
            }
         },
         "jostle" : function(me, jostler, amount) {
            var touching = getObjectsTouching(me);
            for (var t in touching) {
               if (is(touching[t].isLiquid)) {
                  say(me.name + " dissolves into " + touching[t].name, me, "see");
                  mergeObject(touching[t], me, ["chemical"]);
                  return;
               }
            }
         },
         "churn" : function(me, churner) {
            
         }
      }
   }, // soluble

   calming : {
      values: { 1: "has calming properties", },
      revealed_by : [ "alchemy_knowledge" ],
      types: [ "chemical" ],
      functions : {
         "heartbeat" : function(me, body) {
            if (is(body.stressed)) {
               sub(body, "stressed");
            } else {
               if (rand(3, 1) && not(body.sleeping)) {
                  add(body, "sleeping");
               }
            }

            if (rand(20, 1)) {
               delete(me.angering);
            }
         }
      }
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
      values: { 1: "has anxiety-inducing properties" },
      revealed_by : [ "alchemy_knowledge"],
      types: ["chemical"],
      functions : {
         "heartbeat" : function(me, body) {
            if (not(body.stressed)) {
               add(body, "stressed");

               if (rand(10, 1)) {
                  delete(me.angering);
               }
            }
         },
      }
   }, 

   stimulating : {
      values: { 1: "has stimulating properties" },
      revealed_by : [ "alchemy_knowledge"] ,
      types: [ "chemical" ],
      functions : {
         "heartbeat" : function(me, body) {
            if (not(body.conscious)) {
               add(body, "conscious");
               say(body.name + " perks up!", body, "see");
            }
         },
         "add" : function(me) {
            say("You feel peppy!", me, "feel");
         },
         "sub" : function(me) {
            say("The world seems to move faster.", me, "feel");
         }
      }
   },

   hunger_inducing : {
      values: { 1: "has hunger-inducing properties" },
      revealed_by : [ "alchemy_knowledge" ],
      types: ["chemical"],
      functions : {
         "heartbeat" : function(me, body) {
            if (not(body.hungry)) {
               add(body, "hungry");
            }
         },
         "digest" : function(me, digester) {
            if(is(me.hunger_inducing));
            if (Math.random() < .5) {
               add(digester, "hunger_inducing");
               delete me.hunger_inducing;
            }
         }
      }
   }, 

   gagSuppressing : {
      values: { 1: "prevents nausea" },
      revealed_by : [ "alchemy_knowledge" ],
      types: ["chemical"],
      functions : {
         "heartbeat" : function(me, body) {
            if (!me.gagSuppressing) return;
            if (body.gagReflex === undefined) return;

            if (is(body.gagReflex)) {
               say("Your stomach feels less picky.", body, "feel");
               sub(body, "gagReflex");
            } else {
               if (Math.random() < .1) {
                  say("Your stomach feels more sensitive", body, "feel");
                  add(body, "gagReflex");
                  delete me.gagSuppressing;
               }
            }
         },
      }
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

   watertight : {
      values: { 0: "is not watertight", 1: "is watertight"},
      type: [ "mechanical" ],
      revealed_by : [ "look" ],
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
               var container = me.parent
               removeFromContainer(me);
               say(me.name + " spills out of the " + container.name, me, "see");
            }

            var touching = getObjectsTouching(me);
            for (var t in touching) {
               if (is(touching[t].isLiquid)) {
                  say(me.name + " mixes with " + touching[t].name, me, "see");
                  mergeObject(me, touching[t], ["chemical", "physical"]);
                  return;
               } else {
                  if (is(touching[t].open) && is(touching[t].contents)) {
                     say(me.name + " fills the " + touching[t].name, me, "see");
                     var dup = duplicateObject(me);
                     setContainer(dup, touching[t]);
                  }

                  call(me, "touch", touching[t]);
                  call(touching[t], "touch", me);
                  add(touching[t], "wet");
               }
            }
         }, 
         "jostle" : function(me) {
            if (is(me.parent.open) && not(me.parent.isRoom)) {
               var cont = me.parent;
               removeFromContainer(me);
               say(me.name + " spills out of the " + cont.name, me, "see");
            }
         },
         "add": function(me) {
            sub(me, "holdable");
         },
         "sub": function(me) {
            add(me, "holdable");
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
            say(me.name + " sizzles", me, "see");
            sub(me, "wet");
         }
      }
   },

   contents : {
      revealed_by : [
         "look"
      ],
      values: function(contents, object) {
         if (is(object.open) || is(object.openable)) {
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
                 say("You pour the contents of " + me.name + " out onto the floor", me, "do");

                 //copy array to avoid concurrent modification error

                 while (me.contents.length > 0) {
                    var next = me.contents[0]; 
                    removeFromContainer(next);
                    moveObject(next, target.x, target.y, true);
                 }

                 return;
              }
              if (target.contents !== undefined) {
                 if (not(me.open)) {
                     if (not(me.openable)) {
                        say("You cannot pour into " + me.name + " because it isn't open and you can't open it!", me, "do");
                        return;
                     } else {
                        add(me.open);
                     }
                 }

                 say("You pour the contents of " + me.name + " into " + target.name, me, "do");  
                 var conts = me.contents.slice();
                 for (var v in conts) {
                    setContainer(conts[v], target);
                 }
              } else {
                 say("Cannot pour " + me.name + " into that!", me, "do");
              }
           },
           
        },
      actionsStanding : function(me) {
         if (not(me.open) && not(me.openable)) {
            return {};
         }

         if (me.contents.some(function(a) {
            return is(a.isLiquid);
         })) {

            return {
               "Drink" : function(me, caller, target) {
                  var cont = me.contents.slice();
                  
                  say("You slurp down the contents of " + me.name, caller, "do");
                  for (var v in cont) {
                     eat(caller, cont[v]);
                  }
               }
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
         },

         "sub" : function(me) {
            say(me.name + " dies!", me, "see");
            me.color = "#333";

            if (is(me.lendsProperties)) {
               del(me, "lendsProperties");
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
            if (not(me.oxygenated) && is(me.living)) {
               if (Math.random() < .1) {
                  sub(me, "living");
               }
            }
            if (Math.random() < .1) {
               if (is(me.oxygenated)) {
                  sub(me, "oxygenated");
               }
            }
         }
      }
   },

   isBlood : {
      types: [ "chemical" ]
   },

   bloodPumping : {
      values: { 1: "has a heartbeat" },
      revealed_by : [ "biology_knowledge" ],
      types: [ "cardiovascular" ],
      functions : {
         "tick" : function(me) {
            var contents = me.contents;
            
            if (is(me.bloodPumping) && 
            me.contents && 
            //Does this creature have blood?
            me.contents.some(function(a){ return is(a.isBlood); })) {
               //Then pump it!
               contents.forEach(function(a) { 
                  call(a, "heartbeat", me);
                  if (not(a.oxygenated) && a.oxygenated !== undefined) {
                     add(a, "oxygenated");
                  }
               });
               if (not(me.oxygenated) && me.oxygenated !== undefined) {
                  add(me, "oxygenated");
               }
               call(me, "heartbeat", me);
               return;
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
         "attack" : function(me, attacker, target) {
            moveAdjacentTo(me, target);
            if (is(target.soft)) {
               say(me.name + " slashes at " + target.name + "!", me, "see");
               call(target, "slash", me);
               return;
            }

            if (is(target.hard)) {
               say(me.name + " tries to slash at " + target.name + ", but it is too hard!", me, "see");
               return;
            }

            if (Math.random() < .4) {
               say(me.name + " slashes at " + target.name + "!", me, "say");
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
         "think" : function(me) {
            if (me.parent !== undefined && not(me.parent.isRoom)) {
               if (is(me.parent.hungry)) {
                  if (Math.random() < .1) {
                     say("Your stomach growls", me, "feel");
                  }
               }

               if (not(me.oxygenated)) {
                  if (Math.random() < .25) {
                     say("You feel lightheaded.", me, "feel");
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

   digestMe : {
      values: { 1: "is coated with a digestive enzyme" },
      revealed_by : [ "biology_knowledge", "chemistry_knowledge" ],
   },

   //Remember that this will typically be a property of stomachs
   //so if you want to do something to the creature use me.parent.parent
   //instead of just me.parent
   digesting : {
      values : {
         1: "can digest food"
      },
      revealed_by : [
         "biology_knowledge"
      ],
      types: [ "gastrointestinal" ],
      functions : {
         "heartbeat" : function(me, target) {
            for (var v in me.contents) {
               var target = me.contents[v];
               if (target.digestMe) {
                  if (is(target.digestible)) {
                     if (target.contents) {
                        target.contents.forEach(function(v) {
                           v.digestMe = 1; 
                        });
                     }
                     call(target, "churn");
                     call(target, "digest", me);
                     sub(me, "hungry");
                  } else {
                     call(me, "gag", target);
                  }
               }
            }
         },
         "eat" : function(me, who) {
            if (not(who.isLiquid)) {
               who.digestMe = 1;
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
      types: [ "gastrointestinal" ],
      functions : {
         "gag" : function(me, on) {
            if (not(me.gagReflex)) return;

            if (rand(2, .5)) {
               removeFromContainer(on);
               say(me.name + " vomits up " + on.name, me, "see");
            } else {
               say(me.name + " retches", me, "see");
            }
         },
         "jostle" : function(me, jostler) {
            if (me.stomach.indexOf(jostler) !== -1) {
               call(me, "gag", jostler);
            }
         }
      }
   },

   carnivoreGag : {
      values : { 1: "can digest uncooked meat" },
      revealed_by : [ "biology_knowledge" ],
      types: [ "gastrointestinal" ],
      functions : {
         "eat" : function(me, what) {
            if (what.material === materials.flesh) {
               if (not(what.digestible)) {
                  add(what, "digestible"); 
               }

               for (var c in what.contents)  {
                  if (not(what.contents[c].digestible) && what.contents[c].material == materials.flesh) {
                     add(what.contents[c], "digestible");
                  }
               }
            }
         }
      }
   },

   herbivoreGag : {
      values: { 1: "can digest plant matter" },
      revealed_by : [ "biology_knowledge" ],
      types: [ "gastrointestinal" ],
      functions : {
         "addedObject" : function(me, what) {
            if (what.material === materials.plant) {
               if (not(what.digestible)) {
                  add(what, "digestible"); 
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

   //Used to determine if an object is living in the 
   //in the visual sense. Is this object walking around?
   animated : {
      //
   },

   cooked : {
      values: {
         1: "can be cooked",
      },
      revealed_by : [
         "alchemy_knowledge",
      ],
      functions : {
         "tick" : function(me) {
            if (is(me.hot) && Math.random() < .1) {
               if (not(me.cooked) && not(me.burnt)) {
                  if (isVisible(me)) {
                     say(me.name + " begins to smell tasty!", me, "see");
                  }
                  add(me, "edible");
                  add(me, "cooked");
                  call(me, "cook");
               } else {
                  if (isVisible(me)) {
                     say(me.name + " begins to smell burnt.", me, "say");
                  }
                  sub(me, "cooked");
                  add(me, "burnt");
                  call(me, "cook");
               }
            }
         }
      }
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
            say("You eat " + me.name, me, "do");
            eat(caller, me);
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
         "digest" : function(me, digester) {
            say(me.name + " is melted down into insubstantial mush", me, "see");
            if (digester.contents) {
               digester.contents.forEach(function(a) {
                  if (is(a.isBlood)) {
                     mergeObject(a, me, "chemical");
                     return;
                  }
               });
            }
         }
      }
   },

   homeostatic : {
      values: { 1: "preserves homeostasis" },
      revealed_by : [ "biology_knowledge" ],
      types : [ "gastrointestinal" ],
      functions: {
         "heartbeat" : function(me, body) {
            if (is(body.hot)) {
               sub(body, "hot");
               say(body.name + " sweats and pants", body, "see");
               return;
            } 

            if (is(body.cold)) {
               sub(body, "cold");
               say(body.name + " shivers", body, "see");
               return;
            }

            if (is(body.lacerated) && rand(10, .1)) {
               sub(body, "lacerated");
               say(body.name + "'s wounds scab over", body, "see");
               return;
            }
         },
         //Have to put this in tick because obviously we can't get a hearbeat if 
         //we need blood!
         "tick" : function(me) {
            if (is(me.alive));

            if (is(me.contents) && !me.contents.some(function(a) {
               return is(a.isBlood);
            })) {
               if (rand(5, .1)) {
                  var blood = createObjectFromTemplate("blood");  
                  setContainer(blood, me);
               }
            }
         }
      }
   },

   rotting : {
      values: {1: "is rotting" },
      revealed_by : [ "look" ],
      functions : {
         "tick" : function(me) {
            if (not(me.rotting) && not(me.living)) {
               if (rand(4, 0)) {
                  add(me, "rotting");
                  me.color = "lime";
               }

               return;
            }

            if (is(me.rotting)) {
               if (rand(5, .2)) {
                  deleteObject(me);
                  say(me.name + " decomposes into nothing", me, "see");
               }
            }
         },
         "add" : function(me) {
            say(me.name + " begins to rot.", me, "see");
         }
      }
   },

   spawnsMice : {
      functions : {
         "tick" : function(me) {
            if (!me.mice) me.mice = [];

            var len = me.mice.length;
            while (len--) {
               if (me.mice[len].isDestroyed) me.mice.splice(len, 1);
            }

            if (Math.random() < .1 && me.mice.length < 1) {
               var room = getRoom(me);
               if (room !== undefined) {
                  var mouse = createObjectFromTemplate("mouse");
                  me.mice.push(mouse);
                  moveObject(mouse, me.x, me.y);
                  setContainer(mouse, room);
                  say(mouse.name + " scurries out of " + me.name, me, "see");
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
               if (me.contents[c].material === materials.water) {
                  haswater = true;
               }
            }

            if (!haswater) {
               var water = createObjectFromTemplate("water");
               setContainer(water, me);
            }
         }
      }
   },
   
   bladed : {
      values: { 1: "has a sharp edge" },
      revealed_by : [ "look" ],
      functions : {
         "churn" : function(me, churner) {
            if (not(me.parent.isRoom)) {
               call(me, "slash", me.parent);
            }
         }
      },
      actionsHeld : {
         "Slash" : function(me, caller, target) {
            moveAdjacentTo(caller, target);
            say("You slash at " + target.name + "with " + me.name + "!", me, "do");
            call(target, "slash", me);
         }
      }
   },

   pointy : {
      values: { 1: "is pointy" },
      revealed_by : [ "look" ],
      functions : {
         "churn" : function(me, churner) {
            if (not(me.parent.isRoom)) {
               call(me.parent, "stab", me);
            }
         },
      },
      actionsHeld : {
         "Stab" : function(me, caller, target) {
            moveAdjacentTo(caller, target);
            say("You stab " + target.name + "with " + me.name + "!", caller, "do");
            call(target, "stab", me);
         }
      }
   },

   lacerated : {
      values: { 1: "is covered in bleeding slash wounds. "},
      types : [ "physical" ],
      revealed_by : [ "look" ],
      functions : {
         "heartbeat" : function(me) {
            if (is(me.lacerated)) {
               if (not(me.contents)) return;
               if (Math.random() < .25) {
                  var blood = me.contents.filter(function(a){ return is(a.isBlood);});
                  for (var v in blood) {
                     removeFromContainer(blood[v]); 
                  }

                  say(me.name + " bleeds out!", me, "see");
               }
            }
         }
      }
   },

   feelsPain : {
      values: { 1: "feels pain" },
      types: [ "physical" ],
      functions : {
         "slash" : function(me, slasher) {
            if (is(me.living)) {
               call(me, "hurt", slasher);
               if (me.contents) {
                  for (var v in me.contents) {
                     call(me.contents, "hurt", slasher);
                  }
               }
            }
         },
         "stab" : function(me, stabber) {
            if (is(me.living)) {
               call(me, "hurt", stabber);
               if (me.contents) {
                  for (var v in me.contents) {
                     call(me.contents, "hurt", stabber);
                  }
               }
            }
         }
      }
   },

   //Warning: Takes all the properties of the given type with it when it leaves
   lendsProperties : {
      values:  function(value) { return "lends " + value + " properties to its host" },
      reavealed_by : [ "biology_knowledge" ],
      functions : {
         "enteredContainer" : function(me, container) {
            if (not(me.lendsProperties)) return;
            if (!container) return;
            if (not(container.isRoom)) {
               //that the container doesn't already have something that lends these properties
               if (container.contents.some(function(a) {
                  return a.lendsProperties === me.lendsProperties && a !== me;
               })) {
                  return;
               }

               lendProperties(container, me, me.lendsProperties);
            }
         }, 
         "leftContainer" : function(me, container) {
            if (!container) return;
            if (is(container.isRoom)) return;
            //that the container doesn't already have something that lends these properties
            if (container.contents.some(function(a) {
               a.lendsProperties === me.lendsProperties && a !== me;
            })) {
               return;
            }

            lendProperties(me, container, me.lendsProperties);
         },
         "sub" : function(me) {
            var container = me.parent;
            if (!container) return;
            if (is(container.isRoom)) return;
            if (container.contents.some(function(a) {
               a.lendsProperties === me.lendsProperties && a !== me;
            })) return;

            lendProperties(me, container, me.lendsProperties);
         }
      }
   },

   brittle : {
      values: { 1: "is very brittle" },
      types : [ "physical" ],
      functions : {
         "bash" : function(me) {
            if (is(me.brittle)) {
               say(me.name + " shatters into pieces!", me, "see");
               var shard = duplicateObject(me);
               shard.name = "a shard of " + me.name;
               del(shard, "big");
               add(shard, "small");
               add(shard, "bladed");
               setContainer(shard, me.parent);
               deleteObject(me);
            }
         },
         "jostle" : function(me) {
            if (not(me.brittle)) return;
            if (not(me.parent.isRoom) && is(me.parent.hard)) {
               say(me.name + " breaks", me, "see");
               var shard = duplicateObject(me);
               shard.name = "a shard of " + me.name;
               del(shard, "big");
               add(shard, "small");
               add(shard, "bladed");
               setContainer(shard, me.parent);
               destroyObject(me);
            }
         }
      }
   },

   thick : {
      values: { 1: "is thick and viscous" },
      types: [ "physical" ],
      functions: {
         "add" : function(me) {
            add(me, "holdable");
         },
         "sub" : function(me) {
            sub(me, "holdable");
         }
      },
      actionsHeld : {
         "Slather" : function(me, caller, target) {
            say("You slather " + me.name + " onto " + target.name, me, "do");
            call(me, "touch", target);
            call(target, "touch", me);
            mergeObject(target, me, ["chemical","physical"]);
         }
      }
   },

   trollBlood : {
      values: { 1: "has regenerating properties" },
      types: [ "chemical" ],
      functions : {
         "heartbeat" : function(me, beater) {
            if (is(me.trollBlood) && beater.open) {
               say(beater.name + "'s wounds close", beater, "see");
               sub(beater, "open");
            }
         }
      }
   },

   bludgeoning : {
      types: [ "weapon" ],
      functions : {
         "attack" : function(me, attacker, target) {
            moveAdjacentTo(attacker, target);
            say(attacker.name + " bashes " + target.name + " on the head!", attacker, "see");
            call(target, "bash", me);
         }
      }
   },
}
