#! /usr/bin/env node
const blessed = require('blessed');
const Buffer = require('./buffer');

const params = require('./params');
const filenames = params;


// Create a screen object.
var screen = blessed.screen({
    fastCSR: true
});

screen.title = 'HexComp';


const maxColumns = Math.floor(screen.width / Buffer.getNarrowWidth());
const numBuffers = filenames.length;
const numColumns = numBuffers > maxColumns ? maxColumns : numBuffers;


const calcWidth = () => {
    if (numColumns > 2) {
        return 8;
    }
    return screen.width > (Buffer.getFullWdith()*2) ? 16 : 8;
};

const mkBox = require('./graphics').mkBox;

const columnWidth = Buffer.getWidth(calcWidth());
const wrap = f => '['+f+']';
const boxes = filenames.map((name,i) => mkBox(
    {
        left: (columnWidth+1)*i,
        width:columnWidth+1,
        label:wrap(name)
    }));


// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
});

var t = new Date().getTime();
var saved = 0;

const scroll = (d) => {

    let time = new Date().getTime();

    if ((time - t > 30) || Math.abs(saved) > 5) {
        d += saved;
        boxes.forEach((box)=>box.scroll(d));
        //screen.render();
        saved = 0;
    } else {
        saved += d;
    }
    t = time;

};

setInterval(()=>{
    if (Math.abs(saved) > 0) {
        let time = new Date().getTime();
        if (time - t > 5) {
            scroll(saved);
        }
    }
},50);

// Quit on Escape, q, or Control-C.
screen.key(['down','j'], () => scroll(1));
screen.key(['up','k'], () => scroll(-1));

screen.key(['pgdown','n'], () => scroll(20));
screen.key(['pgup','p'], () => scroll(-20));

boxes.forEach((box)=> {
    screen.append(box);
    box.focus();
});

screen.render();

let buffers;

Promise.all(filenames.map(
    (name)=>new Buffer(name).loadFromFile(name))
).then(b=>{
   buffers = b;
   displayBuffers(buffers);
}).catch((e)=>{
    console.log("Error",e);
}) ;


const greater = (val1,val2) => val1 > val2 ? val1 : val2;
const getMask  = (buffer,pos,i) => {
  const width = calcWidth();
  if (i == 0) {
      return buffers[1].getDiffMask(buffer, pos*width, width);
  }   else {
      return buffer.getDiffMask(buffers[0], pos*width, width);
  }
};

const displayBuffers = (buffers) => {
    const width = calcWidth();
    const numLines = buffers.map(b => b.getNumLines(width));
    const maxLines = Math.max.apply(null, numLines);


    buffers.forEach((buffer,i) => {
        let text = "";
        for (let j=0;j<maxLines;j++) {
            const mask = getMask(buffer,j,i);
            text += buffer.formatChunk(j*width,width,mask)+"\n";
        }
        boxes[i].setContent(text);
    });

    screen.render();
};