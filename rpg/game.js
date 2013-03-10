//Game methods

var room_contents = [
   lavender, tea_kettle, fire_pit, player
];

//Object that contains the data for the currently loaded room
//(Walls and Objects)
var room;

var current_action = undefined;
var selected_tile = undefined;

function setupRoom(width, height)
{
   var output = {};

   output.objects = [];

   //Initialize data grid
   output.data = [];
   for (var w = 0; w < width; w++){
      var column = [];
      for (var h = 0; h < height; h++){
         var cell = {};
         column.push(cell);
      }
      output.data.push(column);
   }
   
   //Initialize html table
   var table = $("<table class='tiles noselect'></table>");
   for (var w = 0; w < width; w++)
   {
      var row = $("<tr></tr>");
      for (var h = 0; h < height; h++)
      {
         var td = $("<td></td>");
         td[0].x = w;
         td[0].y = h;
         row.append(td);
         output.data[w][h].cell = td[0];
      }
      table.append(row);
   }
   output.table = table;

   $("#tiles_container").append(output.table);

   $(".tiles td").hover(function() {
      if (selected_tile === undefined)
      {
         setHoverTextTile(room, this.x, this.y);
      }
   });

   $(".tiles td").click(function() {
      $(selected_tile).removeClass("selected");
      if (selected_tile !== $(this)[0])
      {
         selected_tile = $(this)[0];
         $(this).addClass("selected");
         selectTile($(this)[0], room);
      } else {
         if (selected_tile !== undefined)
         {
            deselectTile(selected_tile);
            setHoverTextTile(room, this.x, this.y);
         }
      }
   });

   return output;
}

function getObjectsAt(room, x, y, contents)
{
   var output = [];
   for (var i in room.objects)
   {
      var obj = room.objects[i];
      if (obj.x == x && obj.y == y)
      {
         output.push(obj);

         if (contents && obj.contents !== undefined)
         {
            for (var o in obj.contents)
            {
               output.push(obj.contents[o]);
            }
         }
      }
   }
   return output;
}

function setHoverTextTile(room, tileX, tileY)
{
   var objects = getObjectsAt(room, tileX, tileY);

   var text = "";
   
   for (var i in objects)
   {
      if (objects[i].name !== undefined)
      {
         text += objects[i].name + "\n";
      }
   }

   setHoverText(text);
}

function selectTile(which, room)
{
   setHoverTextTile(room, which.x, which.y);

   showActionButtons(room, which.x, which.y);
}

function deselectTile(tile)
{
   if (tile !== undefined)
   {
      $(tile).removeClass("selected");
      selected_tile = undefined;
   }

   $("#hoverbuttons").empty();
   $("#hovertext").empty();
}

function showActionButtons(room, x, y)
{
   var actions = [];
   var objects_here = getObjectsAt(room, x, y);

   //Actions
   actions.push("Walk Here");

   if (objects_here.length > 0)
   {
      actions.push("Get");
      actions.push("Look");
      actions.push("Feel");
   }

   if (player.holding !== undefined)
   {
      actions.push("Put");
   }

   //Player specific actions
   if (objects_here.indexOf(player) !== -1)
   {
      actions.push("Wait");
   }

   var objects = [];
   for (var i in actions)
   {
      objects.push({"type":actions[i], "x" : x, "y" : y});
   }
   
   var thingButtons = makeOptions(actions, objects, doAction);

   $("#hoverbuttons").empty();
   $("#hoverbuttons").append(thingButtons);
}

function doAction(action)
{
   switch (action.type)
   {
      case "Walk Here":
         player.x = action.x;
         player.y = action.y;
         updateTileText(room);
         pushGameText("You walk over there.");
         deselectTile(selected_tile);
      break;

      case "Look":
         showObjectButtons(room, action.x, action.y, function(object) {
            pushGameText(revealToHTML(reveal(object, "look")));
            deselectTile(selected_tile);
         });
      break;

      case "Feel":
         if (!isAdjacent(player.x, player.y, action.x, action.y)){
            pushGameText("You cannot feel that from here! Move closer.");
            deselectTile(selected_tile);
         } else {
            showObjectButtons(room, action.x, action.y, function(object) {
               pushGameText(revealToHTML(reveal(object, "feel")));
               deselectTile(selected_tile);
            });
         }
      break;

      case "Wait":
         pushGameText("You wait a bit.");
      break;

      case "Get":
         if (!isAdjacent(player.x, player.y, action.x, action.y)){
            pushGameText("You cannot take that from here! Move closer.");
            deselectTile(selected_tile);
         } else {
            showObjectButtons(room, action.x, action.y, function(object) {
               pickup(object);
               deselectTile(selected_tile);
            });
         }
      break;

      case "Put":
         if (!isAdjacent(player.x, player.y, action.x, action.y)){
            pushGameText("You cannot put that from where you are! Move closer.");
            deselectTile(selected_tile);
         } else {
            showLocationButtons(room, action.x, action.y, function(object) {
               if (object.isFloor) {
                  putDownAt(object.x, object.y);
               } else {
                  putDownIn(object);
               }
            });
         }
      break;
   }

   doTick(room);
}

