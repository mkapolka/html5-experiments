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
   material: "flesh",
   contents: [],
   holding: undefined
}

templates.cat = {
   name: "Theophile the cat",
   form: "cat",
   material: "flesh",
   living: 1,
}

templates.catBrain = {
   name: "a cat brain",
   form: "brain",
   material: "flesh",
   living: 1,
   oxygenated: 1,
   catThink : 1,
}

templates.catHeart = {
   name: "a cat heart",
   form: "heart",
   material: "flesh",
   living: 1,
   oxygenated: 1,
   blood_pumping: 1,
}

templates.catStomach = {
   name: "a cat stomach",
   form: "stomach",
   material: "flesh",
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
   material: "flesh"
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

templates.bio_book = {
   name : "a biology textbook",
   form : "book",
   material : "paper",
   revealType: "biology_knowledge"
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
   form: "liquid",
   name: "some water",
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
