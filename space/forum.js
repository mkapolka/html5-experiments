function Forum() {
   this.topics = [];
   this.posts = [];
   this.lurkers = [];

   this.post = function(poster, media) {
      if (this.posts.filter(function(post) {
         return post.media === media; 
      }).length > 0) {
         console.log("Repost detected! Poster:", poster, " media: ", media);   
         return;
      }
      this.posts.push(new Post(poster, media));
   }

   this.wasPosted = function(media) {
      return this.posts.filter(function(a){a.media == media}).length > 0;
   }

   this.lurk = function() {
      //What did the player see here this time?

   }
}

function genRandomForum() {
   var forum = new Forum();
   for (var i = 0; i < Math.random() * 5; i++) {
      forum.topics.push(memes.pickRandom());
   }
   return forum;
}

function Post(poster, media) {
   this.poster = poster;
   this.media = media;

   this.name = function(){ return this.media.name; }
}

var fora = [
   {
      name: "Cat Lovers 420",
      url: "catluvrz.com",
      topics: ["cats","aww", "funny", "image"],
      background: "cats.jpg",
      type: "media_forum"
   }
]
