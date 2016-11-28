#! /usr/bin/env node
const blessed = require('blessed');
const Buffer = require('./buffer');

// print process.argv
process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);

});


// Create a screen object.
var screen = blessed.screen({
    fastCSR: true
});

screen.title = 'HexComp';

function mkBox(props) {
    let box = blessed.list({
        top: 'center',
        alwaysScroll: true,
        scrollable: true,
        scrollbar: true,
        width: '51%',
        height: '100%',
        content: 'Loading...',
        tags: true,
        border: {
            type: 'line'
        },
        style: {
            fg: 'white',
            bg: 'black',
            border: {
                fg: '#f0f0f0'
            },
            scrollbar: {
                bg: 'blue'
            },
        }
    });
    return Object.assign(box,props);
}

var box = mkBox({left:"0"});
var box2 = mkBox({right: "0"});

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
        box.scroll(d);
        box2.scroll(d);
        screen.render();
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

screen.append(box);
screen.append(box2);
box.focus();
box2.focus();
screen.render();



const buf1 = new Buffer("buf1");
const buf2 = new Buffer("buf2");

let buffers = [buf1.loadFromFile(process.argv[2]),buf2.loadFromFile(process.argv[3])];

Promise.all(buffers).then(()=>{
    const width = screen.width > 130 ? 16 : 8;
    let numlines1 = buf1.getNumLines(width);
    let numlines2 = buf2.getNumLines(width);
    let text1 = "", text2= "";
    for (let i=0;i<numlines1;i++) {
        const mask = buf1.getDiffMask(buf2,i*width,width);
        text1 += buf1.formatChunk(i*width,width,mask)+"\n";
        text2+= buf2.formatChunk(i*width,width,mask)+"\n";
    }
    box.setContent(text1);
    box2.setContent(text2);
    screen.render();

}).catch((e)=>{
    console.log("Error",e);
}) ;
