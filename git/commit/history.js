var nodegit = require("nodegit");

var path = require("path");




nodegit.Repository.open(path.resolve(__dirname, "./fb-event-stats"))
    .then(function (repo) {
        return repo.getMasterCommit();
    })
    .then(function (firstCommitOnMaster) {
        // History returns an event.
        var history = firstCommitOnMaster.history(nodegit.Revwalk.SORT.TIME);

        // History emits "commit" event for each commit in the branch's history
        history.on("commit", function (commit) {
            console.log("commit " + commit.sha());
            console.log("Author:", commit.author().name() +
                " <" + commit.author().email() + ">");
            console.log("Date:", commit.date());
            console.log("\n    " + commit.message());
        });

        // Don't forget to call `start()`!
        history.start();
    }).catch(() => { console.log('FUCKER') });