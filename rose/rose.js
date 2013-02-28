//Rose project specific code

function makeSheetRenderable(width, height)
{
   var vertices = [];
   var elements = [];
   var colors = [];

   //Get index from x,y value
   var p2i = function(x,y){
      return x * height + y;
   }

   //Vertice
   for (var x = 0; x < width; x++)
   {
      for (var y = 0; y < height; y++)
      {
         var vx = x * 1 / width;
         var vy = y * 1 / height;
         vertices.push([vx, vy, 0]);
      }
   }

   //Colors
   for (var i = 0; i < vertices.length; i++)
   {
      colors.push([1.0, 1.0, 1.0, 1.0]);
   }

   //Elements (Triangle strips)
   for (var x = 0; x < width; x+=2)
   {
      for (var y = 0; y < height ;y++)
      {
         elements.push(p2i(x,y));
         elements.push(p2i(x+1,y));
      }

      if (x+1 < width)
      {
         elements.push(p2i(x+1,height-1));
         for (var y = height - 1; y > 0; y++)
         {
            elements.push(p2i(x,y));
            elements.push(p2i(x+1,y));
         }
      }
   }
}
