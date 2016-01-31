// Singletons
var Client = require('node-rest-client').Client;
var csv = require('csv');
var fs = require('fs');
var client = new Client();

// Config
var csv_file = './data/clickbait.csv';
var truth_flag = 'Truth';
var fake_flag = 'Fake';
var reddit_api_limit = "100";

var source_urls = [
    {
        url: "https://www.reddit.com/r/fakenews/new.json?limit=" + reddit_api_limit,
        callback_handler: process_Reddit_json_to_fake
    },
    {
        url: "https://www.reddit.com/r/fakenews/new.json?after=t3_ymy74&limit=" + reddit_api_limit,
        callback_handler: process_Reddit_json_to_fake
    },
    {
        url: "https://www.reddit.com/r/fakenews/new.json?after=t3_15mlli&limit=" + reddit_api_limit,
        callback_handler: process_Reddit_json_to_fake
    },
    {
        url: "https://www.reddit.com/r/nottheonion/new.json?limit=" + reddit_api_limit,
        callback_handler: process_Reddit_json_to_truth
    },
    {
        url: "https://www.reddit.com/r/nottheonion/new.json?after=t3_434b6o&limit=" + reddit_api_limit,
        callback_handler: process_Reddit_json_to_truth
    },
    {
        url: "https://www.reddit.com/r/nottheonion/new.json?after=t3_42za0h&limit=" + reddit_api_limit,
        callback_handler: process_Reddit_json_to_truth
    },
];

// Wrappers for Reddit's json api callback
function process_Reddit_json_to_fake(data, response) { process_Reddit_json(data, response, fake_flag); }
function process_Reddit_json_to_truth(data, response) { process_Reddit_json(data, response, truth_flag); }
// Callback to Client.get for Reddit's json api returns
function process_Reddit_json(data, response, classification) {
    var scraped_data = [];
    var results = JSON.parse(data).data.children;

    if( results instanceof Array ) {
        results.forEach(function(el, index, arr) {
            scraped_data.push([el.data.url, el.data.title, classification]);
        });
    }

    csv.stringify(scraped_data, write_csv_file);
}

// Callback for csv.stringify
function write_csv_file(stringify_err, stringify_output) {
    fs.appendFile(csv_file, stringify_output, function(fs_err) {
        if (fs_err !== null) console.log(fs_err);
    });
}

// main processing
source_urls.forEach(function(el, index, arr) {
    var url = el.url;
    var callback = el.callback_handler;

    client.get(url, callback);
});


