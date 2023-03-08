const csvToNdjson = require('csv-to-ndjson');
 
csvToNdjson('target.csv', {
    destination: 'clean.json',
})