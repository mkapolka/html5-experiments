templates = {};

room =  {
   name: "The Room",
   form: "room",
   contents: [],
   isRoom: true
}

player = {
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
   state: "solid",
   flammable: 3,
   temperature: 5,
   phlogiston: 10,
   aromatic: 5,
   calming: 6,
   edible: 4,
   soluble: 7,
   size: 3,
   density: 0,
   durability: 10
}

templates.fire_pit = {
   form: "fire pit",
   name: "fire pit",
   material: "stone",
   state: "solid",
   flammable: 0,
   density: 9,
   hardness: 7,
   size: 8,
   temperature: 10,
   hollow: 10,
   contents : [],
   durability: 10
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
   durability: 10
}
