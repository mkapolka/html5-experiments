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

Person.guid_counter = 0;
function Person() {
   this.opinions = {};
   this.name = genUserName();
   //The media that this person has downloaded.
   this.media = [];
   this.location = undefined;
   this.guid = Person.guid_counter++;

   this.numFiles = function(){
       return this.media.length;
   }

   this.consume = function(media) {
      var disliked = [];
      var liked = [];
      var neutrals = [];
      //Opinion of the media as a whole
      var opinion = 0;
      var person = this;
      for (var m in media.memes) {
         var meme = media.memes[m];
         var op = person.opinions[meme];
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
      };

      if (opinion > 0) {
         var pool = Math.random() > .5?disliked:neutrals;
         var meme = pool.pickRandom();
         this.opinions[meme] += 1;
      } else if (opinion < 0) {
         var pool = Math.random() > .5?liked:neutrals;
         var meme = pool.pickRandom();
         this.opinions[meme] -= 1;
      }
   }

   this.evalMeme = function(meme) {
      var op = this.opinions[meme];
      if (op === undefined) return 0;
      return op;
   }

   this.evalMedia = function(media) {
      var opinion = 0;
      for (var m in media.memes) {
         opinion += this.evalMeme(media.memes[m]);
      }
      return opinion;
   }

   this.evalForum = function(forum) {
      var opinion = 0;
      for (var post in forum.posts) {
         for (var meme in post) {
            opinion += this.evalMeme(meme);
         }
      }
      return opinion;
   }

   this.tick = function() {
      var forum = this.location;
      if (forum === undefined) return;
      //Save the best image
      var highest_opinion = -1;
      var highest_media = undefined;
      var person = this;
      for (var i = 0; i < forum.posts.length; i++) {
         var post = forum.posts[i];
         person.consume(post);

         var op = person.evalMedia(post.media);
         if (op > 0) {
            console.log(this.name, " liked ", post, " opinion: " + op);
            post.media.likes += 1;

            if (op > highest_opinion && this.media.indexOf(post) === -1) {
               highest_opinion = op;
               highest_media = post.media;
            }
         }
      }

      if (highest_media !== undefined) {
         //Save the best image
         this.download(highest_media);
      }

      ///Post something that I Like
      var media = this.media.pickRandom();
      if (forum.posts.indexOf(media) === -1 && media !== undefined) {
         forum.post(this, media);
      }
   }

   this.download = function(media) {
      if (media === undefined) return;
      if (this.media.indexOf(media) === -1) {
         media.downloads += 1;
         this.media.push(media);
      }
   }

   this.getLikedMemes = function() {
      var liked_memes = [];
      for (var o in this.opinions) {
         if (this.opinions[o] > 0) liked_memes.push(o);
      }
      return liked_memes;
   }
   this.likes = this.getLikedMemes;

   this.getDislikedMemes = function() {
      var disliked_memes = [];
      for (var o in this.opinions) {
         if (this.opinions[o] < 0) disliked_memes.push(o);
      }
      return disliked_memes;
   }
   this.dislikes = this.getDislikedMemes;

   this.getNeutralMemes = function() {
      var neutral_memes = [];
      for (var o in this.opinions) {
         if (this.opinions[o] === 0) neutral_memes.push(o);
      }
      return neutral_memes;
   }

   this.travelTo = function(place) {
      this.location.lurkers.remove(this);
      this.location = place;
      place.lurkers.push(this);
   }
}

function generateRandomPerson() {
   var person = new Person();
   var n_opinions = Math.ceil(Math.random() * 10);
   for (var i = 0; i < n_opinions; i++) {
      var meme = memes.pickRandom();
      person.opinions[meme] = Math.random()>.5?1:-1;
   }
   return person;
}
