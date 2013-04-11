function GameFile() {
   this.name = genFileName();
   this.rarity = 10;
   this.value = Math.floor(Math.random() * 10);

   this.topic = topic_names.pickRandom();
   this.opinion = Math.floor(Math.random() * 10 - 5);
   this.tags = [];

   this.karma = 0;
   this.downloads = 0;

   this.upvote = function() {
      this.karma++;
   }

   this.downvote = function() {
      this.karma--;
   }
}

TraderTypes = {
   Naive: 0,
   Collector: 1,
   Savvy: 2,
}

function Demographics() {
   //Topics: topic (string) => connections (object)
   //Connections: topic (string) => strength (float)
   this.topics = {};
   this.addTopic = function(name, cxns) {
      this.topics[name] = {
         name: name,
         cxns: cxns,
      };
   }

   //Populate
   var me = this;
   topic_names.forEach(function(a) {
      me.addTopic(a, {});
   });
   //Add cxns
   topic_cxns.forEach(function(a) {
      cxn = a.split(" ");
      me.topics[cxn[0]].cxns[cxn[1]] = parseFloat(cxn[2]);
   });

   this.setCxn = function(name, other, strength) {
      topics[name].cxns[other] = strength;
      topics[other].cxns[name] = strength;
   }

   this.createOpinionList = function(topic, opinion) {
      var list = {};
      var visited = [];
      var queue = [];
      function visit(topic, value) {
         if (visisted.indexOf(topic) !== -1) return;
         if (list[topic] === undefined) list[topic] = 0;
         list[topic] += value;
         visited.push(topic);
         for (var t2 in this.topics[topic].cxns) {
            queue.push(function() {
               visit(t2, value * this.topics[topic].cxns[t2]);
            });
         }
      }

      queue.push(function() {
         visit(topic, 1);
      });

      while (queue.length > 0) queue.pop()();
   }
}

function Person() {
   this.name = genUserName();
   this.treasures = [];
   this.capacity = 5;
   this.type = [0,1,2].pickRandom();
   this.likes = 0;
   this.opinions = {};

   this.visitForum = function(posts) {
      this.sortTreasures();

      var caller = this;
      posts.forEach(function(post) {
         caller.consume(post);
         var value = caller.evalFile(post);

         var opinion = post.opinion;
         var myop = caller.opinions.get(post.topic);

         if ((opinion > 0 && myop > 0) || (opinion < 0 && myop < 0)) {
            //console.log(caller.name + " upvoted " + post.name);
            post.upvote();
         } else {
            post.downvote();
            //console.log(caller.name + " downvoted " + post.name);
         }

         if (value > caller.evalFile(caller.treasures[0])) {
            caller.download(post);
            //console.log(caller.name + " downloaded " + post.name);
         }
      });

      posts.push(this.treasures.pickRandom());
   }

   this.consume = function(media) {
      this.opinions.influence(media.topic, media.opinion);
   }

   this.evalFile = function(file) {
      var v;
      switch(this.type) {
         default:
         case TraderTypes.Naive:
            v = file.value;
         break;

         case TraderTypes.Collector:
            v = file.rarity;
         break;

         case TraderTypes.Savvy:
            v = file.rarity * file.value;
         break;
      }
      return v;
   }

   this.sortTreasures = function() {
      var player = this;
      this.treasures.sort(function(a, b) {
         var av = player.evalFile(a); 
         var bv = player.evalFile(b); 

         if (av > bv) {
            return 1;
         } else if (av < bv) {
            return -1;
         } else {
            return 0;
         }
      });
   }

   this.getValue = function() {
      return this.treasures.reduce(function(pv, cv){ return pv + cv.value }, 0);
   }

   this.download = function(file) {
      if (this.treasures.indexOf(file) !== -1) return;
      file.downloads++;

      this.treasures.push(file);
      file.rarity -= 1;

      this.sortTreasures();

      if (this.treasures.length > this.capacity) {
         console.log(this.name + " deleted " + this.treasures[0].name);
         this.treasures.shift().rarity += 1;
      }
   }

   this.post = function(file, forum) {
      
   }

   this.delete = function(file) {
      if (this.treasures.indexOf(file) === -1) return;
      
      this.treasures.splice(this.treasures.indexOf(file),1);
      file.rarity += 1;
   }
}

function initNoosphere() {
   var noosphere = [];

   for (var i = 0; i < 20; i++) {
      noosphere.push(new GameFile());
   }

   return noosphere;
}

function initPeople(noosphere, num_people) {
   var array = [];
   for (var i = 0; i < num_people; i++) {
      var person = new Person();
      populateTreasures(person, noosphere);
      array.push(person);
   }

   return array;
}

function populateTreasures(person, treasures) {
   for (var i = 0; i < person.capacity; i++) {
      person.download(getRand(treasures));
   }
}

function initForum(treasures) {
   var forum = [];

   for (var i = 0; i < 10; i++) {
      forum.push(getRand(treasures));
   }

   return forum;
}

function doRound(players, forums) {
   for (var f in forums) {
      if (!forums.hasOwnProperty(f)) continue;
      forums[f].splice(0, forums[f].length-1);
   }

   for (var p in players) {
      if (!players.hasOwnProperty(p)) continue;
      for (var f in forums) {
         if (!forums.hasOwnProperty(f)) continue;
         players[p].visitForum(forums[f]);
      }
   }

   updateForumInfo();
   updatePlayerInfo();

   console.log(function() {
      var values = players.reduce(function(pv, cv, i, a) {
         //Sum opinions topicwise
         for (var o in cv.opinions.topics) {
            if (!cv.opinions.topics.hasOwnProperty(o)) continue;
            if (pv[o] === undefined) pv[o] = 0;
            pv[o] += cv.opinions.get(o);
         }

         return pv;
      }, {});
      return values;
      var string = "";
      for (var v in values) {
         string += v + " : " + values[v] + "\n";
      }
      return string;
   }());
}
