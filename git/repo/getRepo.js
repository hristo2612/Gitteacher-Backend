var nodegit = require("nodegit");
var projectRoot = require("../../constants").projectRoot;

var path = require("path");

module.exports = function(repo) {
    repo = repo ? repo : "./fb-event-stats";
    return nodegit.Repository.open(path.resolve(projectRoot, repo));
};
