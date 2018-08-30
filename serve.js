const express = require('express')

const app = express()
var nodegit = require("nodegit");
var git = require('git-promise');
var getRepo = require('./git/repo/getRepo');

git("diff 586fba612f11cefd100b1066e4947cfc62f86bcf 259df8bf6da398313e1e433de3c1e263df2011ef", { cwd: 'tutorialize-sample-repo/' }).then(function (diff) {
    console.log(diff); // This is your current branch
}).fail(function (err) {
    console.log(err);
});

if (false) {
    getRepo("./tutorialize-sample-repo")
        .then(function (repo) {
            return repo.getMasterCommit();
        })
        .then(function (masterCommit) {

            // History returns an event.
            var history = masterCommit.history(nodegit.Revwalk.SORT.TIME);

            var historyJSON = [];
            // History emits "commit" event for each commit in the branch's history
            history.on("commit", function (commit) {
                var commitDiff = commit.getDiff();
                console.log("commit " + commit.sha());
                console.log("Author:", commit.author().name() +
                    " <" + commit.author().email() + ">");
                console.log("Date:", commit.date());
                console.log("\n    " + commit.message());
                historyJSON.push(commit.message());
            });

            history.on('end', function (commits) {
                // Use commits
                //res.send(JSON.stringify(historyJSON))
            });

            history.on('error', function (error) {
                // Use error
                //res.send("Error trying to get commit history")
            });

            // Don't forget to call `start()`!
            history.start();
        }).catch((err) => { console.log(err) });

}


// app.get('/', (req, res) => {
//     getRepo("./google-search-navigator")
//         .then(function (repo) {
//             return repo.getMasterCommit();
//         })
//         .then(function (masterCommit) {

//             // History returns an event.
//             var history = masterCommit.history(nodegit.Revwalk.SORT.TIME);

//             var historyJSON = [];
//             // History emits "commit" event for each commit in the branch's history
//             history.on("commit", function (commit) {
//                 var commitDiff = commit.getDiff();
//                 console.log("commit " + commit.sha());
//                 console.log("Author:", commit.author().name() +
//                     " <" + commit.author().email() + ">");
//                 console.log("Date:", commit.date());
//                 console.log("\n    " + commit.message());
//                 historyJSON.push(commit.message());
//             });

//             history.on('end', function (commits) {
//                 // Use commits
//                 res.send(JSON.stringify(historyJSON))
//             });

//             history.on('error', function (error) {
//                 // Use error
//                 res.send("Error trying to get commit history")
//             });

//             // Don't forget to call `start()`!
//             history.start();
//         }).catch((err) => { console.log(err) });
// })

// app.listen(3000, () => console.log('Example app listening on port 3000!'))