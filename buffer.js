/**
 * Created by michbil on 28.11.16.
 */
const fs = require('fs');


function getFilesizeInBytes(filename) {
    var stats = fs.statSync(filename)
    var fileSizeInBytes = stats["size"]
    return fileSizeInBytes
}

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function isPrint(aChar)
{
    myCharCode = aChar.charCodeAt(0);

    if((myCharCode > 31) && (myCharCode <  127))
    {
        return true;
    }

    return false;
}


class BinaryBuffer {
    constructor(name) {
        this.name = name;
    }

    /**
     * loads from file
     * @param filename
     * @returns {Promise} when file loaded
     */
    loadFromFile(filename) {
        return new Promise((resolve,reject) => {
            const length = getFilesizeInBytes(filename);
            fs.open(filename, 'r', (status, fd) => {
                if (status) {
                    reject(status.message);
                }
                this.buffer = new Buffer(length);
                fs.read(fd, this.buffer, 0, length, 0, (err, num) => {
                    resolve(this);
                });
            });
        });
    }

    formatHex(val) {
        const v = val.toString(16).toUpperCase();
        return pad(v,2);
    }
    formatPrintableAscii(val) {
        const c = String.fromCharCode(val);
        return isPrint(c) ? c : '.';
    }

    formatChunk(address,length, mask) {

        const array = this.getSlice(address,length);

        mask = mask || array.map(()=>false);
        const applyMask = (mask,string) => mask ? `{#ff5019-fg}${string}{/}` : string;
        const applyDivider = (i) => ((i == 7) && (length == 16)) ?  " " : "";

        const values = array.reduce((s,v,i)=> s+applyMask(mask[i],this.formatHex(v))+' '+applyDivider(i),'');
        const ascii = array.reduce((s,v,i)=> s+applyMask(mask[i],this.formatPrintableAscii(v)),'');

        return `{cyan-fg}${pad(address.toString(16),6)}{/}  ${values}  ${ascii}`

    }

    getSlice (address,length) {
        return new Uint8Array(this.buffer.slice(address,address+length));
    }

    getDiffMask(buffer, address, length) {
        const ourSlice = this.getSlice(address,length);
        const foreignSlice = buffer.getSlice(address,length);

        const diff = ourSlice.reduce((res,v,i)=> res.concat(v !== foreignSlice[i]),[]);
        return diff;
    }

    getNumLines(width) {
        return Math.ceil(this.buffer.length / width);
    }

    static getWidth(columns) {
        return 6+2+2+columns*4 + 3;
    }

    static getNarrowWidth () { return this.getWidth(8)}
    static getFullWdith () { return this.getWidth(16)}
}
module.exports = BinaryBuffer;