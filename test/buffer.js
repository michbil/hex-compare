/**
 * Created by michbil on 28.11.16.
 */

const HexBuffer = require('../buffer');
const chai = require('chai');
var expect = chai.expect;

const buf1 = new HexBuffer("buf1");
const buf2 = new HexBuffer("buf2");

describe("Buffer test", () => {

    before(() => {
        buf1.buffer = Buffer.from([1,2,3,4,5]);
        buf2.buffer = Buffer.from([1,2,3,9,5]);
    });

    it('should render text correctly', () => {
        const text = buf1.formatChunk(0,5);
        const text2 = buf2.formatChunk(0,5);
        console.log(text, text2);
    });

    it ('should generate difference map correctly', () => {
        const mask = buf1.getDiffMask(buf2,0,5);
        expect(mask).to.eql([false,false,false,true,false]);
    })

    it ('should make bold symbols')

});