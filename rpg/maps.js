maps = {};
//GARDEN

maps.garden = {
   name : "The Monastery Garden",
   map: [
   "...O......",
   ".M...L..C.",
   ".....LL.S.",
   "..PP...S..",
   "..P.......",
   ".....W....",
   "........TT",
   "..@......T",
   ".#<###>##.",
   "H########.",
   ],

   key : {
      L : "lavender",
      S : "coriander",
      P : "peppermint",
      T : "tea",
      W : "well",
      C : "cat",
      M : "mouse",
      H : "mouse_hole",
      "#" : "stone_wall",
      "@" : function(x,y) {
         window.player = createObjectFromTemplate("player"); 
         return player;
      },
      ">" : door("library"),
      "<" : door("kitchen"),
      "O" : door("cave")
   }
}

templates.lavender = {
   name: "a lavender bush",
   form: "bush",
   material: "plant",
   calming: 1,
   soluble: 1,
}

templates.coriander = {
   name: "a coriander bush",
   form: "bush",
   material: "plant",
   angering: 1,
   soluble: 1
}

templates.peppermint = {
   name: "a peppermint plant",
   form: "bush",
   material: "plant",
   gagSuppressing : 1,
   soluble: 1,
}

templates.tea = {
   name: "a tea bush",
   form: "bush",
   material: "plant",
   soluble: 1,
   stimulating: 1,

}

//LIBRARY

maps.library = {
   name : "The Dusty Library",
   map: [
   "###WWWW###",
   "#....NH..#",
   "#C......P#",
   "#........#",
   "#........#",
   "#B.......#",
   "#........#",
   "#........#",
   "#XXX...>.#",
   "##########",
   ],

   key : {
      "B" : "bio_book",
      "C" : "chem_book",
      "P" : "psych_book",
      ">" : door("garden"),
      "#" : "stone_wall",
      "X" : "box",
      "W" : "window",
      "H" : "chair",
      "N" : "needle",
   }
}

templates.chem_book = {
   name : "a chemistry textbook",
   form : "book",
   material : "paper",
   revealType: "alchemy_knowledge"
}

templates.psych_book = {
   name: "a psychology textbook",
   form: "book",
   material: "paper",
   revealType: "psychology_knowledge",
}

templates.bio_book = {
   name : "a biology textbook",
   form : "book",
   material : "paper",
   revealType: "biology_knowledge"
}

templates.window = {
   name: "a stained glass window",
   material: "glass",
   big: 1,
   rooted: 1,
}

templates.chair = {
   name: "a chair",
   material: "wood"
}

templates.needle = {
   name: "a needle and thread",
   material: "metal",
   form: "needle",
}

templates.box = {
   name: "a box",
   material: "wood",
   contents: [],
   openable: 1,
   open: 1
}

templates.stone_wall = {
   name : "a stone wall",
   material: "stone",
   form: "wall",
   big: 1,
   rooted: 1,
}

//KITCHEN

maps.kitchen = {
   name : "Brother Buddy's Kitchen",
   map: [
   "..........",
   "..........",
   "..####>#..",
   "..#BXX.###",
   "..#.....U#",
   "..#....###",
   "..#KPCL#..",
   "..######..",
   "..........",
   "..........",
   ],

   key : {
      ">" : door("garden"),
      "#" : "stone_wall",
      "X" : "box",
      "K" : "kettle",
      "P" : "fire_pit",
      "C" : "collander",
      "B" : "cupboard",
      "L" : "lard_jar",
      "U" : "bucket",
   }
}

templates.cupboard = {
   name : "a kitchen cupboard",
   material: "wood",
   contents : [
      "knife", "fork", "mallet"
   ],
   openable: 1,
   open: 0,
   big: 1,
   rooted: 1,
}

templates.knife = {
   name: "a knife",
   material: "metal",
   symbol: "/",
   small: 1,
   bladed: 1,
}

templates.mallet = {
   name: "a mallet",
   material: "metal",
   symbol: "t",
   small: 1,
   actionsHeld : {
      "Bash" : function(me, caller, target) {
         say("You bash " + target.name + "!", caller, "do");
         call(target, "bash");
      }
   }
}

templates.fork = {
   name: "a fork",
   material: "metal",
   symbol: "Y",
   small: 1,
   pointy : 1,
}

templates.lard_jar = {
   name: "a jar of delicious lard",
   form: "jar",
   material: "glass",
   small: 1,
   contents: ["lard"],
}

templates.lard = {
   name: "some lard",
   form: "salve",
   edible: 1,
   functions : {
      "touch" : function(me, other) {
         if (not(other.edible)) {
            add(other, "edible");
         }
      }
   }
}

templates.bucket = {
   form: "bucket",
   name: "a dirty washbucket",
   material: "wood",
   contents: [ "water", "sponge" ],
}

maps.cave = {
   name: "A Dank Cave",
   map: [
   "##########",
   "####>#####",
   "##.....###",
   "#H..T...M#",
   "#........#",
   "#........#",
   "#M......M#",
   "##.....###",
   "###.######",
   "###.<#####",
   ],
   key : {
      "<" : door("garden"),
      ">" : door("lab"),
      "#" : "stone_wall",
      "T" : "troll",
      "H" : "mouse_hole",
      "M" : "moss",
   }
}

templates.moss = {
   name: "a wet moss",
   symbol: "m",
   material: "plant",
   angering: 1,
   wet: 1,
}

maps.lab = {
   name: "A Defiled Laboratory",
   map: [
   "##########",
   "#........#",
   "#....H...#",
   "#J......J#",
   "#J...D..J#",
   "#J......J#",
   "#........#",
   "#........#",
   "#........#",
   "#####>####",
   ],
   key : {
      ">" : door("cave"),
      "#" : "stone_wall",
      "J" : "formaldehyde_jar",
      "D" : "homunculus_dish",
      "H" : "hom_jar",
   }
},

templates.formaldehyde_jar = {
   name : "a jar of formaldehyde",
   form: "jar",
   contents: [ "formaldehyde" ],
   material: "glass", 
}

templates.formaldehyde = {
   name: "some formaldehyde",
   form: "liquid",
   flammable : 1,
   boilable : 1,
   functions : {
      "touch" : function(me, other) {
         if (other.rotting !== undefined) {
            say(other.name + " is preserved by " + me.name, other, "see");
            del(other, "rotting");
         }
      }
   }
}

templates.homunculus_dish = {
   name: "a white porcelain dish",
   form: "bucket",
   material: "glass",
   contents : [ "heart", "stomach", "blood" ],
}

templates.hom_jar = {
   name: "a curio jar",
   form: "jar",
   material: "glass",
   contents : [ "homunculus", "formaldehyde"],
}

templates.homunculus = {
   name: "a shriveled body",
   material: "flesh",
   animated: 1,
   contents: [],
   openable: 1,
   open: 0,
}

function door(target) {
   var output = createObjectFromTemplate("door");
   $("document").ready(function() {
      output.name = "To " + maps[target].name; 
   });
   output.destination = target;
   return output;
}

