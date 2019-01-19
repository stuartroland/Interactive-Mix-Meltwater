//import oscP5.*;
//import netP5.*;

//OscP5 oscP5;

function preload() {
  cDark = loadImage('images/CoverDark.jpg');
  cLight = loadImage('images/CoverLight.jpg');
  cNeutral = loadImage('images/CoverNeutral.jpg');
  
  folder = "multitracks";
  fileType = ".mp3";
  pianoChords = loadSound(folder+"/Meltwater Piano Chords"+fileType);
  synthChords = loadSound(folder+"/Meltwater Synth Chords"+fileType);
  melFwdDry = loadSound(folder+"/Meltwater Mel Fwd Dry 2"+fileType);
  melFwdEff = loadSound(folder+"/Meltwater Mel Fwd Eff 2"+fileType);
  melRevDry = loadSound(folder+"/Meltwater Mel Rev Dry 2"+fileType);
  melRevEff = loadSound(folder+"/Meltwater Mel Rev Eff 2 Cutoff"+fileType);
  
  triggered = 0;
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  //change so opacty is from 0.0 to 1.0
  colorMode(RGB, 255, 255, 255, 1);
  noStroke();
  
  res = 1;
  upd = 1;
  x=0.5;
  y=0.5;
  
  //set the framerate
  fr = 24;
  frameRate(fr);
  
  // initialize target levels and current levels to allow smooth gain changes
  //pct, sct, mfd, mfe, mrd, mre = 0;
  target = [0,0,0,0,0,0];
  current = [1,0.5,0.5,0.25,0.5,0.25];
  levelDiff = [0,0,0,0,0,0];
  
  // set duration of gain changes in seconds
  gainChangeDur = 1;
  
  updateSteps = 0;
}

function draw() {
  if (res) {
    createCanvas(windowWidth,windowHeight);
  }
  if(res || upd) {
    background(255);
  }
  
  if(res) {
    //fill the window with the biggest possible version of the square album cover 
    imgSideLen = 0;
    if(width>height) {
      imgSideLen = height;
    } else {
      imgSideLen = width;
    }
    xMargin = (width-imgSideLen)/2.0;
    yMargin = (height-imgSideLen)/2.0;
  }



  if(upd) {
    //display images fwds/reversed based on x and light/dark based on y
    //also play fwds/rev melody based on x, and ligh/dark mix based on y
    //should make sure to use calculations that ensure equal power across the 2D crossovers (both visually and in the audio)
    //set up so that it only adjusts/updates when something has changed (the window size changes and the canvas adjusts, the cursor position changes and x and y are recalculated, imgs and audio rebalanced)
    
    //set origin to only album art square upper left
    translate(width/2,height/2);
    //put reflected std version in background, gives more saturation
    tint(255, 0.4);
    image(cNeutral,-imgSideLen/2,-imgSideLen/2,imgSideLen,imgSideLen);
    scale(-1.0,1.0);
    image(cNeutral,-imgSideLen/2,-imgSideLen/2,imgSideLen,imgSideLen);
    scale(-1.0,1.0);
    //display the changes based on x and y
    tint(255, x*y);
    image(cDark,-imgSideLen/2,-imgSideLen/2,imgSideLen,imgSideLen);
    tint(255, x*(1-y));
    image(cLight,-imgSideLen/2,-imgSideLen/2,imgSideLen,imgSideLen);
    scale(-1.0,1.0);
    tint(255, (1-x)*y);
    image(cDark,-imgSideLen/2,-imgSideLen/2,imgSideLen,imgSideLen);
    tint(255, (1-x)*(1-y));
    image(cLight,-imgSideLen/2,-imgSideLen/2,imgSideLen,imgSideLen);
    scale(-1.0,1.0);
    tint(255,1);
    translate(-width/2,-height/2);
    
    
    //set the target levels based on new input
    setTargetLevels();
  }
  
  // if the current levels are not at the target levels, incrementally adjust them closer
  if(updateSteps>0) {
    updateLevels();
  }
  
  //reset the "resized" and "updated" flags
  res = 0;
  upd = 0;
}

function windowResized() {
  res = 1;
  upd = 1;
}

function mousePressed() {
  //calculate x and y, the percent location of the cursor on the image in x and y dimensions of the artowrk
  if((mouseX>xMargin) && (mouseX<imgSideLen+xMargin) && (mouseY>yMargin) && (mouseY<imgSideLen+yMargin)) {x = (mouseX-xMargin)/imgSideLen; y = (mouseY-yMargin)/imgSideLen;}
  /*
  if(mouseX<xMargin) {x = 0}
  else if(mouseX>imgSideLen+xMargin) {x = 1}
  else {x = (mouseX-xMargin)/imgSideLen}
  if(mouseY<yMargin) {y = 0}
  else if(mouseY>imgSideLen+yMargin) {y = 1}
  else {y = (mouseY-yMargin)/imgSideLen}
  */
  upd =1;
  if(triggered===0) {
    pianoChords.play();
    synthChords.play();
    melFwdDry.play();
    melFwdEff.play();
    melRevDry.play();
    melRevEff.play();
    triggered=1;
  }
}

function mouseDragged() {
  //calculate x and y, the percent location of the cursor on the image in x and y dimensions of the artowrk
  if((mouseX>xMargin) && (mouseX<imgSideLen+xMargin) && (mouseY>yMargin) && (mouseY<imgSideLen+yMargin)) {x = (mouseX-xMargin)/imgSideLen; y = (mouseY-yMargin)/imgSideLen;}
  upd =1;
}

function setTargetLevels() {
  target[0] = 1;
  target[1] = 1-y;
  target[2] = x;
  target[3] = x*(1-y);
  target[4] = 1-x;
  target[5] = (1-x)*(1-y);
  
  updateSteps = int(getFrameRate()*gainChangeDur);
  
  for(i = 0; i<6; i++) {
    levelDiff[i] = ((target[i]-current[i])/updateSteps);
  }
}

//incrementally adjust levels towards target level
function updateLevels() {
  for(i = 0; i<6; i++) {
    current[i] = current[i]+levelDiff[i];
  }
  
  pianoChords.setVolume(current[0]);
  synthChords.setVolume(current[1]);
  melFwdDry.setVolume(current[2]);
  melFwdEff.setVolume(current[3]);
  melRevDry.setVolume(current[4]);
  melRevEff.setVolume(current[5]);
    
  updateSteps = updateSteps - 1;
}