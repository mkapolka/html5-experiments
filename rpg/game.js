//Game methods

//Object that contains the data for the currently loaded room
//(Walls and Objects)
var player;

var current_action = undefined;
var selected_tile = undefined;

function setupGrid(room) {
   //Initialize html table
   var table = $("<table class='tiles noselect'></table>");
   for (var w = 0; w < room.width; w++)
   {
      var row = $("<tr></tr>");
      for (var h = 0; h < room.height; h++)
      {
         var td = $("<td></td>");
         var div = $("<div></div>");
         div.addClass("x" + w + " y" + h);
         div.addClass("tile");
         td[0].x = w;
         td[0].y = h;
         td.append(div);
         row.append(td);
      }
      table.append(row);
   }

   $("#tiles_container").append(table);

   $(".tiles td").hover(function() {
      if (selected_tile === undefined)
      {
         setHoverTextTile(getCurrentRoom(), this.x, this.y);
      }
   });

   $(".tiles td").click(function() {
      $(selected_tile).removeClass("selected");
      if (selected_tile !== $(this)[0])
      {
         selected_tile = $(this)[0];
         $(this).addClass("selected");
         selectTile($(this)[0], getCurrentRoom());
      } else {
         if (selected_tile !== undefined)
         {
            deselectTile(selected_tile);
            setHoverTextTile(room, this.x, this.y);
         }
      }
   });
}

var hoveredTileX = 0;
var hoveredTileY = 0;

function setHoverTextTile(room, tileX, tileY)
{
   hoveredTileX = tileX;
   hoveredTileY = tileY;

   var objects = getVisibleObjectsAt(tileX, tileY, getPlayer());

   var text = $("<ul>You see here...</ul>");
   
   for (var i in objects)
   {
      if (objects[i].name !== undefined)
      {
         if (objects[i].parent.isRoom) {
            text.append($("<li>" + objects[i].name + "</li>"));
         } else {
            text.append($("<li>" + objects[i].name + "(inside " + objects[i].parent.name + ")" + "</li>"));
         }
      }
   }

   setHoverText(text);

   //Act like selectTile
   showActionButtons(room, tileX, tileY);
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
   var mnemonics = [];
   var objects_here = getObjectsAt(room, x, y);

   var player = getPlayer();
   

   actions.push("Wait");
   mnemonics.push("Z");

   //Numbered mnemonics
   var mnem = 1;

   //Actions
   if (is(player.animated) && is(player.conscious) && is(player.living)) {
      if (is(player.mobile)) {
         actions.push("Walk Here");
         mnemonics.push("W");
      }

      if (objects_here.length > 0)
      {
         actions.push("Get");
         mnemonics.push("G");
         actions.push("Examine");
         mnemonics.push("E");

         for (var o in objects_here) {
            var standingActions = getStandingActions(objects_here[o]);
            for (var a in standingActions) {
               if (actions.indexOf(a) === -1){
                  actions.push(a);
                  mnemonics.push(mnem++);
               }
            }
         }
      }

      if (player.holding !== undefined)
      {
         actions.push("Drop");
         mnemonics.push("D");

         //Held object actions
         var heldActions = getHeldActions(player.holding);

         for (var a in heldActions) {
            actions.push(a);
            mnemonics.push(mnem++);
         }
      }
   }

   var objects = [];
   for (var i in actions)
   {
      objects.push({"type":actions[i], "x" : x, "y" : y, "mnemonic":mnemonics[i]});
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
         //deselectTile(selected_tile);
      break;

      case "Examine":
         showObjectButtons(getCurrentRoom(), action.x, action.y, function(object) {
            if (!isAdjacent(player.x, player.y, object.x, object.y)){
               moveAdjacentTo(player, object);
            } 
            pushGameText("You examine " + object.name);
            pushGameText(revealToHTML(reveal(object, ["look", "feel"])));
            //deselectTile(selected_tile);

            doTick();
            updateTileText();
         });
         return;
      break;

      case "Wait":
         pushGameText("You wait a bit.");
      break;

      case "Get":
         showObjectButtons(getCurrentRoom(), action.x, action.y, function(object) {
            if (!isAdjacent(player.x, player.y, object.x, object.y)){
               moveAdjacentTo(player, object);
            } 
            pickup(object);
            updateTileText();
            //deselectTile(selected_tile);
            doTick();
            updateTileText();
         });
         return;
      break;

      case "Drop":
         showLocationButtons(getCurrentRoom(), action.x, action.y, function(object) {
            if (!isAdjacent(player.x, player.y, object.x, object.y)){
               moveAdjacentTo(player, object);
            } 
            if (object.isFloor) {
               putDownAt(object.x, object.y);
            } else {
               putDownIn(object);
            }
            doTick();
            updateTileText();
            //deselectTile(selected_tile);
         });
         return;
      break;

      default:
         //Was it an action from an object the player is holding?
         if (player.holding !== undefined) {
            var heldActions = getHeldActions(player.holding);

            if (heldActions[action.type] !== undefined) {
               showObjectButtons(getCurrentRoom(), action.x, action.y, function(object) {
                  heldActions[action.type](player.holding, player, object);
                  doTick();
                  updateTileText();
                  //deselectTile(selected_tile);
               });
               return;
            }
         }

         //Standing action
         var object = undefined;
         var objectsHere = getObjectsAt(getCurrentRoom(), action.x, action.y, false);
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
               doTick();
               updateTileText();
               //deselectTile();
            });
         } else {
            if (objects.length == 0) return;
            var standingActions = getStandingActions(objects[0]);
            standingActions[action.type](objects[0], player);
            doTick();
            updateTileText();
         }

         return;
      break;
   }

   doTick();
   updateTileText();
}

