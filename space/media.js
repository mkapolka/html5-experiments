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

function genFileName() {
   var output = [fileParts1, fileParts2, fileParts3].map(function(a){ return a.pickRandom(); }).join("_");
   output += fileParts4.pickRandom();
   return output;
}

function Media(memes) {
   if (memes === null) memes = [];
   this.memes = memes;

   this.likes = 0;
   this.downloads = 0;
   this.name = genFileName();
   this.creator = undefined;
}

function genRandomMedia() {
   var file_memes = [];
   for (var i = 0; i < Math.random() * 3; i++) {
      file_memes.push(memes.pickRandom());
   }
   var media = new Media(file_memes);
   return media;
}
