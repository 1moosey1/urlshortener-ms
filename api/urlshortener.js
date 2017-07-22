mongodb = require("mongodb").MongoClient;

var jsonError = { newURL: "Error" };

module.exports.domain = "";
module.exports.mongoURL = "";

module.exports.post = function (postedURL, response) {

    mongodb.connect(module.exports.mongoURL, function(err, db) {

        if (err) {

            response.json(jsonError);
            db.close();
        }
        else
            findExistingUrl(postedURL, db, response);
    });
};

module.exports.get = function (urlkey, response) {

    mongodb.connect(module.exports.mongoURL, function(err, db) {

        if (err) {

            response.send("Error");
            db.close();
        }
        else if (parseInt(urlkey))
            findExistingKey(parseInt(urlkey), db, response);

        else
            findExistingUrl(urlkey, db, response);
    });
};

function findExistingKey(urlkey, db, response) {

    var collection = db.collection("urlkeys");
    collection.findOne({ urlkey:urlkey }, function (err, doc) {

        if (err || !doc)
            response.send("Invalid shortened url");

        else
            response.redirect(doc.url);

        db.close();
    });
}

// If postedURL has been shortened use existing urlkey
function findExistingUrl(postedURL, db, response) {

    var collection = db.collection("urlkeys");
    collection.findOne({ url:postedURL }, function (err, doc) {

        if (err)
            response.json(jsonError);

        else if (doc)
            response.json({ newURL: module.exports.domain + doc.urlkey });

        else
            newKey(postedURL, collection, response);

        db.close();
    });
}

// Create new urlkey for postedURL since no existing one was found
function newKey(postedURL, collection, response) {

    var urlkey = Math.floor((Math.random() * 99999));
    postedURL = validateUrl(postedURL);

    collection.insertOne({ urlkey: urlkey, url: postedURL }, function (err) {

        if (err)
            response.json(jsonError);

        else
            response.json({ newURL: module.exports.domain + urlkey });
    });
}

// Make sure the url starts with https:// so it can be properly redirected
function validateUrl(url) {

    if(!url.startsWith("https://") && !url.startsWith("http://"))
        url = "https://" + url;

    return url;
}