function showObjectButtons(room, x, y, callback)
{
   var names = [];
   var objects = [];
   var objects_here = getVisibleObjectsAt(x, y, getPlayer());
   var mnem = 1;

   for (var o in objects_here)
   {
      var obj = objects_here[o];
      obj.mnemonic = "" + mnem++;
      objects.push(obj);
      if (objects_here[o].parent !== getRoom(objects_here[o])) {
         names.push(obj.name + "(inside " + objects_here[o].parent.name + ")");  
      } else {
         names.push(obj.name);
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
   var mnem = 1;

   names.push("On the ground");
   objects.push({"isFloor":true, "x":x,"y":y, "mnemonic":mnem++});


   for (var o in obAt)
   {
      if (obAt[o].contents !== undefined && (is(obAt[o].open) || is(obAt[o].openable)))
      {
         names.push("Inside " + obAt[o].name);
         objects.push(obAt[o]);
         obAt[o].mnemonic = mnem++;
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

   if (object.holdable !== undefined && not(object.holdable)) {
   //if (is(object.isLiquid) || is(object.isGas) || is(object.rooted)) {
      pushGameText("You cannot pick that up!");
      return;
   }

   if (player.holding !== undefined) {
      pushGameText("You swap " + player.holding.name + " for " + object.name);
      moveObject(player.holding, object.x, object.y);
      setContainer(player.holding, object.parent);
      player.holding.obscured = 0;
      player.holding = undefined;
   } else {
      pushGameText("You pick up " + object.name);
   }
   setContainer(object, player.parent);
   moveObject(object, player.x, player.y);
   player.holding = object;
   object.obscured = 1;
   updateTileText();
}

function putDownAt(x,y){
   if (player.holding !== undefined)
   {
      pushGameText("You put " + player.holding.name + " there.");
      moveObject(player.holding, x, y, true);
      setContainer(player.holding, player.parent);
      player.holding.obscured = 0;
      player.holding = undefined;
      updateTileText();
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
      updateTileText();
   }
}

function setHoverText(input)
{
   $("#hovertext").html(input);
}

function updateTileText(room)
{
   if (room === undefined) {
      room = getCurrentRoom();
   }
   //game objects
   var tiles = $(".tile");
   tiles.text(".");
   tiles.css("color", "black");

   for (var i in room.contents)
   {
      var object = room.contents[i];

      if (not(object.obscured)) {
         var tile = $(".x" + object.x + ".y" + object.y);
         var bft = tile.text();
         if (tile.text().charAt(0) !== "@") {
            tile.text(getGlyph(object));
            tile.css("color", object.color);
         }

         if (bft !== ".") {
            tile.append("+");
         }
      }
   }
}

function pushGameText(string)
{
   $(".gametext:first").append("<li>" + string + "</li>");
}

function pushHTML(htmlString)
{
   $(".gametext").append(htmlString);
}

function makeOptions(strings, options, callback)
{
   $("body").unbind('keydown');
   var container = $("");

   for (var o in options)
   {
      var button = $("<div class='button noselect'>" + strings[o] + "<div class='mnem'>" + options[o].mnemonic + "</div></div>");
      button[0].value = options[o];
      button.click(function() {
         callback(this.value);
      });
      $("body").bind('keydown', "" + options[o].mnemonic, function(obj, callback) {
         return function() {
            callback(obj);
         };
      }(options[o], callback));
      container = container.add(button);
   }

   return container;
}

function game_init()
{
   //Initialize all the rooms
   rooms = [];
   for (var i in maps) {
      rooms[i] = (makeRoom(maps[i]));
   }

   setupGrid(getCurrentRoom());

   updateTileText(getCurrentRoom());
}

function getPlayer() {
   return player; 
}

function getCurrentRoom() {
   return getRoom(getPlayer());
}
