var express = require("express");
var path = require("path");

var app = express();

app.use(express.static(path.join(__dirname, "public")));

app.post("/", function(request, response) {

    response.send(request.headers);
});

app.get("/:urlid", function(request, response) {

    response.send(request.params);
});

app.listen(process.env.PORT || 1337);