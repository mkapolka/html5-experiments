burning_thing = {
   name: "a burning thing",
   form: "none",
   temperature: 10,
   flammable: 5,
   burning: 5,
   phlogiston: 10,
   durability: 10
}

lavender = {
   name: "lavender bush",
   form: "lavender",
   material: "plant",
   state: "solid",
   flammable: 7,
   aromatic: 5,
   calming: 6,
   edible: 4,
   soluble: 7,
   size: 3,
   density: 0,
   durability: 10,
   consume : function(me, consumer){
      consumer.calmness += me.calming;
   }
}

fire_pit = {
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

water = {
   form: "water",
   name: "water",
   material: "water",
   state: "liquid",
   flammable: 0,
   density: 5,
   temperature: 0,
   boilable: 6
}

tea_kettle = {
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
   temperature: 10,
   contents : [water],
   durability: 10
}

descriptions = {
   boilable: {
      values: {
         0: "would boil at room temperature",
         5: "would boil",
         6: "would boil if heated",
         10: "could conceivably boil"
      },
      default: 10,
      types: [ "chemical" ],
      functions : {
         "tick": function(me) {
            var temp = param_safe_get(me, "temperature");
            var boiling = param_safe_get(me, "boiling");
            if (temp > me.boilable && boiling <= 1)
            {
               pushGameText(me.name + " started boiling!");
               me.boiling = 10;
            }
         }
      }
   },

   boiling : {
      values: {
         5: "is boiling"
      },
      revealed_by : [
         "look"
      ],
      default: 0
   },

   flammable: {
      values: {
         0: "is completely inflammable",
         5: "is flammable",
         7: "is highly flammable",
         10: "is extremely flammable",
      },
      revealed_by : [
         "alchemy_knowledge"
      ],
      types: [ "chemical" ],
      functions : {
         "tick" : function(me)  {
            if (me.temperature > param_invert("flammable", me.flammable) && !me.burning > 0)
            {
               pushGameText("The " + me.name + " bursts into flames!");
               me.burning = me.flammable;
            }
         }
      }
   },

   temperature: {
      values: {
         0: "is ice cold",
         5: "is lukewarm",
         8: "is radiating waves of heat",
         10: "is faintly glowing with extreme heat"
      },
      revealed_by : [
         "feel", "look"
      ],
      functions : {
         "tick" : function(me) {
            if (me.contents !== undefined){
               for (var i in me.contents)
               {
                  call(me.contents[i], "heat", me.temperature);
               }
            }
         }, 
         "heat" : function(me, amount) {
            console.log(me.name + " wants to be heated. ");
            if (me.temperature < amount) {
               console.log(me.name + " was heated!");
               me.temperature = amount;
            }
         }
      }
   },

   burning: {
      values : {
         1: "is flickering with small flames",
         5: "is on fire!",
         10: "is covered in powerful flames!",
      },
      revealed_by: [
         "look",
      ],
      functions : {
         "tick": function(me) {
            call(me, "burn", me.burning);
         }
      }
   },

   phlogiston: {
      values : {
         1: "would easily shrug off a fire",
         5: "would be consumed by a fire",
         10: "would blink out of existence at the sight of a fire"
      },
      revealed_by: [
         "alchemy_knowledge"
      ],
      default: 0,
      functions : {
         "burn" : function(me, amount) {
            var phlog = param_safe_get(me, "phlogiston") * .1;
            call(me, "damage", amount * phlog);
         }
      }
   },

   density: {
      values: {
         0: "is almost insubstantial",
         4: "is fairly dense",
         10: "is extremely dense"
      }, 
      revealed_by : [
         "feel"
      ]
   }, 

   hardness: {
      values: {
         0: "is as soft as down",
         5: "is somewhat hard",
         10: "feels impenetrable"
      },
      revealed_by : [
         "feel"
      ]
   },

   size: {
      values: {
         0: "is almost invisibly tiny",
         1: "is as small as an acorn",
         2: "is no bigger than a fist",
         3: "is not bigger than a skull",
         5: "is about the size of a person",
         10: "is about as big as a house"
      }, 
      revealed_by : [
         "look"
      ]
   },

   durability: {
      values: {
         1: "is hanging onto existence by a string",
         5: "is quite damaged",
         10: ""
      },
      revealed_by: [
         "look",
      ],
      default: 10,
      functions : {
         "damage" : function(me, amount)
         {
            me.durability -= amount;

            if (me.durability < 0)
            {
               pushGameText(me.name + " is destroyed!");
               deleteObject(me);
            }
         }
      }
   }
}