function showObjectButtons(room, x, y, callback)
{
   var names = [];
   var objects = [];
   var objects_here = getObjectsAt(room, x, y, true);

   if (objects_here.length == 1)
   {
      callback(objects_here[0]);
      return;
   }
   
   for (var o in objects_here)
   {
      var obj = objects_here[o];
      names.push(obj.name);
      objects.push(obj);

      if (obj.contents !== undefined)
      {
         for (var o2 in obj.contents)
         {
            var obj2 = obj.contents[o2];
            names.push(obj2.name + "(inside " + obj.name + ")");
            objects.push(obj2);
         }
      }
   }

   var buttons = makeOptions(names, objects_here, callback);

   $("#hoverbuttons").empty();
   $("#hoverbuttons").append(buttons);
}

//Shows button representing locations to put something on a particular tile.
//This includes the tile itself as well as any objects that are containers
function showLocationButtons(room, x, y, callback)
{
   var obAt = getObjectsAt(room, x, y);

   if (obAt.length == 0)
   {
      callback({"isFloor":true, "x":x,"y":y});
      return;
   }
   
   var names = [];
   var objects = [];

   names.push("On the ground");
   objects.push({"isFloor":true, "x":x,"y":y});


   for (var o in obAt)
   {
      if (obAt[o].contents !== undefined)
      {
         names.push("Inside " + obAt[o].name);
         objects.push(obAt[o]);
      }
   }

   var buttons = makeOptions(names, objects, callback);

   $("#hoverbuttons").empty();
   $("#hoverbuttons").append(buttons);
}


function pickup(object)
{
   pushGameText("You pick up " + object.name);
   room.objects.splice(room.objects.indexOf(object), 1);
   player.holding = object;
   updateTileText(room);
}

function putDownAt(x,y){
   if (player.holding !== undefined)
   {
      pushGameText("You put " + player.holding.name + " there.");
      addGameObject(player.holding, room, x, y);
      player.holding = undefined;
      updateTileText(room);
   }
}

function putDownIn(container)
{
   if (player.holding !== undefined)
   {
      pushGameText("You put " + player.holding.name + " inside " + container.name);
      container.contents.push(player.holding);
      player.holding.parent = container.contents;
      player.holding = undefined;
      updateTileText(room);
   }
}

function setHoverText(input)
{
   $("#hovertext").text(input);
}

function updateTileText(room)
{
   //game objects
   var tiles = $(".tiles td");
   tiles.text(".");

   for (var i in room.objects)
   {
      var object = room.objects[i];

      $(room.data[object.x][object.y].cell).text(getGlyph(object));
   }
}

function addGameObject(object, room, x, y)
{
   if (x > room.data.length || y > room.data[0].length) {
      return;
   }
   object.x = x;
   object.y = y;
   object.parent = room.objects;
   room.objects.push(object);
}

function pushGameText(string)
{
   $(".gametext").prepend("<li>" + string + "</li>");
}

function pushHTML(htmlString)
{
   $(".gametext").append(htmlString);
}

function makeOptions(strings, options, callback)
{
   var container = $("");
   for (var o in options)
   {
      var button = $("<div class='button noselect'>" + strings[o] + "</div>");
      button[0].value = options[o];
      button.click(function() {
         callback(this.value);
      });
      container = container.add(button);
   }

   return container;
}

function click_object(object)
{
   if (current_action === "look")
   {
      pushGameText(revealToHTML(reveal(game_objects[object], "look")));
   }

   if (current_action === "feel")
   {
      pushGameText(revealToHTML(reveal(game_objects[object], "feel")));
   }

   if (current_action = "grab")
   {
      currently_held = game_objects[object];
      pushGameText("You pick up the " + game_objects[object].name);
      $("#grabbutton").hide();
      $("#putbutton").show();
   }

   if (current_action = "put")
   {
      currently_held = undefined;
      $("#putbutton").hide();
      $("#grabbutton").show();
   }

   $("#objects").hide();
   $("#actions").show();

   doTick(room);
}

function game_init()
{
   room = setupRoom(10, 10);

   for (var i in room_contents)
   {
      addGameObject(room_contents[i], room, Math.floor(Math.random () * 10), Math.floor(Math.random() * 10));
   }
   updateTileText(room);

   //describeRoom();
}
