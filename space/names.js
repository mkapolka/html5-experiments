Array.prototype.pickRandom = function(){
   return this[Math.floor(Math.random() * this.length)];
}

Array.prototype.forEachRandom = function(callback) {
	var copy = this.filter(function(a){ return true; });
	while (copy.length > 0){
		var i = Math.floor(Math.random() * copy.length);
		callback(copy.splice(i,1)[0]);
	}
}

function forEachRandom(object, callback) {
	var keys = [];
	for (var v in object) {
		if (object.hasOwnValue(v)) {
			keys.push(v);
		}
	}

	while (keys.length > 0){
		var i = Math.floor(Math.random() * keys.length);
		var k = keys.splice(i, 1)[0];
		callback(k, keys[k]);
	}
}

topics = [
   "cats", "dogs", "games", "scub"
]

userNameParts = [
   "xxx","goku","vegeta","miku",
   "mike","tom","420","69",
   "snypa","boy","aaa","snow",
   "scout","imjust","albrecht","marth",
   "darth","empty","eye","rename",
   "name","salt","fish","peache",
   "_","mr","boner","bones",
   "koo","butt","cross","franker",
   "sonic","fan","vanilla","cola",
   "adam","pie","iate","killer","zombie",
   "penguin", "ninja", "pirate", "monkey",
   "cheese",
];

function genUserName() {
   var parts = Math.floor(Math.random() * 3) + 2;

   //How to handle capitalization
   var mod = Math.floor(Math.random() * 4);
   var output = "";
   for (var i = 0; i < parts; i++) {
      var part = userNameParts[Math.floor(Math.random() * userNameParts.length)];
      switch (mod) {
         case 0:
            part = part[0].toUpperCase() + part.substring(1);
         break;

         case 1:
            var b = true;
            var p2 = "";
            for (var c in part) {
               if (b = !b) {
                  p2 += part[c].toUpperCase();
               } else {
                  p2 += part[c];
               }
            }

            part = p2;
         break;

         case 2:
            part = part.toUpperCase();
         break;

         case 3:
         break;
      }
      output += part;
   }

   return output;
}

fileParts1 = [
   "glorious", "wonderful", "hot", "slimy", "infinite", "fractal", "cute", "funny",
   "hilarious", "weird", "strange", "wtf", "why", "adorable", "lol", "zomg", "omg",
   "neat", "interesting", "bizzare", "aww", "falling", "damn", "every", "any", "some",
   "awkward", "top_5", "top_10", "top_7", "best", "incredible", "unbelievable", "inescapable",
]

fileParts2 = [
   "horse", "donkey", "pornstar",
   "american", "japanese", "european", "canadian", "mexican", "spanish", "german", "french",
   "polish", "english", "scottish", "finnish", "belgian", "african", "egyptian", "israeli", "palestinian",
   "italian", "russian", "bulgarian", "afghani", 
   "dog", "cat", "marmot", "alligator", "weasel", "mule", "bunny", "boner",
   "idol", "singer", "performer", "cop", "anarchist", "redditor", "goon", "feminist", "mensrights", "atheist",
   "preacher", "priest", "pedo", "gamer", "business", "facebook", "reddit", "google", "apple",
   "republican", "democrat", "liberal", "conservative"
]

fileParts3 = [
   "dicks", "fails", "wins", "deaths", "sex_positions", "beliefs", "goofs", "beefs_it", "singing", "dancing",
   "eating", "foods", "customs", "dances", "facts", "games", "lunches", "rage", "noooo"
]

fileParts4 = [
   ".jpeg", ".jpg", ".gif", ".png", ".mov", ".mp3", ".mp4", ".avi", ".exe", ".iso",
   ".flv", ".txt", ".mp5"
]

function getRand(array) {
   return array[Math.floor(Math.random() * array.length)];
}

function genFileName() {
   var output = [fileParts1, fileParts2, fileParts3].map(function(a){ return getRand(a);}).join("_");
   output += getRand(fileParts4);
   return output;
}
