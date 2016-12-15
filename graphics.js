/**
 * Created by michbil on 03.12.16.
 */

const blessed = require('blessed');


function mkBox(props) {
    return blessed.list(Object.assign({
        top: 'center',
        alwaysScroll: true,
        scrollable: true,
        scrollbar: true,
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
    },props));
}

module.exports = {mkBox};