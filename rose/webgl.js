var renderables = [];
var gl;

function initGL(canvas) {
   try {
      //gl = canvas.getContext("experimental-webgl");
      gl = WebGLUtils.setupWebGL(canvas);
      gl.viewportWidth = canvas.width;
      gl.viewportHeight = canvas.height;
   } catch (e) {
   }
   if (!gl) {
      //alert("Could not initialise WebGL, sorry :-(");
   }
}


function getShader(gl, id) {
   var shaderScript = document.getElementById(id);
   if (!shaderScript) {
      return null;
   }

   var str = "";
   var k = shaderScript.firstChild;
   while (k) {
      if (k.nodeType == 3) {
         str += k.textContent;
      }
      k = k.nextSibling;
   }

   var shader;
   if (shaderScript.type == "x-shader/x-fragment") {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
   } else if (shaderScript.type == "x-shader/x-vertex") {
      shader = gl.createShader(gl.VERTEX_SHADER);
   } else {
      return null;
   }

   gl.shaderSource(shader, str);
   gl.compileShader(shader);

   if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(shader));
      return null;
   }

   return shader;
}

var shaderProgram;

function initShaders() {
   var fragmentShader = getShader(gl, "shader-fs");
   var vertexShader = getShader(gl, "shader-vs");

   shaderProgram = gl.createProgram();
   gl.attachShader(shaderProgram, vertexShader);
   gl.attachShader(shaderProgram, fragmentShader);
   gl.linkProgram(shaderProgram);

   if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
   }

   gl.useProgram(shaderProgram);

   shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
   gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

   shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
   gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

   shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
   shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();

function mvPushMatrix() {
   var copy = mat4.clone(mvMatrix);
   mvMatrixStack.push(copy);
}

function mvPopMatrix() {
   if (mvMatrixStack.length == 0) {
      throw "Invalid popMatrix!";
   }
   mvMatrix = mvMatrixStack.pop();
}

function setMatrixUniforms() {
   gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
   gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

function degToRad(degrees) {
   return degrees * Math.PI / 180;
}

function initBuffers() {
   //var params = makeTestParams();
   //segment = generateSegment(null, params);

   //var rr = makeSegmentRenderable(segment, gl);
   //renderables.push(rr);
   renderables.push(makeSheetRenderable(10,10,gl));
}

var rotation = 0;

function drawScene() {
   gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

   mat4.perspective(pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);

   mat4.identity(mvMatrix);
   mat4.translate(mvMatrix, mvMatrix, [0, -10, -35.0]);
   mat4.rotate(mvMatrix, mvMatrix, Math. PI * (new Date()).getTime() / 5000, [0, 1, 0]);

   for (var renderable in renderables)
   {
      drawRenderable(renderables[renderable], mvMatrix);
   }
}

function drawRenderable(renderable, viewMatrix)
{
   mvPushMatrix();

   mat4.multiply(viewMatrix, viewMatrix, renderable.mvMatrix);

   gl.bindBuffer(gl.ARRAY_BUFFER, renderable.vertexBufferPointer);
   gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, renderable.vertexBufferPointer.itemSize, gl.FLOAT, false, 0, 0);

   gl.bindBuffer(gl.ARRAY_BUFFER, renderable.colorBufferPointer);
   gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, renderable.colorBufferPointer.itemSize, gl.FLOAT, false, 0, 0);

   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, renderable.elementBufferPointer);
   setMatrixUniforms();
   gl.drawElements(gl.TRIANGLE_STRIP, renderable.elementBufferPointer.numItems, gl.UNSIGNED_SHORT, 0);

   mvPopMatrix();
}

//Unpacks an array of vectors into an array of values.
//This is useful because the addSegmentToRenderable method
//expects the values in its vertexArray to be glMatrix vec3s, but
//WebGL buffers should be filled with primative values
function unpackArray(input)
{
   var output = [];

   for (var child in input)
   {
      for (var i = 0; i < input[child].length; i++)
      {
         output.push(input[child][i]);
      }
   }

   return output;
}

function Renderable(glContext)
{
   this.glContext = glContext;

   this.vertexBufferPointer = gl.createBuffer();
   this.colorBufferPointer = gl.createBuffer();
   this.elementBufferPointer = gl.createBuffer();

   this.mvMatrix = mat4.create();
   mat4.identity(this.mvMatrix);

   this.setVertices = function(array, explode)
   {
      if (explode)
      {
         array = unpackArray(array);
      }
      glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vertexBufferPointer);
      glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(array), glContext.STATIC_DRAW);
      this.vertexBufferPointer.itemSize = 3;
      this.vertexBufferPointer.numItems = array.length / 3;
   }

   this.setColors = function(array, explode)
   {
      if (explode)
      {
         array = unpackArray(array);
      }
      glContext.bindBuffer(glContext.ARRAY_BUFFER, this.colorBufferPointer);
      glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(array), glContext.STATIC_DRAW);
      this.colorBufferPointer.itemSize = 4;
      this.colorBufferPointer.numItems = array.length / 3;
   }

   this.setElements = function(array, explode)
   {
      if (explode)
      {
         array = unpackArray(array);
      }
      glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.elementBufferPointer);
      glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(array), glContext.STATIC_DRAW);
      this.elementBufferPointer.itemSize = 1;
      this.elementBufferPointer.numItems = array.length;
   }
}

var lastTime = 0;

function animate() {
}

function tick() {
   requestAnimFrame(tick);
   drawScene();
   animate();
}

function webGLStart() {
   var canvas = document.getElementById("lesson04-canvas");
   initGL(canvas);
   initShaders()
   initBuffers();

   gl.clearColor(0.0, 0.0, 0.0, 1.0);
   gl.enable(gl.DEPTH_TEST);

   tick();
}

