forms = {
   "player" : {
      symbol: "@",
      actions : {
         "move" : {
            
         }
      }
   },

   "book" : {
      symbol: "B",
      phlogiston: 1,
      durability: 1,
      small: 1,
      actionsHeld : {
         "Cross Reference" : function(me, caller, target) {
            if (target === undefined) return;
            moveAdjacentTo(caller, target);
            pushGameText("You rifle through the pages, searching for information about " + target.name + 
            revealToHTML(reveal(target, me.revealType)));
         }
      }
   },

   "bush" : {
      symbol : "T",
      big: 1,
      actionsStanding : {
         "Pinch" : function(me, caller) {
            moveAdjacentTo(caller, me);  
            pushGameText("You pinch off a sprig of " + me.name);
            var dup = duplicateObject(me);
            dup.name = "a sprig from " + me.name;
            dup.big = undefined;
            setContainer(dup, room);
         }
      }
   },

   "kettle" : {
      symbol: "K",
      openable: 1,
      open: 1,
      watertight: 1,
      small: 1,
      hollow: 1,
   }
}

materials = {
   "plant" : {
      flammable : 1,
      phlogiston: 1,
   },
   "wood" : {
      flammable: 1,
      phlogiston: 1,
   },
   "metal" : {
      flammable: -1,
      watertight: 1,
      dense: 1,
      hard: 1
   }
}
