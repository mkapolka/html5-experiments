forms = {
   "player" : {
      symbol: "@",
      actions : {
         "move" : {
            
         }
      },
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
   },

   "pit" : {
      symbol: "P",
      open: 1,
      big: 1,
      contents: []
   },

   "liquid" : {
      symbol: "~",
      isLiquid: 1
   },

   "cat" : {
      symbol: "C",
      contents : ["catBrain", "catHeart", "blood", "catStomach"],
   },

   "mouse" : {
      symbol: "M",
      contents: ["mouseBrain", "mouseHeart", "blood"],
      small: 1,
   },

   "brain" : {
      symbol: "B",
      living: 1,
      oxygenated: 1,
      sentient: 1,
      conscious: 1,
   },

   "heart" : {
      symbol: "<3",
      living: 1,
      oxygenated: 1,
   },

   "stomach" : {
      symbol: "S",
      living: 1,
      digestive: 1,
      gagReflex: 1,
      oxygenated: 1,
      hungry: 0,
      sated: 0
   },
}

materials = {
   "plant" : {
      name: "plant matter",
      flammable : 1,
      phlogiston: 1,
   },
   "wood" : {
      name: "wood",
      flammable: 1,
      phlogiston: 1,
   },
   "metal" : {
      name: "metal",
      flammable: -1,
      watertight: 1,
      dense: 1,
      hard: 1
   },
   "flesh" : {
      name: "flesh",
      watertight: 1,
      cookable : 1,
      soft: 1
   },
   "stone" : {
      name: "stone",
      watertight: 1,
      hard: 1,
      dense: 1,
      flammable: -1
   },
   "paper" : {
      name: "paper",
      watertight: -1,
      flammable: 1,
      phlogiston: 1,
      light: 1,
   },
   "water" : {
      name: "water",
      isLiquid: 1,
      flammable: -1,
      boilable: 1,
   },
   "blood" : {
      name: "blood",
      isLiquid: 1,
      isBlood: 1,
      boilable: -1
   }
}
