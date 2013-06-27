templates = {};

templates.player = {
   name: "You, the player",
   form: "person",
   color: "black",
   material: "flesh",
   contents: ["heart", "stomach", "brain", "blood"],
   holding: undefined,
}

templates.heart = {
   name: "a heart",
   form: "heart",
   small: 1,
   material: "flesh",
   lendsProperties : "cardiovascular",
   bloodPumping: 1,
   functions: {
      "heartbeat" : function(me) {
         say(me.name + " beats.", me, "see");
      }
   }
}

templates.stomach = {
   name: "a stomach",
   form: "stomach",
   material: "flesh",
   small: 1,
   lendsProperties: "gastrointestinal",
   digesting: 1,
   gagReflex: 1,
   homeostatic: 1,
   hungry: 0,
   stomach: [],
}

templates.brain = {
   name: "a brain",
   form: "brain",
   material: "flesh",
   lendsProperties: "psychological",
   sentient: 1,
   conscious: 1,
}

templates.cat = {
   name: "Theophile the cat",
   form: "cat",
   material: "flesh",
   contents: ["heart", "stomach", "brain", "blood"],
   living: 1,
   male: true,
   carnivoreGag: 1,
}

templates.mouse = {
   name: "a field mouse",
   form: "mouse",
   material: "flesh",
   contents: ["heart", "stomach", "brain", "blood"],
   soft: 1,
   herbivoreStomach: 1,
}

templates.troll = {
   name: "a hideous troll",
   form: "troll",
   material: "flesh",
   contents : [ "heart", "stomach", "brain", "trollBlood"],
   holding: "club",
   carnivoreGag: 1,
}

templates.club = {
   name: "an enormous wooden club",
   material: "wood",
   bludgeoning: 1,
}

templates.blood = {
   name: "some blood",
   form: "liquid",
   material: "blood",
}

templates.trollBlood = {
   name: "some troll blood",
   form: "liquid",
   material: "blood",
   trollBlood: 1,
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

templates.kettle = {
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

