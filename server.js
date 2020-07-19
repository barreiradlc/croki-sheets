var express = require('express')
const fetch = require('node-fetch');
const converter = require('json-2-csv');
var fs = require('fs');




var app = express()

var key = 'de5f56260543681c187e83d60699cc36'

let json2csvCallback = function (err, csv) {
    if (err) throw err;
    fs.writeFile('Membros.csv', csv, 'utf8', function (err) {

        console.log({ csv })

        if (err) {
            console.log('Some error occured - file either not saved or corrupted file saved.');
        } else {
            console.log('It\'s saved!');
        }
    });
};

function getBoard(id) {
    return fetch(`https://api.trello.com/1/boards/${id}?key=${key}&cards=open&lists=open`, {
        // return fetch(`https://api.trello.com/1/members/${id}?key=${key}`, {
        method: 'GET'
    })
        .then(response => {
            console.log(
                `Response: ${response.status} ${response.statusText}`
            );
            return response.json();
        })
        .then(text => text)
        .catch(err => console.error(err));
}

app.get('/', function (req, res) {

    getBoard(req.query.id)
        .then((b) => {
            // converter.json2csv(b, json2csvCallback, {
            //     prependHeader: false      // removes the generated header of "value1,value2,value3,value4" (in case you don't want it)
            // });
            // res.json(b)

            fs.writeFile('Cotações.csv', csv, 'utf8', function (err) {

                console.log({ csv })

                if (err) {
                    console.log('Some error occured - file either not saved or corrupted file saved.');
                } else {
                    console.log('It\'s saved!');
                }
            });
        })


})

app.listen(3000)