//Archive of all the properties

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
