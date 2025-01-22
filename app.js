//Based on this tutorial: https://www.youtube.com/watch?v=3yLL9ADo-ko
//glMatrix used for matrix math

var cWidth = 800;
var cHeight = 800;

//colours
var c=[
    [0.5, 0.5, 0.5],
    [0.75, 0.25, 0.5],
    [0.25, 0.25, 0.75],
    [1.0, 0.0, 0.15],
    [0.0, 1.0, 0.15],
    [0.5, 0.5, 1.0]
];

//movement
var speed;
var xAngle;
var yAngle;
var rs; //random sign

function starter() {
    randomise(c,speed,xAngle,yAngle,rs);
//   c.forEach((element)=>element.forEach((element1)=>console.log(element1)));
};
var el = document.getElementById('randomiseButton');
el.onclick = starter;

function randomise(c,speed,xAngle,yAngle,rs) {
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 3; j++) {
        c[i][j] = Math.random().toFixed(2);
        }
    }
    rs = Math.random() < 0.5 ? -1 : 1;
    speed=Math.trunc(rs*(Math.random().toFixed(2)*20+1));
    rs = Math.random() < 0.5 ? -1 : 1;
    xAngle=Math.trunc(rs*(Math.random().toFixed(2)*5+1));
    rs = Math.random() < 0.5 ? -1 : 1;
    yAngle=Math.trunc(rs*(Math.random().toFixed(2)*5+1));
    main(c,speed,xAngle,yAngle);
}


function main(c,speed,xAngle,yAngle) {
    var vertexShaderText=[
    'precision mediump float;',
    '',
    'attribute vec3 vertPosition;',
    'attribute vec3 vertColor;',
    'varying vec3 fragColor;',
    'uniform mat4 mWorld;',
    'uniform mat4 mView;',
    'uniform mat4 mProj;',
    '',
    'void main()',
    '{',
    '   fragColor = vertColor;',
    '   gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
    '}'
    ].join('\n');
    var fragmentShaderText=[
    'precision mediump float;',
    '',
    'varying vec3 fragColor;',
    'void main()',
    '{',
    '   gl_FragColor = vec4(fragColor, 1.0);',
    '}'
    ].join('\n');

    var canvas = document.getElementById("myCanvas");
    var gl = canvas.getContext("webgl");
    if (!gl){
        gl=canvas.getContext("experimental-webgl");
    }
    if (!gl){
        alert("Your browser does not support WebGL.");
    }

    canvas.height=window.innerHeight/3;
    canvas.width=canvas.height;
    gl.viewport(0,0,window.innerHeight/3,window.innerHeight/3);

    gl.clearColor(1.0,1.0,1.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);

    var vertexShader=gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader=gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    var boxVertices = 
    [ //x,y,z,    r,g,b,
        //top
        -1.0, 1.0, -1.0,    c[0][0], c[0][1], c[0][2],
        -1.0, 1.0, 1.0,     c[0][0], c[0][1], c[0][2],
        1.0, 1.0, 1.0,      c[0][0], c[0][1], c[0][2],
        1.0, 1.0, -1.0,     c[0][0], c[0][1], c[0][2],

        //left
        -1.0, 1.0, 1.0,     c[1][0], c[1][1], c[1][2],
        -1.0, -1.0, 1.0,    c[1][0], c[1][1], c[1][2],
        -1.0, -1.0, -1.0,   c[1][0], c[1][1], c[1][2],
        -1.0, 1.0, -1.0,    c[1][0], c[1][1], c[1][2],

        //right
        1.0, 1.0, 1.0,      c[2][0], c[2][1], c[2][2],
        1.0, -1.0, 1.0,     c[2][0], c[2][1], c[2][2],
        1.0, -1.0, -1.0,    c[2][0], c[2][1], c[2][2],
        1.0, 1.0, -1.0,     c[2][0], c[2][1], c[2][2],

        //front
        1.0, 1.0, 1.0,      c[3][0], c[3][1], c[3][2],
        1.0, -1.0, 1.0,     c[3][0], c[3][1], c[3][2],
        -1.0, -1.0, 1.0,    c[3][0], c[3][1], c[3][2],
        -1.0, 1.0, 1.0,     c[3][0], c[3][1], c[3][2],

        //back
        1.0, 1.0, -1.0,     c[4][0], c[4][1], c[4][2],
        1.0, -1.0, -1.0,    c[4][0], c[4][1], c[4][2],
        -1.0, -1.0, -1.0,   c[4][0], c[4][1], c[4][2],
        -1.0, 1.0, -1.0,    c[4][0], c[4][1], c[4][2],

        //bottom
        -1.0, -1.0, -1.0,   c[5][0], c[5][1], c[5][2],
        -1.0, -1.0, 1.0,    c[5][0], c[5][1], c[5][2],
        1.0, -1.0, 1.0,     c[5][0], c[5][1], c[5][2],
        1.0, -1.0, -1.0,    c[5][0], c[5][1], c[5][2],
    ];

    var boxIndices =
    [
        //top
        0, 1, 2,
        0, 2, 3,

        //left
        5, 4, 6,
        6, 4, 7,

        //right
        8, 9, 10,
        8, 10, 11,

        //front
        13, 12, 14,
        15, 14, 12,

        //back
        16, 17, 18,
        16, 18, 19,

        //bottom
        21, 20, 22,
        22, 20, 23
    ];

    var boxVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

    var boxIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation, //attribute location
        3, //no of elements per attribute
        gl.FLOAT, //type of elements
        gl.FALSE, //normalised?
        6*Float32Array.BYTES_PER_ELEMENT, //size of each vertex
        0 //offset from beginning of single vertex to this attribute
    );
    gl.vertexAttribPointer(
        colorAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        6*Float32Array.BYTES_PER_ELEMENT,
        3*Float32Array.BYTES_PER_ELEMENT
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    gl.useProgram(program);

    var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);

    glMatrix.mat4.identity(worldMatrix);
    glMatrix.mat4.lookAt(viewMatrix,[0,0,-5],[0,0,0],[0,1,0]);
    glMatrix.mat4.perspective(projMatrix,0.8,canvas.width/canvas.height,0.1,1000.0);

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FLASE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FLASE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FLASE, projMatrix);

    var xRotationMatrix = new Float32Array(16);
    var yRotationMatrix = new Float32Array(16);

    //main render loop
    var angle=0;
    var identityMatrix = new Float32Array(16);
    glMatrix.mat4.identity(identityMatrix);

    var loop = function(){
        angle = performance.now()/1000/speed*2*Math.PI;
        glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, angle/xAngle, [1,0,0]);
        glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, angle/yAngle, [0,1,0]);
        glMatrix.mat4.mul(worldMatrix, xRotationMatrix, yRotationMatrix);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

        gl.clearColor(0.0,0.0,0.0,0.0);
        gl.clear(gl.DEPTH_BUFFER_BIT|gl.COLOR_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
};
