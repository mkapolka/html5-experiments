function myFileClick() {
   var file = $(this).data("file");
   if (forum.indexOf(file) !== -1) {
      //Repost- don't send it
   } else {
      forum.unshift(file);
      updateForumInfo();
   }
}

function myFileOver() {
   var file = $(this).data("file");
   $(".dragIcon").show();

   if (forum.indexOf(file) !== -1) {
      $('.dragIcon').html('<strike>Winners dont repost</strike>');
      $(this).addClass("repost");
   } else {
      $(".dragIcon").text("Post");
      $(this).addClass("postOK");
   }
}

function myFileOut() {
   $(this).removeClass("repost");
   $(this).removeClass("postOK");
}

function updatePlayerInfo() {
   //Value
   var v = $("<p></p>").text("Total Value: " + player.getValue() + " Likes: " + player.likes);
   var l = $("<p></p>").text("Likes: " + player.likes);

   $("#mystats #mydetails").html(v, l);

   var filelist = makeFileList(player.treasures, "My Files (" + player.treasures.length + "/" + player.capacity + ")", myFileClick, myFileOver, myFileOut);
   var delButton= $("<div class='deleteButton'>X</div>");
   delButton.click(function(a) {
       player.delete($(this).parent().data("file"));
       updatePlayerInfo();
   });
   delButton.mouseover(function(a) {
      $(".dragIcon").text("Delete"); 
      return false;
   });
   $(filelist).find("li").prepend(delButton);
   $("#myfiles").html(filelist);
}

function forumClick(e) {
   var file = $(this).data("file");

   if (player.treasures.indexOf(file) === -1) {
      player.download(file);
      updatePlayerInfo();
      updateForumInfo();
      forumOver.call(this);
   }
}

function forumOver(e) {
   var file = $(this).data("file");

   $(this).removeClass("postOK");
   $(this).removeClass("repost");
   $(".dragIcon").show();

   if (player.treasures.indexOf(file) === -1) {
      $('.dragIcon').text('Save');
      $(this).addClass("postOK");
   } else {
      $('.dragIcon').html('Already Saved');
      $(this).addClass("repost");
   }
}

function forumOut(e) {
   $(".dragIcon").hide();
}

function updateForumInfo(forum) {
   
}

function f5Click() {
   doRound();
   console.log(people);
   refresh();
}
