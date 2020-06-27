const http = require('http');
const handlebars = require('handlebars');
const fs = require('fs');

const MAX = 100;
const DESIRED_NUMBER = 50;

let template;
let number;
let dateReached;
let interval;
let nextChange;

function generateNumber() {
    let num = Math.round(Math.random() * MAX) + 1;
    nextChange = new Date();
    nextChange.setDate(nextChange.getDate() + 1);
    if (num === DESIRED_NUMBER) {
        dateReached = new Date().toString();
        if (interval) clearInterval(interval);
    }
    return num;
}

function getTodaysNumber() {
    if (typeof number === 'undefined') {
        number = generateNumber();
        interval = setInterval(() => number = generateNumber(), 86400);
        return number;
    }
    return number;
}

const server = http.createServer((req, res) => {
    if (process.env.CACHE_HTML === "true" && template) {
        res.write(cached);
        res.end();
        return;
    }

    fs.readFile('index.html', (err, data) => {
        if (err) console.log(err);
        template = handlebars.compile(data.toString());
        const number = getTodaysNumber();
        res.write(template({
            number,
            desiredNumber: DESIRED_NUMBER,
            maxNumber: MAX,
            dateReached,
            nextChange
        }));
        res.end();
    });
});

server.listen(process.env.PORT);