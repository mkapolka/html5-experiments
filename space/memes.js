function select_random(array) {
   return array[Math.floor(Math.random() * array.length)];
}
var memes = [
   //Tags taken from tumblr/explore
   "lol", "fashion", "DIY", "food", "art", "landscape", "film", "illustration", "vintage",
   "animals", "makeup", "gaming", "tattoos", "design", "poetry", "comics", "typography", "architecture",
   "interiors", "television", "literature", "science", "crafts", "celebrities", "cars", "music", "news",
   "prose", "history", "advertising", "LGBTQ", "sports", "politics", "technology"
];

function Media(memes) {
   if (memes === null) memes = [];
   this.memes = memes;
}

function Person() {
   this.opinions = {};
   this.name = genUserName();

   this.consume = function(media) {
      var disliked, liked, neutrals = [];
      //Opinion of the media as a whole
      var opinion = 0;
      media.memes.each(function(meme) {
         var op = this.opinions[meme];
         if (op === null) return;
         if (op > 0) {
            opinion += 1;
            liked.push(meme);
         } else if (op < 0) {
            opinion -= 1;
            disliked.push(meme);
         } else {
            neutrals.push(meme);
         }
      });

      if (opinion > 0) {
         var pool = Math.random() > .5?disliked:neutrals;
         var meme = select_random(pool);
         this.opinions[meme] += 1;
      } else if (opinion < 0) {
         var pool = Math.random() > .5?liked:neutrals;
         var meme = select_random(pool);
         this.opinions[meme] -= 1;
      }
   };
}

function generateRandomPerson() {
   var person = new Person();
   var n_opinions = Math.ceil(Math.random() * 10);
   for (var i = 0; i < n_opinions; i++) {
      var meme = select_random(memes);
      person.opinions[meme] = Math.round(Math.random() * 2 - 1);
   }

   return person;
}
