var express = require("express"),
    bodyparser = require("body-parser"),
    path = require("path"),
    urlshortener = require("./api/urlshortener");

urlshortener.mongoURL = process.env.mongoURL;
urlshortener.domain = "https://lit-stream-87423.herokuapp.com/";

var app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyparser.urlencoded({extended: false}));

app.get("/:urlkey", function(request, response) {

    urlshortener.get(request.params.urlkey, response);
});

app.post("/", function(request, response) {

    urlshortener.post(request.body.url, response);
});

app.listen(process.env.PORT || 1337);