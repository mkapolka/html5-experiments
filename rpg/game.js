//Game methods

var room_contents = [
   "lavender", "tea_kettle", "fire_pit", "chem_book", "poppy", "coriander", "tea", "collander", "cat", "bio_book", "mouse", "mouse_hole", "well"
];

//Object that contains the data for the currently loaded room
//(Walls and Objects)
var room;

var current_action = undefined;
var selected_tile = undefined;

function setupRoom(width, height)
{
   var output = room;

   room.width = width;
   room.height = height;

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
   for (var i in room.contents)
   {
      var obj = room.contents[i];
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

      for (var o in objects_here) {
         var standingActions = getStandingActions(objects_here[o]);
         for (var a in standingActions) {
            if (actions.indexOf(a) === -1){
               actions.push(a);
            }
         }
      }
   }

   if (player.holding !== undefined)
   {
      actions.push("Put");

      //Held object actions
      var heldActions = getHeldActions(player.holding);

      for (var a in heldActions) {
         actions.push(a);
      }
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
         moveObject(player, action.x, action.y, true);
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
         showObjectButtons(room, action.x, action.y, function(object) {
            if (!isAdjacent(player.x, player.y, object.x, object.y)){
               moveAdjacentTo(player, object);
            } 
            pushGameText(revealToHTML(reveal(object, "feel")));
            updateTileText(room);
            deselectTile(selected_tile);
         });
      break;

      case "Wait":
         pushGameText("You wait a bit.");
      break;

      case "Get":
         showObjectButtons(room, action.x, action.y, function(object) {
            if (!isAdjacent(player.x, player.y, object.x, object.y)){
               moveAdjacentTo(player, object);
            } 
            pickup(object);
            updateTileText(room);
            deselectTile(selected_tile);
         });
      break;

      case "Put":
         showLocationButtons(room, action.x, action.y, function(object) {
            if (!isAdjacent(player.x, player.y, object.x, object.y)){
               moveAdjacentTo(player, object);
            } 
            if (object.isFloor) {
               putDownAt(object.x, object.y);
            } else {
               putDownIn(object);
            }
            updateTileText(room);
            deselectTile(selected_tile);
         });
      break;

      default:
         //Was it an action from an object the player is holding?
         if (player.holding !== undefined) {
            var heldActions = getHeldActions(player.holding);

            if (heldActions[action.type] !== undefined) {
               showObjectButtons(room, action.x, action.y, function(object) {
                  heldActions[action.type](player.holding, player, object);
                  updateTileText(room);
                  deselectTile(selected_tile);
               });
            }

            return;
         }

         //Standing action
         var object = undefined;
         var objectsHere = getObjectsAt(room, action.x, action.y, false);
         var names = [];
         var objects = [];
         
         for (var o in objectsHere) {
            var actions = getStandingActions(objectsHere[o]);
            if (actions[action.type] !== undefined) {
               names.push(objectsHere[o].name); 
               objects.push(objectsHere[o]);
            }
         }

         if (names.length > 1) {
            showOptions(names, objects, function(object) {
               object.actionsStanding[action.type](object, player); 
            });
         } else {
            if (objectsHere.length == 0) return;
            var standingActions = getStandingActions(objects[0]);
            standingActions[action.type](objects[0], player);
            updateTileText(room);
            deselectTile(selected_tile);
         }

         return;
      break;
   }

   doTick(room);
   updateTileText(room);
}

function showObjectButtons(room, x, y, callback)
{
   var names = [];
   var objects = [];
   var objects_here = getObjectsAt(room, x, y);

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
            if (isVisible(obj2)) {
               names.push(obj2.name + "(inside " + obj.name + ")");
               objects.push(obj2);
            }
         }
      }
   }

   if (objects.length === 0) {
      callback({x:x, y:y, isTile:true});
      return;
   }

   if (objects.length === 1)
   {
      callback(objects[0]);
      return;
   }

   var buttons = makeOptions(names, objects, callback);

   $("#hoverbuttons").empty();
   $("#hoverbuttons").append(buttons);
}

function showOptions(names, objects, callback) {
   var buttons = makeOptions(names, objects, callback);

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
      if (obAt[o].contents !== undefined && obAt[o].open > 0)
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
   if (object.big > 0) {
      pushGameText("That is too big to carry!");
      return;
   }

   if (is(object.isLiquid) || is(object.isGas) || is(object.rooted)) {
      pushGameText("You cannot pick that up!");
      return;
   }

   if (player.holding !== undefined) {
      pushGameText("You swap " + player.holding.name + " for " + object.name);
      moveObject(player.holding, object.x, object.y);
      player.holding.obscured = 0;
      player.holding = undefined;
   } else {
      pushGameText("You pick up " + object.name);
   }
   moveObject(object, player.x, player.y);
   player.holding = object;
   object.obscured = 1;
   updateTileText(room);
}

function putDownAt(x,y){
   if (player.holding !== undefined)
   {
      pushGameText("You put " + player.holding.name + " there.");
      moveObject(player.holding, x, y, true);
      setContainer(player.holding, player.parent);
      player.holding.obscured = 0;
      player.holding = undefined;
      updateTileText(room);
   }
}

function putDownIn(container)
{
   if (player.holding !== undefined)
   {
      pushGameText("You put " + player.holding.name + " inside " + container.name);
      setContainer(player.holding, container);
      player.holding.obscured = 0;
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

   for (var i in room.contents)
   {
      var object = room.contents[i];

      if (not(object.obscured)) {
         $(room.data[object.x][object.y].cell).text(getGlyph(object));
      }
   }
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
      var object = createObjectFromTemplate(room_contents[i]);
      moveObject(object, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), false);
      setContainer(object, room);
   }

   player = createObjectFromTemplate("player");
   player.x = Math.floor(Math.random() * 10);
   player.y = Math.floor(Math.random() * 10);
   setContainer(player, room);

   updateTileText(room);
}
