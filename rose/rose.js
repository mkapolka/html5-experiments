//Rose project specific code

function makeSheetRenderable(width, height, glContext)
{
   var vertices = [];
   var elements = [];
   var colors = [];

   //Get index from x,y value
   var p2i = function(x,y){
      return x * height + y;
   }

   //Vertices
   for (var x = 0; x < width; x++)
   {
      for (var y = 0; y < height; y++)
      {
         var vx = -.5 + (x * 1 / (width - 1));
         var vy = -.5 + (y * 1 / (height - 1));
         vertices.push([vx, vy, 0]);
      }
   }

   //Colors
   for (var i = 0; i < vertices.length; i++)
   {
      //colors.push([1.0, 1.0, 1.0, 1.0]);
      colors.push([Math.random(), Math.random(), Math.random(), Math.random()]);
   }

   //Elements (Triangle strips)
   for (var x = 0; x < width-1; x+=2)
   {
      for (var y = 0; y < height; y++)
      {
         elements.push(p2i(x,y));
         elements.push(p2i(x+1,y));
      }

      if (x+2 < width)
      {
         elements.push(p2i(x+1,height-1));
         for (var y = height - 1; y >= 0; y--)
         {
            elements.push(p2i(x+1,y));
            elements.push(p2i(x+2,y));
         }
      }
   }

   var renderable = new Renderable(glContext);
   renderable.setVertices(vertices, true);
   renderable.setElements(elements);
   renderable.setColors(colors, true);

   return renderable;
}

function xCurveBend1(vertices)
{
   var translate = mat4.create();
   mat4.identity(translate);
   mat4.translate(translate, translate, [0, 0, -1]);
   var invtrans = mat4.create();
   mat4.invert(invtrans, translate);
   var rotate = mat4.create();
   mat4.identity(rotate);

   for (var i in vertices)
   {
      mat4.identity(rotate,rotate);
      mat4.rotateY(rotate, rotate, vertices[i][0] * Math.PI);
      vec3.transformMat4(vertices[i], vertices[i], translate);
      vec3.transformMat4(vertices[i], vertices[i], rotate);
      vec3.transformMat4(vertices[i], vertices[i], invtrans);
   }
}

function xCurveBend2(vertices)
{
   var trans = mat4.create();

   for (var i in vertices)
   {
      mat4.identity(trans);
      var t = Math.acos(vertices[i][0] * 2);
      mat4.translate(trans, trans, [0,0,Math.sin(t) * .5]);
      vec3.transformMat4(vertices[i], vertices[i], trans);
   }
}

//This method works as if you are bending the model around the horn of an anvil.
//Radius is the radius of the horn.
function xCurveBend3(vertices, radius)
{
   for (var i in vertices)
   {
      var t;
      var x_translate;
      var arcLength = Math.abs(vertices[i][0] / radius);
      if (arcLength > .5 * Math.PI){
         if (vertices[i][0] > 0)
         {
            t = Math.PI / 2;
            x_translate = .5 * Math.PI * radius;
         } else {
            t = Math.PI / -2;
            x_translate = -.5 * Math.PI * radius;
         }
      } else {
         t = vertices[i][0] / radius;
         x_translate = vertices[i][0];
      }
      var mat = mat4.create();

      mat4.rotateY(mat, mat, t);
      mat4.translate(mat, mat, [-x_translate, 0, 0]);
      mat4.translate(mat, mat, [0, 0, radius]);

      vec3.transformMat4(vertices[i], vertices[i], mat);
   }
}
