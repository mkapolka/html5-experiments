parameters.sentient = {
   values: {
      1: "is sentient"
   },
   revealed_by : [
      "psychology_knowledge"
   ],
   types: [ "psychological" ],
   functions : {
      "heartbeat" : function(me) {
         if (is(me.living) && is(me.conscious)) {
            call(me, "think");
         } else {
            return;
         }

         if (is(me.hungry)) {
            call(me, "thinkHungry");
            return;
         }

         if (is(me.stressed)) {
            call(me, "thinkStressed");
            return;
         }

         if (is(me.happy)) {
            call(me, "thinkHappy");
            return;
         }

         call(me, "thinkBored");
      },
      "pain" : function(me) {
         if (not(me.stressed)) {
            add(me, "stressed");
         }
      }
   }
}

parameters.hungry = {
   values: {
      1: "is hungry",
   },
   revealed_by : [
      "psychology_knowledge", "look",
   ],
   functions : {
      "tick" : function(me) {
         if (not(me.hungry)) {
            if (Math.random() < .1) {
               add(me, "hungry");
               say(me.name + "'s stomach growls", me, "say");
            }
         }
      },
   }
},

parameters.stressed = {
   values: {
      1: "is stressed"
   },
   revealed_by : [
      "psychology_knowledge"
   ],
   functions : {
      "think" : function(me) {
         if (is(me.stressed)) {
            if (Math.random() < .3) {
               say(me.name + " calms down.", body, "see");
               sub(me, "stressed");
            }
         }
      }
   }
}

parameters.escapeArtist = {
   values: { 1: "will escape if contained or grabbed" },
   revealed_by: [ "psychology_knowledge" ],
   functions : {
      "think" : function(me) {
         if (not(me.parent.isRoom)) {
            call(me, "attack", me.parent);
            add(me, "stress");
            if (is(me.parent.open)) {
               removeFromContainer(me);
               say(me.name + " leaps out of " + me.parent.name, me, "see");
            }
         }
      }
   }
}

parameters.stressedAttack = {
   values: {
      1: "lashes out when stressed"
   },
   revealed_by : [
      "psychology_knowledge"
   ],
   functions : {
      thinkStressed : function(brain) {
         var nearest = getNearest(me);

         call(me, "attack", nearest);

         moveRandom(me, 3);
      }
   }
}

parameters.hunterThink = {
   values: {
      1: "thinks like a hunter"
   },
   revealed_by : [
      "psychology_knowledge"
   ],
   functions : {
      "thinkHungry" : function(me) {
         //What tasty treats can I find?
         var target = pickRandom(getVisibleObjects(me).filter(function(a) {
            return (a.material === materials.flesh || a.material === materials.blood) && sizeCompare(me, a) > 0;
         }));

         if (target !== undefined) {
            if (is(target.animated)) {
               if (Math.random() < .25) {
                  say(me.name + " gobbles up the poor " + target.name, me, "see");
                  eat(me, target);
                  return;
               }

               call(me, "attack", target);
               return;
            } else {
               say(me.name + " eats the " + target.name, me, "see");
               eat(me, target);
            }
         } else {
            say(me.name + " leers around hungrily, looking for its next meal", me, "see");
         }
      }
   }
}

parameters.carnivoreFilter = {
   values: {
      1: "likes to eat meat"
   },
   revealed_by : [
      "psychology_knowledge"
   ],
   functions : {
      "filterFood" : function(me, foodlist) {
         var fl2 = foodlist.filter(function(a) {
            if (a.material !== materials.flesh) {
               return true;
            } else {
               return false;
            }
         });
         for (var f in fl2) {
            arrayRemove(foodlist, fl2[f]);
         }
      }
   }
}

parameters.herbivoreNibble = {
   values : {
      1: "nibbles on plants"
   },
   revealed_by : [
      "biology_knowledge"
   ],
   functions : {
      "thinkHungry" : function(me) {
         if (is(me.mobile)) {
            var plant = pickRandom(getVisibleObjects(me).filter(function(a) {
               return a.material === materials.plant;
            }));

            if (plant !== undefined) {
               if (not(plant.small)) {
                  say(me.name + " nibbles on " + plant.name, me, "see");
                  var plantBit = duplicateObject(plant);
                  plantBit.name = "a bit of nibbled plant matter";
                  plantBit.big = 0;
                  plantBit.small = 1;
                  eat(me, plantBit);
               } else {
                  eat(me, plantBit);
               }
            } else {
               say(me.name + " sniffs around hungrily", me, "see");
            }
         }
      }
   }
}

parameters.wanderBored = {
   values: {
      1: "wanders around when it's bored"
   },
   revealed_by : [
      "biology_knowledge", "psychology_knowledge",
   ],
   functions : {
      "thinkBored" : function(me) {
         if (is(me.mobile)) {
            moveObject(me, Math.floor(Math.random() * getRoom(me).width), Math.floor(Math.random() * getRoom(me).height), true);
         }
      }
   }
}

parameters.sleeping = {
   values : {
      1: "is asleep"
   },
   functions : {
      "heartbeat" : function(me) {
         if (is(me.sleeping) && Math.random() < .1) {
            sub(me, "sleeping");
         }
      },
      "add" : function(me) {
         say(me.name + " dozes off.", me, "see");
         sub(me, "conscious");
      },
      "sub" : function(me) {
         say(getBrainOwner(me).name + " wakes up.", me, "see");
         add(me, "conscious");
      }
   }
}

parameters.catBrain = {
   values : {
      1: "thinks like a cat"
   },
   functions : {
      thinkBored : function(me){
         if (Math.random() < .25) {
            say(me.name + " meows lazily", me, "say");
            return;
         }

         if (Math.random() < .75) {
            add(me, "sleeping");
         }
      }
   }
}

parameters.sizeFilter = {
   values : {
      1: "only eats things smaller than itself"
   },
   revealed_by : [
      "biology_knowledge", "psychology_knowledge",
   ],
   functions : {
      "filterFood" : function(me, foodlist) {
         var fl2 = foodlist.filter(function(a) {
            //Big size: eat anything that isn't big
            if (is(me.big) && not(a.big)) {
               return false;
            }

            //Normal size: only eat small things
            //if (not(me.big) && not(me.small) && is(a.small)) {
            if (not(me.big) && not(me.small) && not(a.big)) {
               return false;
            }

            //Small size: eat small things, cut this guy a break :(
            if (is(me.small)) {
               return false;
            }

            return true;
         });

         for (var f in fl2) {
            arrayRemove(foodlist, fl2[f]);
         }
      }
   }
}

//functions
function getTasty(creature) {
   var tasties = getRoom(creature).contents.slice();
   tasties.splice(tasties.indexOf(creature), 1);
   call(creature, "filterFood", tasties);
   return pickRandom(tasties);
}
