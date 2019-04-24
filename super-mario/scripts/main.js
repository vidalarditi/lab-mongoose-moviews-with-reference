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

//Classes
class SpritesSheet{
   constructor(image, width, heigth){
     this.image = image;
     this.width = width;
     this.heigth = heigth;
     this.tiles = new Map();
     this.backgrounds = new Map();
   }

   define(name, x, y){
     const buffer = document.createElement('canvas');
     buffer.width = this.width;
     buffer.height = this.heigth;
     buffer.getContext("2d").
      drawImage(this.image,
        x * this.width,
        y * this.heigth,
        this.heigth,
        this.width,
        0,
        0,
        this.width,
        this.heigth);
    this.tiles.set(name, buffer);
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

//HTML Canvas Joining
const canvas = document.getElementById("screen");
const context = canvas.getContext("2d");

//Main Function
loadImage("../tiles.png").then(image => {
  console.log("Image Loaded", image);
  const sprites = new SpritesSheet(image, 16, 16);
  
  sprites.define("sky", 3, 23);
  sprites.addRanges("sky", [0, 25, 0, 14]);
  sprites.define("ground", 0, 0);
  sprites.addRanges("ground", [0, 25, 12, 14]);
  
  // console.log(sprites);
  // console.log(sprites.backgrounds);
  // console.log(sprites.tiles);
  sprites.backgrounds.forEach(background => {
    console.log("level loaded", background);
    drawBackground(background, context, sprites);
  });
});