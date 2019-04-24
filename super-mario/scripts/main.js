//Helper Functions
function loadImage(url){
  return new Promise(resolve => {
    const image = new Image();
    image.addEventListener("load", () => {
      resolve(image);
    });
    image.src = url;
  })
}

function drawBackground(name, context, sprites) {
  const test = name.get("tile");
  const ranges = name.get("ranges");
  for (let x = ranges[0]; x < ranges[1]; ++x) {
      for (let y = ranges[2]; y < ranges[3]; ++y) {
          sprites.drawTile(test, context, x, y);
      }
  }
}

function loadBackgroundSprites(){
  return loadImage("../tiles.png").then(image => {
  console.log("Background Loaded", image);
  const sprites = new SpritesSheet(image, 16, 16);
  
  sprites.defineTile("sky", 3, 23);
  sprites.addRanges("sky", [0, 25, 0, 14]);
  sprites.defineTile("ground", 0, 0);
  sprites.addRanges("ground", [0, 25, 12, 14]);
  return sprites;
});
}

function loadMarioSprites(){
  return loadImage("../characters.gif").then( image => {
  console.log("Mario Loaded", image);
  const sprites = new SpritesSheet(image, 16, 16);
  sprites.define("idle", 276, 44, 16, 16);
  return sprites;
});
}

function createBackgroundLayer(backgrounds, sprites){
  const buffer = document.createElement("canvas");
  buffer.width = 256;
  buffer.height = 240;
  backgrounds.forEach(background => {
    drawBackground(background, buffer.getContext("2d"), sprites);
  });
  return function drawBackgroundLayer(context){
    context.drawImage(buffer, 0, 0); 
  };

}

function createSpriteLayer(sprite, pos){
  return function drawSpriteLayer(context){
    sprite.draw("idle", context, pos.x, pos.y);
  };
}

//Classes
class SpritesSheet{
   constructor(image, width, heigth){
     this.image = image;
     this.width = width;
     this.heigth = heigth;
     this.tiles = new Map();
     this.backgrounds = new Map();
   }

   define(name, x, y, width, height){
     const buffer = document.createElement('canvas');
     buffer.width = width;
     buffer.height = height;
     buffer.getContext("2d").
      drawImage(this.image,
        x,
        y,
        height,
        width,
        0,
        0,
        width,
        height);
    this.tiles.set(name, buffer);
   }

   defineTile(name, x, y){
     this.define(name, x*this.width, y*this.heigth, this.width, this.heigth);
   }

   draw(name, context, x, y){
    const buffer = this.tiles.get(name);
    context.drawImage(buffer, x, y);
   }

   drawTile(name, context, x, y){
    this.draw(name, context, x*this.width, y*this.heigth);
   }

   addRanges(name, ranges){
     var background = new Map()
     background.set("ranges", ranges);
     background.set("tile", name);
     this.backgrounds.set(name, background);
   }
}

class Compositor{
  constructor(){
    this.layers = [];
  }

  draw(context){
    this.layers.forEach(layer => {
      layer(context)
    })
  }
}

//HTML Canvas Joining
const canvas = document.getElementById("screen");
const context = canvas.getContext("2d");


//Main Function
Promise.all([
  loadMarioSprites(), loadBackgroundSprites()
]).then(([marioSprites, backgroundSprites]) => {
  const comp = new Compositor();
  const backgroundLayer = createBackgroundLayer(backgroundSprites.backgrounds, backgroundSprites);
  comp.layers.push(backgroundLayer);
  
  const pos = {x: 64, y: 64};
  const velocity = {x: 2, y: -10};


  const spriteLayer = createSpriteLayer(marioSprites, pos);
  comp.layers.push(spriteLayer);

  function update(){
    comp.draw(context);
    pos.x+=2;
    pos.y+=2;
    requestAnimationFrame(update); 
  }

  update();
})