function CGOL(width, height)
{
   this.width = width;
   this.height = height;

   this.data = new Array(width * height);
   this.oldData = new Array(width * height);

   this.get = function(x,y)
   {
      if (x < 0 || y < 0 || x > width || y > height) return false;
      return this.data[x * width + y];
   }

   this.getFrom = function(array, x, y)
   {
      if (x < 0 || y < 0 || y > height || x > width) return false;
      return array[x * width + y];
   }

   this.set = function(x, y, value)
   {
      if (x < 0 || y < 0 || x > width || y > height) return;
      this.data[x * width + y] = value;
   }

   this.setTo = function(array, x, y, value)
   {
      if (x < 0 || y < 0 || x > width || y > height) return;
      array[x * width + y] = value;
   }

   this.getAdjacentTiles = function(x,y)
   {
      var total = 0;

      if (this.get(x-1, y-1)) total += 1;
      if (this.get(x  , y-1)) total += 1;
      if (this.get(x+1, y-1)) total += 1;

      if (this.get(x-1, y  )) total += 1;
      //if (this.get(x  , y  )) total += 1;
      if (this.get(x+1, y  )) total += 1;

      if (this.get(x-1, y+1)) total += 1;
      if (this.get(x  , y+1)) total += 1;
      if (this.get(x+1, y+1)) total += 1;

      return total;
   }

   this.tick = function()
   {
      for (var x = 0; x < width; x++)
      {
         for (var y = 0; y < height; y++)
         {
            var n = this.getAdjacentTiles(x,y);

            switch (n)
            {
               case 0:
               case 1:
                  this.setTo(this.oldData, x,y,false);
               break;

               case 2:
                  this.setTo(this.oldData, x,y, this.get(x,y));
               break;

               case 3:
                  this.setTo(this.oldData, x,y,true);
               break;

               case 4:
               case 5:
               case 6:
               case 7:
               case 8:
               case 9:
                  this.setTo(this.oldData, x,y,false);
               break;
            }
         }
      }

      var b = this.data;
      this.data = this.oldData;
      this.oldData = b;
   }
}

function cgol_init(width, height)
{
   var grid = new Array();

   for (x = 0; x < width; x++)
   {
      var inner = new Array();
      inner.length = height;
      grid.push(inner);

      for (y = 0; y < height; y++)
      {
         grid[x][y] = {"oldvalue":false,"value":false};
      }
   }

   return grid;
}

/*function cgol_populate(cgol)
{
   for (var x = 0; x < cgol.length; x++)
   {
      for (var y = 0; y < cgol[x].length; y++)
      {
         cgol[x][y].value = Math.random()>.5;
      }
   }
}*/

//For use in the new CGOL object
function cgol_populate(cgol)
{
   for (var x = 0; x < cgol.width; x++)
   {
      for (var y = 0; y < cgol.height; y++)
      {
         cgol.set(x,y, Math.random()>.5);
      }
   }
}

function cgol_adjacent_tiles(x,y,cgol)
{
   var total = 0;

   function f(a,x,y){
      //Method 2
      if (x < 0 || y < 0 ||
          x >= a.length || y >= a[x].length)
      {
         return false;
      } else {
         return a[x][y].oldvalue;
      }

      //Method 1 - slower
      /*if (a[x] && a[x][y])
      {
         return a[x][y].oldvalue;
      } else {
         return false;
      }*/
   }

   if (f(cgol, x-1, y-1)) total += 1;
   if (f(cgol, x  , y-1)) total += 1;
   if (f(cgol, x+1, y-1)) total += 1;

   if (f(cgol, x-1, y  )) total += 1;
   //if (f(cgol, x  , y  )) total += 1;
   if (f(cgol, x+1, y  )) total += 1;

   if (f(cgol, x-1, y+1)) total += 1;
   if (f(cgol, x  , y+1)) total += 1;
   if (f(cgol, x+1, y+1)) total += 1;

   return total;
}

function cgol_tick(cgol)
{
   //Stores old values
   for (var x = 0; x < cgol.length; x++)
   {
      for (var y = 0; y < cgol[x].length; y++)
      {
         cgol[x][y].oldvalue = cgol[x][y].value;
      }
   }
   
    
   //Run the simulation
   for (var x = 0; x < cgol.length; x++)
   {
      for (var y = 0; y < cgol[x].length; y++)
      {
         var adj = cgol_adjacent_tiles(x,y,cgol);

         switch (adj)
         {
            case 0:
            case 1:
               cgol[x][y].value = false;
            break;

            case 2:
            break;

            case 3:
               cgol[x][y].value = true;
            break;

            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
               cgol[x][y].value = false;
            break;
         }
      }
   }
}

/*function cgol_render(context, cgol)
{
   var width = context.canvas.width;
   var height = context.canvas.height;
   var tile_width = width / cgol.length;
   var tile_height = height / cgol[0].length;

   context.clearRect(0, 0, width, height);
   context.fillStyle = "red";
   context.stroke = 0;

   for (var x = 0; x < cgol.length; x++)
   {
      for (var y = 0; y < cgol[x].length; y++)
      {
         if (cgol[x][y].value)
         {
            context.fillRect(x * tile_width, y * tile_height, tile_width, tile_height);         
         }
      }
   }
}*/

//For use with the CGOL object
function cgol_render(context, cgol)
{
   var width = context.canvas.width;
   var height = context.canvas.height;
   var tile_width = Math.floor(width / cgol.width);
   var tile_height = Math.floor(height / cgol.height);

   context.clearRect(0, 0, width, height);
   context.fillStyle = "red";
   context.stroke = 0;

   for (var x = 0; x < cgol.width; x++)
   {
      for (var y = 0; y < cgol.height; y++)
      {
         if (cgol.get(x,y))
         {
            context.fillRect(x * tile_width, y * tile_height, tile_width, tile_height);         
         }
      }
   }
}
