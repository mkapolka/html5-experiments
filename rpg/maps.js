maps = {};
maps.garden = {
   name : "The Monastary Garden",
   map: [
   "..........",
   ".M......C.",
   ".H...L....",
   "..........",
   "..........",
   ".....W....",
   "..........",
   "..@.......",
   ".#####>##.",
   ".########.",
   ],

   key : {
      L : "lavender",
      W : "well",
      C : "cat",
      M : "mouse",
      H : "mouse_hole",
      "#" : "stone_wall",
      "@" : function(x,y) {
         window.player = createObjectFromTemplate("player"); 
         return player;
      },
      ">" : door("library")
   }
}

maps.library = {
   name : "The Dusty Library",
   map: [
   "##########",
   "#........#",
   "#C.......#",
   "#........#",
   "#........#",
   "#B.......#",
   "#........#",
   "#........#",
   "#......>.#",
   "##########",
   ],

   key : {
      "B" : "bio_book",
      "C" : "chem_book",
      ">" : door("garden"),
      "#" : "stone_wall"
   }
}

templates.stone_wall = {
   name : "a stone wall",
   material: "stone",
   form: "wall",
   big: 1,
   rooted: 1,
}

function door(target) {
   var output = createObjectFromTemplate("door");
   $("document").ready(function() {
      output.name = "To " + maps[target].name; 
   });
   output.destination = target;
   return output;
}

