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
   form: "pit",
   name: "fire pit",
   material: "stone",
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
   isLiquid: 1,
   size: 5,
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
