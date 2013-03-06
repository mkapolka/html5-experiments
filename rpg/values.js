//Archive of all the properties
RPG.properties = {
   density:{
      type: "number",
      descriptions : {
         0: "is not dense at all",
         5: "is quite dense",
         10: "is extremely dense"
      },
      revealed_by : [
         "feel"
      ]
   },

   flammability : {
      type: "number",
      descriptions: {
         0: "is inflammable",
         5: "is flammable",
      },
      revealed_by : [
         "alchemy_knowledge"
      ],
      events : [
      ]
   },

   toughness : {
      type: "number",
      descriptions: {
         0: "is very weak",
         5: "is pretty sturdy",
         10: "is nigh indestructable"
      },
      revaled_by : [
         "feel"
      ],
   },

   form: {
      type: "object",
      values : {
         
      }
   }

   soluble : {
      type: "number",
      descriptions : {
         0: "is insoluble",
         5: "is soluble"
      }

      revealed_by : [
         "alchemy_knowledge"
      ]

      events : {
         on_enter_container : function(self, container)
         {
            for (var object in container.contents)
            {
               if (container.contents[object].form === "liquid" && container.contents[object].temperature > self.soluble)
               {
                  
               }
            }
         }
      }
   }

   container : {
      
   }
}


lavender = {
   form: "lavender",
   material: "plant",
   flammable: 7,
   aromatic: 5,
   calming: 6,
   edible: 4,
   soluble: 7,
   consume = function(me, consumer){
      consumer.calmness += me.calming;
   }
}
