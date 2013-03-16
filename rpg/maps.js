maps = {};
//GARDEN

maps.garden = {
   name : "The Monastary Garden",
   map: [
   "..........",
   ".M...L..C.",
   ".H...LL.S.",
   "..PP...S..",
   "..P.......",
   ".....W....",
   "..........",
   "..@.......",
   ".#<###>##.",
   ".########.",
   ],

   key : {
      L : "lavender",
      S : "coriander",
      P : "peppermint",
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
      "<" : door("kitchen")
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

//LIBRARY

maps.library = {
   name : "The Dusty Library",
   map: [
   "##########",
   "#........#",
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
      "X" : "box"
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

maps.kitchen = {
   name : "The Kitchen",
   map: [
   "..........",
   "..........",
   "..####>#..",
   "..#BXX.###",
   "..#......#",
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
      "L" : "lard_jar"
   }
}

templates.cupboard = {
   name : "a kitchen cupboard",
   material: "wood",
   contents : [
      "knife", "fork"
   ],
   openable: 1,
   open: 0,
   big: 1,
   rooted: 1,
}

templates.knife = {
   name: "a knife",
   material: "metal",
   small: 1,
   bladed: 1,
}

templates.fork = {
   name: "a fork",
   material: "metal",
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

function door(target) {
   var output = createObjectFromTemplate("door");
   $("document").ready(function() {
      output.name = "To " + maps[target].name; 
   });
   output.destination = target;
   return output;
}

