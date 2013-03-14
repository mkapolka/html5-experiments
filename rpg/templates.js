templates = {};

templates.player = {
   name: "You, the player",
   form: "person",
   color: "black",
   material: "flesh",
   contents: ["playerStomach", "playerHeart", "playerBrain", "blood"],
   holding: undefined,
}

templates.playerStomach = {
   name: "your stomach",
   form: "stomach",
   material: "flesh"
}

templates.playerHeart = {
   name: "your heart",
   form: "heart",
   material: "flesh"
}

templates.playerBrain = {
   name: "your brain",
   form: "brain",
   material: "flesh",
   playerThink : 1,
}

templates.cat = {
   name: "Theophile the cat",
   form: "cat",
   material: "flesh",
   living: 1,
   male: true,
}

templates.catBrain = {
   name: "a cat brain",
   form: "brain",
   material: "flesh",
   carnivoreFilter: 1,
   sizeFilter: 1,
   hunterThink: 1,
   wanderBored: 1,
   stressedAttack : 1,
   catBrain: 1,

   hungry: 1
}

templates.catHeart = {
   name: "a cat heart",
   form: "heart",
   material: "flesh",
}

templates.catStomach = {
   name: "a cat stomach",
   form: "stomach",
   material: "flesh",
   carnivoreGag: 1,
}

templates.mouse = {
   name: "a field mouse",
   form: "mouse",
   material: "flesh",
   soft: 1,
   living: 1,
}

templates.mouseBrain = {
   name: "a mouse brain",
   form: "brain",
   material: "flesh",
   wanderBored: 1,
}

templates.mouseHeart = {
   name: "a mouse heart",
   form: "heart",
   material: "flesh",
}

templates.mouseStomach = {
   name: "a mouse stomach",
   form: "stomach",
   material: "flesh",
}

templates.blood = {
   name: "some blood",
   form: "liquid",
   material: "blood",
   isBlood: 1,
   oxygenated: 1,
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
}

templates.bio_book = {
   name : "a biology textbook",
   form : "book",
   material : "paper",
   revealType: "biology_knowledge"
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

templates.saffron = {
   name: "a coriander bush",
   form: "bush",
   material: "plant",
   hunger_inducing: 1,
   soluble: 1
}

templates.tea = {
   name: "a tea bush",
   form: "bush",
   material: "plant",
   astringent: 1,
   soluble: 1
}

templates.poppy = {
   name: "a poppy bush",
   form: "bush",
   material: "plant",
   anaesthetic: 1,
   soluble: 1
}

templates.fire_pit = {
   form: "pit",
   name: "fire pit",
   material: "stone",
   hot: 1,
   burning: 1,
   flameEternal: 1,
   contents : [],
}

templates.water = {
   form: "liquid",
   name: "some water",
   material: "water",
   isLiquid: 1,
}

templates.collander = {
   name: "a collander",
   material: "metal",
   watertight: -1,
   contents : []
}

templates.tea_kettle = {
   form: "kettle",
   name: "tea kettle",
   material: "metal",
   state: "solid",
   contents : ["water"],
}

templates.mouse_hole = {
   name: "a mouse hole",
   form: "mouse_hole",
}

templates.well = {
   name : "a well",
   form: "well",
   material: "stone",
   contents: ["water"],
   open: 1,
   isSpring: 1,
   big: 1,
   rooted : 1,
}

templates.sponge = {
   name : "a sponge",
   form : "sponge",
   material: "sponge",
   contents: [],
   small: 1
}

templates.door = {
   name : "a door",
   form: "door",
   symbol: ">",
   big: 1,
   rooted: 1,
   actionsStanding : {
      "Go through" : function(me, caller, target) {
         var destination = rooms[me.destination];
         if (destination !== undefined) {
            say("You travel to " + destination.name, me, "do");
            for (var v in destination.contents) {
               var d = destination.contents[v];
               if (d.destination !== undefined && rooms[d.destination] === getRoom(caller)) {
                  moveObject(caller, d.x, d.y, false);
               }
            }
            setContainer(caller, destination);
            $("h1").text(destination.name);
         } else {
            console.log("Couldn't find room " + me.destination + " so I couldn't send ", caller, " there!");
            say("You stub your toe on the threshold and trip.", me, "do");
         }
      }
   }
}

