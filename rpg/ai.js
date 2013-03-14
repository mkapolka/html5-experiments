parameters.sentient = {
   values: {
      1: "is sentient"
   },
   revealed_by : [
      "biology_knowledge"
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
      "tick" : function(me) {
         if (is(me.stressed)) {
            if (Math.random() < .3) {
               pushGameText(getBrainOwner(me).name + " calms down.");
               sub(me, "stressed");
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

parameters.satiable = {
   values: {
      1: "'s hunger can be sated"
   },
   revealed_by : [
      "biology_knowledge", "psychology_knowledge"
   ],
   functions : {
      "eat" : function(me, what) {
         if (is(me.hungry)) {
            me.hungry -= 1;
         }
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
                  pushGameText(cat.name + " gobbles up the poor " + target.name);
                  eat(cat, target);
                  return;
               }

               call(cat, "attack", target);
               return;
            } else {
               pushGameText(cat.name + " eats the " + target.name);
               eat(cat, target);
            }
         } else {
            pushGameText(cat.name + " leers around hungrily, looking for its next meal");
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
            pushGameText(getBrainOwner(me).name + " dozes off.");
         }
         sub(me, "conscious");
      },
      "sub" : function(me) {
         var owner = getBrainOwner(me);
         if (owner) {
            pushGameText(getBrainOwner(me).name + " wakes up.");
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
            pushGameText(body.name + " meows lazily");
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
