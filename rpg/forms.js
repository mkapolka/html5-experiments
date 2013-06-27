function creature(c) {
   c.push("blood");
   c.push("brain");
   c.push("stomach");
   c.push("heart");
}
forms = {
   "person" : {
      symbol: "@",
      big: 1,
      animated: 1,
      mobile: 1,
   },
   "organ" : {
      isOrgan : 1,
   },
   "cat" : {
      symbol: "C",
      contents : [],
      holding: undefined,
      clawed: 1,
      animated: 1,
      mobile: 1,
      oxygenated: 1,
      living: 1,

      //bio

      //AI
      hungry: 1,
      escapeArtist: 1,
      stressedAttack: 1,
      hunterThink: 1,
      wanderBored: 1,
      catBrain: 1,
      tummyRub : 1,
   },
   "mouse" : {
      symbol: "M",
      small: 1,
      soft: 1,
      animated: 1,
      mobile: 1,

      //AI
      hungry: 1,
      escapeArtist: 1,
      stressedAttack: 1,
      herbivoreNibble: 1,
      herbivoreGag: 1,

      wanderBored: 1,
   },
   "troll" : {
      symbol: "T",
      big: 1,
      mobile: 1,
      animated: 1,

      carnivoreGag: 1,

      //AI
      hunterThink : 1,
      stressedAttack : 1,
      wanderBored: 1,
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
   "needle" : {
      symbol: "/",
      small: 1,
      actionsHeld : {
         "Sew" : function(me, caller, target) {
            if (is(target.soft) && is(target.open)) {
               moveAdjacentTo(caller, target);
               say("You sew " + target.name + " closed", caller, "do");
               sub(target, "open");
            } else {
               if (not(target.soft)) {
                  say("Your needle can't penetrate that!", caller, "do");
                  return;
               }

               if (not(target.open)) {
                  say("You can't sew that shut because it's not open!", caller, "do");
                  return;
               }
            }
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
            dup.edible = 1;
            dup.big = undefined;
            setContainer(dup, getRoom(me));
         }
      }
   },
   "kettle" : {
      symbol: "K",
      openable: 1,
      open: 0,
      small: 1,
      hollow: 1,
      functions : {
         "tick" : function(me) {
            if (me.contents.some(function(a) { return is(a.boiling); })) {
               say(me.name + " whistles excitedly!", me, "say");
            }
         }
      }
   },
   "pit" : {
      symbol: "P",
      open: 1,
      big: 1,
      contents: []
   },
   "liquid" : {
      symbol: "~",
      isLiquid: 1,
      holdable: 0,
   },
   "salve" : {
      symbol: "~",
      thick: 1,
      isLiquid: 1,
   },
   "brain" : {
      symbol: "B",
      small: 1,
   },
   "heart" : {
      symbol: "<3",
   },
   "stomach" : {
      symbol: "S",
   },
   "mouse_hole" : {
      spawnsMice : 1,
   },
   "well" : {
      symbol: "W"
   },
   "sponge" : {
      symbol: "S"
   },
   "door" : {
      symbol: ">"
   },
   "jar" : {
      symbol: "J",
      contents: [],
      openable: 1,
      open: 1,
   },
   "bucket" : {
      symbol: "U",
      contents : [],
      open: 1,
      watertight: 1,
   },
   wall : {
      name: "wall",
      symbol: "#",
   }
}

materials = {
   "plant" : {
      name: "plant matter",
      flammable : 1,
      phlogiston: 1,
      rotten : 0,
      color: "green"
   },
   "wood" : {
      name: "wood",
      flammable: 1,
      phlogiston: 1,
      color: "brown"
   },
   "metal" : {
      name: "metal",
      flammable: -1,
      watertight: 1,
      dense: 1,
      hard: 1,
      color: "gray"
   },
   "flesh" : {
      name: "flesh",
      watertight: 1,
      cooked : 0,
      soft: 1,
      oxygenated: 1,
      living: 1,
      feelsPain: 1,
      rotting: 0,
      color: "#BB1111",
      functions : {
         "slash" : function(me) {
            if (not(me.hard) && not(me.lacerated)) {
               add(me, "lacerated");
            }
         },
      }
   },
   "stone" : {
      name: "stone",
      watertight: 1,
      hard: 1,
      dense: 1,
      flammable: -1,
      color: "black",
   },
   "paper" : {
      name: "paper",
      watertight: -1,
      flammable: 1,
      phlogiston: 1,
      light: 1,
      color: "white",
   },
   "water" : {
      name: "water",
      isLiquid: 1,
      flammable: -1,
      boilable: 1,
      color: "blue",
      edible: 1,
   },
   "blood" : {
      name: "blood",
      isLiquid: 1,
      isBlood: 1,
      boilable: -1,
      oxygenated: 1,
      color: "red",
   },
   "sponge" : {
      name: "sponge",
      watertight: 1,
      color: "yellow",
      actionsHeld : {
         "Sop" : function(me, caller, target) {
            if (is(target.isLiquid)) {
               moveAdjacentTo(caller, target);
               pushGameText("You sop up " + target.name);
               setContainer(target, me);
               combineByType(me, me, target, ["chemical"]);
            }
         },
         "Wring" : function(me, caller, target) {
            if (!target.isTile && (not(target.contents) || not(target.open))) {
               pushGameText("You can't wring the sponge into that!");   
            }

            var out = [];
            for (var v in me.contents) {
               if (is(me.contents[v].isLiquid)) {
                  out.push(me.contents[v]);
               }
            }

            moveAdjacentTo(caller, target);
            if (not(target.isTile)) {
               for (var v in out) {
                  setContainer(out[v], target);
               }
               pushGameText("You wring the contents of the sponge into " + target.name);
            } else {
               for (var v in out) {
                  setContainer(out[v], getRoom(me));
                  moveObject(out[v], target.x, target.y);
               }
               pushGameText("You wring the contents of the sponge onto the floor.");
            }

         }
      }
   },
   "glass" : {
      name: "glass",
      color: "white",
      brittle: 1,
      watertight: 1,
   }
}
