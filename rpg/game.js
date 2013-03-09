//Game methods

var room_contents = [
   lavender, tea_kettle, fire_pit, burning_thing, water
];

var game_objects = [];

var holding = undefined;

var current_action = undefined;

var currently_held = undefined;

function addGameObject(object)
{
   game_objects.push(object);
   object.parent = game_objects;
}

function pushGameText(string)
{
   $(".gametext").append("<p>" + string + "</p>");
}

function pushHTML(htmlString)
{
   $(".gametext").append(htmlString);
}

function click_action(action){

   current_action = action;

   switch (action)
   {
      case "look":
         $("#objects #object_description").text("Look at what?");
      break;

      case "feel":
         $("#objects #object_description").text("Feel what?");
      break;

      case "grab":
         $("#objects #object_description").text("Grab what?");
      break;

      case "put":
         $("#objects #object_description").text("Put " + currently_held.name + " where?");
      break;

      case "wait":
         pushGameText("You wait...");
         doTick();
         return;
      break;
   }

   $("#actions").hide();

   for (var i in room_contents)
   {
      //$("#objects #object_buttons").append("<div class='button' onclick='click_object(" + i + ")>" + room_contents[i].name + "</div>");
   }

   $("#objects").show();
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

   doTick();
}

function describeRoom()
{
   var text = "You are standing in a vast herb garden under the calm spring sun. Around you are:<br>";

   for (var i = 0; i < game_objects.length; i++)
   {
      if (i == game_objects.length -1) {
         text += "and ";
      }
      var n = game_objects[i].name;
      if (typeof n == "undefined") continue;
      if (['a','e','i','o','u'].indexOf(n.charAt(0)) !== -1) {
         text += "an ";
      } else {
         text += "a ";
      }
      text += n;

      if (i < game_objects.length -1)
      {
         text += ",<br>";
      } else {
         text += "<br>";
      }
   }

   pushGameText(text);
}

function getContentElement()
{
   return $(".content")[0];
}

function game_init()
{
   for (var i in room_contents)
   {
      addGameObject(room_contents[i]);
   }

   describeRoom();
}
