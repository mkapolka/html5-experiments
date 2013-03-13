parameters.catThink = {
   values: {
      1: "thinks like a cat"
   },
   revealed_by : [
      "biology_knowledge", "psychology_knowledge", "animal_knowledge"
   ],
   functions : {
      "think" : function(me) {
         if (me.parent !== undefined && not(me.parent.isRoom)) {
            var cat = me.parent;
            if (not(cat.living)) return;
            if (not(me.conscious)) return;

            if (is(cat.holding) && is(cat.holding.alive)) {
               if (Math.random() < .5) {
                  pushGameText(cat.name + " thrashes " + cat.holding.name + " around");
                  call(cat.holding, "jostle", cat);
               } else {
                  call(cat, "drop", cat.holding);
               }
            }

            //Hungry
            if (is(cat.hungry)) {
               var room = getObjectRoom(cat);
               var tasties = room.contents.filter(function(a) {
                  return a.material === materials.flesh && is(a.small);
               });

               //Sort based on relevant factors
               tasties.sort(function(a,b) {
                  function tastiness(v) {
                     var o = 0;
                     if (v.material === materials.flesh) o++;
                     if (is(v.living)) o--;
                     if (is(v.nutritious)) o++;
                     if (is(v.cooked)) o++;
                     if (is(v.edible)) o++;
                  }
                  var ta = tastiness(a);
                  var tb = tastiness(b);
                  if (ta > tb) {
                     return 1;
                  }
                  if (ta < tb) {
                     return -1;
                  } else {
                     return 0;
                  }
               });

               if (tasties.length === 0) return;
               var obj = tasties[0];
               //Found something tasty looking
               //Kill the animal
               if (is(obj.living)) {
                  if (Math.random() < .25) {
                     pushGameText(cat.name + " eats the " + obj.name);
                     eat(cat, obj);
                     return;
                  }

                  if (Math.random() < .25) {
                     if (not(obj.open)) {
                        call(cat, "attack", obj);
                     } else {
                        pushGameText(cat.name + " bats " + obj.name + " around");
                        call(obj, "jostle", cat);
                     }

                     return;
                  }

                  if (Math.random() < .5) {
                     pushGameText(cat.name + " picks up " + obj.name + " in " + getPronoun(cat, "his") + " mouth.");
                     call(cat, "pickup", obj);
                  }
               } else {
                  pushGameText(cat.name + " eats the " + obj.name);
                  eat(cat, obj);
               }

               if(isVisible(cat)) {
                  pushGameText(cat.name + " prowls around looking for a meal");
               }

               return;
            }

            if (is(me.parent.parent.isRoom)) {
               var room = getObjectRoom(me);
               moveObject(me.parent, Math.floor(Math.random() * room.width), Math.floor(Math.random() * room.height), true);
            }
         }
      }
   }
}

parameters.sentient = {
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

         if (is(me.hungry)) {
            call(me, "thinkHungry");
            return;
         }

         if (is(me.angry)) {
            call(me, "thinkAngry");
            return;
         }

         if (is(me.calm)) {
            call(me, "thinkCalm");
            return;
         }
      }
   }
},
