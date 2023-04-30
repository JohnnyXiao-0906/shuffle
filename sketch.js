let palette;//Used to store color values.


let video;
let poseNet;

//adding position variables for the right eye
let x1=0, y1=0;
    
function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.hide();
  
  poseNet = ml5.poseNet(video, modelReady);
  
  poseNet.on("pose", gotPoses);
  
  colorMode(HSB, 360, 100, 100, 100); //Set the HSB color mode.
  angleMode(DEGREES);//Sets the angle mode to degrees.

  palette = []; //Use the Chromotome library to grab a random color combo from its color library, and make sure to get at least 5 colors.
  while (palette.length < 5) {
    palette = shuffle(chromotome.get().colors);
    }
  }

function modelReady() {
  //console.log("model ready"); //View body data
}

function gotPoses(poses) {
  //console.log(y2);
  
  //only when at least one pose is detected, access the keypoints
  if (poses.length > 0) {
    
    x1 = poses[0].pose.rightEye.x;
    y1 = poses[0].pose.rightEye.y;
  }

}

function draw() {
  clear();
  background(0, 0, 0);
   // Center the video on the canvas
   let videoX = (width - video.width / 2) / 2;
   let videoY = (height - video.height / 2) / 2;
 
   // Display the video at half size
   //image(video, videoX, videoY, video.width / 2, video.height / 2);

  let d = width;
  push();
  translate(width / 2, height / 2);
  blendMode(ADD);//Adds the source pixel (A) to the pixel already in the display window (B)
  

  //Use a loop to draw multiple colored ellipses, each with angle, radius, color and transparency calculated based on noise and framerate.
  for (let i = 0; i < palette.length*5; i++) {  //"palette.length*5"Represents the number of drawn ellipses
    let a = noise(i*8, frameCount / 150) * 720;//Adjust the angular range of the ellipse
    //let a = sin(i) * 720; 
    let b = (noise(a / 100, frameCount / 150) * d) / 4;//Change the radius range of the ellipse
    let x = cos(a) * b;
    let y = sin(a) * b;
    let n = constrain(map(noise(i * 10, frameCount / 100), 0, 1, -1, 2), 0, 2);
    //let n=1.5;
    let gradient = drawingContext.createRadialGradient(x, y, 0, x, y, d/2 * n);
    let c = color(palette[i%palette.length]);
    let c1 = color(palette[(palette.length + i + 1) % palette.length]);
    let c2 = color(palette[(palette.length + i - 1) % palette.length]);

    c1.setAlpha(0);
    c2.setAlpha(0);

    let t = map(x1, -30, 620, 15, 80);
    c.setAlpha(t);//Adjusts the transparency of the ellipse color. Lower values ​​will make the color more transparent, higher values ​​will make the color more opaque.

    gradient.addColorStop(0, c1);
    gradient.addColorStop(1, c2);
    gradient.addColorStop(a / 720, c);
    drawingContext.fillStyle = gradient;
    noStroke();
    rectMode(CENTER);
    rect(0, 0, d*2);
    
    let g = map(x1, -30, 620, 0, 1);
    let q = map(constrain(y1, 0, height), 0, height, 6, 10);
    noiseDetail(q, g-0.45);//Adjust noise detail according to eye position
  }
  pop();
  if(x1<-50 || x1 >620){
    window.location.reload();
  }

push();
rectMode(CENTER);
circle(width-(videoX + x1 / 2), videoY + y1 / 2, 10);//small squares that follow the eye
pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

