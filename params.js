/**
 * Created by michbil on 03.12.16.
 */

process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
});

if (process.argv.length < 3) {
    console.log("USAGE: hexcomp file1 file2 [file3] [file4] ...\n\n");
    process.exit(0);
}

module.exports = process.argv.slice(2);