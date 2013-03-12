templates = {};

room =  {
   name: "The Room",
   form: "room",
   contents: [],
   isRoom: true
}

templates.player = {
   name: "You, the player",
   form: "player",
   contents: [],
   holding: undefined
}

templates.chem_book = {
   name : "a chemistry textbook",
   form : "book",
   material : "paper",
   revealType: "alchemy_knowledge"
}

templates.lavender = {
   name: "lavender bush",
   form: "bush",
   material: "plant",
   calming: 1,
   soluble: 1,
}

templates.coriander = {
   name: "coriander bush",
   form: "bush",
   material: "plant",
   angering: 1,
   soluble: 1
}

templates.saffron = {
   name: "coriander bush",
   form: "bush",
   material: "plant",
   hunger_inducing: 1,
   soluble: 1
}

templates.tea = {
   name: "tea bush",
   form: "bush",
   material: "plant",
   astringent: 1,
   soluble: 1
}

templates.poppy = {
   name: "poppy bush",
   form: "bush",
   material: "plant",
   anaesthetic: 1,
   soluble: 1
}

templates.fire_pit = {
   form: "fire pit",
   name: "fire pit",
   material: "stone",
   state: "solid",
   big: 1,
   hot: 1,
   burning: 1,
   functions : {
      "tick" : function(me) {
         if (!me.burning) {
            me.burning = 0;
         }
      }
   },
   contents : [],
}

templates.water = {
   form: "water",
   name: "water",
   material: "water",
   state: "liquid",
   density: 5,
   temperature: 5,
   boilable: 6,
   isLiquid: 10,
   size: 5,
}

templates.tea_kettle = {
   form: "tea kettle",
   name: "tea kettle",
   material: "metal",
   state: "solid",
   flammable: 0,
   density: 5,
   hardness: 8,
   hollow: 10,
   size: 4,
   watertight: 9,
   openable: 10,
   open: 0,
   temperature: 5,
   contents : ["water"],
}

materials = {
   "plant" : {
      flammable : 7,
      phlogiston: 10,
      density: 3
   },
   "wood" : {
      flammable: 8,
      phlogiston: 10,
      density: 4,
      watertight: 10,
   }
}
