function makeRoom(room) {
   var rn = room;
   if (typeof room === "string") {
      room = maps[room];
      if (room === undefined) {
         console.log("Couldnt' find room with name " + rn);
      }
   }
   
   var output = {};
   output.contents = [];
   output.isRoom = 1;
   output.name = room.name;
      
   for (var x in room.map) {
      for (var y in room.map[x]) {
         var template = room.key[room.map[x][y]];
         if (template) {
            var obj;
            switch (typeof template) {
               case "string":
                  obj = createObjectFromTemplate(template);
               break;

               case "function":
                  obj = template(x,y);
               break;

               case "object":
                  obj = template;
               break;
            }
            setContainer(obj, output);
            moveObject(obj, parseInt(x), parseInt(y));
         }
      }
   }

   output.width = room.map[0].length;
   output.height = room.map.length;
   return output;
}
