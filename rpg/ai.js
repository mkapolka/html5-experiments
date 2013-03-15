parameters.sentient = {
   values: {
      1: "is sentient"
   },
   revealed_by : [
      "biology_knowledge", "psychology_knowledge"
   ],
   functions : {
      "heartbeat" : function(me) {
         var body = getBrainOwner(me);
         if (is(me.living) && is(me.conscious)) {
            call(me, "think", body);
         } else {
            return;
         }

         if (is(me.hungry)) {
            call(me, "thinkHungry", body);
            return;
         }

         if (is(me.stressed)) {
            call(me, "thinkStressed", body);
            return;
         }

         if (is(me.happy)) {
            call(me, "thinkHappy", body);
            return;
         }

         call(me, "thinkBored", body);
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
               if (not(me.parent.isRoom)) {
                  say(me.parent.name + "'s stomach growls", me.parent, "say");
               }
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
      "think" : function(me, body) {
         if (is(me.stressed)) {
            if (Math.random() < .3) {
               say(getBrainOwner(me).name + " calms down.", body, "see");
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
      "think" : function(me, body) {
         if (not(body.parent.isRoom)) {
            call(body, "attack", body.parent);
            add(me, "stress");
            if (is(body.parent.open)) {
               var cont = body.parent;
               removeFromContainer(body);
               say(body.name + " leaps out of " + cont.name, body, "see");
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
      "biology_knowledge", "psychology_knowledge"
   ],
   functions : {
      thinkStressed : function(brain, body) {
         var nearest = getNearest(body);

         call(body, "attack", nearest);

         moveRandom(body, 3);
      }
   }
}

parameters.hunterThink = {
   values: {
      1: "thinks like a hunter"
   },
   revealed_by : [
      "biology_knowledge", "psychology_knowledge"
   ],
   functions : {
      "thinkHungry" : function(me) {
         var cat = getBrainOwner(me);
         if (cat === undefined) return;

         //What tasty treats can I find?
         var target = getTasty(me);

         if (target !== undefined) {
            if (is(target.animated)) {
               if (Math.random() < .25) {
                  say(cat.name + " gobbles up the poor " + target.name, cat, "see");
                  eat(cat, target);
                  return;
               }

               call(cat, "attack", target);
               return;
            } else {
               say(cat.name + " eats the " + target.name, cat, "see");
               eat(cat, target);
            }
         } else {
            say(cat.name + " leers around hungrily, looking for its next meal", cat, "see");
         }
      }
   }
}

parameters.carnivoreFilter = {
   values: {
      1: "likes to eat meat"
   },
   revealed_by : [
      "biology_knowledge", "psychology_knowledge"
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
      "biology_knowledge", "psychology_knowledge"
   ],
   functions : {
      "thinkHungry" : function(me, body) {
         if (is(body.mobile)) {
            var plant = pickRandom(getVisibleObjects(body).filter(function(a) {
               return a.material === materials.plant;
            }));

            if (plant !== undefined) {
               if (not(plant.small)) {
                  say(body.name + " nibbles on " + plant.name, body, "see");
                  var plantBit = duplicateObject(plant);
                  plantBit.name = "a bit of nibbled plant matter";
                  plantBit.big = 0;
                  plantBit.small = 1;
                  eat(body, plantBit);
               } else {
                  eat(body, plantBit);
               }
            } else {
               say(body.name + " sniffs around hungrily", body, "see");
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
         var owner = getBrainOwner(me);
         if (owner === undefined) return;

         var room = getRoom(me);
         if (room === undefined) return;

         if (is(owner.mobile)) {
            moveObject(me.parent, Math.floor(Math.random() * room.width), Math.floor(Math.random() * room.height), true);
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
         var owner = getBrainOwner(me);
         if (owner) {
            say(getBrainOwner(me).name + " dozes off.", owner, "see");
         }
         sub(me, "conscious");
      },
      "sub" : function(me) {
         var owner = getBrainOwner(me);
         if (owner) {
            say(getBrainOwner(me).name + " wakes up.", owner, "see");
         }
         add(me, "conscious");
      }
   }
}

parameters.catBrain = {
   values : {
      1: "thinks like a cat"
   },
   functions : {
      thinkBored : function(me, body){
         if (Math.random() < .25) {
            say(body.name + " meows lazily", me, "say");
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
function getTasty(brain) {
   var body = getBrainOwner(brain);
   var tasties = getRoom(brain).contents.slice();
   tasties.splice(tasties.indexOf(body), 1);
   call(brain, "filterFood", tasties);
   return pickRandom(tasties);
}
