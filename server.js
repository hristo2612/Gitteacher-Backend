const express = require('express')
const app = express()
var nodegit = require("nodegit");

var path = require("path"),
    historyFile = "./descriptor.json",
    walker,
    historyCommits = [],
    commit,
    repo;


app.get('/', (req, res) => {

    // Clone a given repository into the `./tmp` folder.
    // Git.Clone("https://github.com/hristo2612/fb-event-stats", "./fb-event-stats")
    //     // Look up this known commit.
    //     .then(function (repo) {
    //         // Use a known commit sha from this repository.
    //         return repo.getMasterCommit();
    //     })
    //     // Look up a specific file within that commit.
    //     .then(function (commit) {
    //         return commit.getEntry("README.md");
    //     })
    //     // Get the blob contents from the file.
    //     .then(function (entry) {
    //         // Patch the blob to contain a reference to the entry.
    //         return entry.getBlob().then(function (blob) {
    //             blob.entry = entry;
    //             return blob;
    //         });
    //     })
    //     // Display information about the blob.
    //     .then(function (blob) {
    //         // Show the path, sha, and filesize in bytes.
    //         console.log(blob.entry.path() + blob.entry.sha() + blob.rawsize() + "b");

    //         // Show a spacer.
    //         console.log(Array(72).join("=") + "\n\n");

    //         // Show the entire file.
    //         console.log(String(blob));
    //         res.end(JSON.stringify(String(blob), null, 2));
    //         //res.send(JSON.stringify(blob));
    //     })
    //     .catch(function (err) {
    //         console.log(err);
    //         res.end("Errorrr");
    //         //res.send(JSON.stringify(err));
    //     });
    // //res.send('Hello Master YIzzle!');

    
// This code walks the history of the master branch and prints results
// that look very similar to calling `git log` from the command line

function compileHistory(resultingArrayOfCommits) {
    var lastSha;
    if (historyCommits.length > 0) {
      lastSha = historyCommits[historyCommits.length - 1].commit.sha();
      if (
        resultingArrayOfCommits.length == 1 &&
        resultingArrayOfCommits[0].commit.sha() == lastSha
      ) {
        return;
      }
    }
  
    resultingArrayOfCommits.forEach(function(entry) {
      historyCommits.push(entry);
    });
  
    lastSha = historyCommits[historyCommits.length - 1].commit.sha();
  
    walker = repo.createRevWalk();
    walker.push(lastSha);
    walker.sorting(nodegit.Revwalk.SORT.TIME);
  
    return walker.fileHistoryWalk(historyFile, 500)
      .then(compileHistory);
  }
  
  nodegit.Repository.open(path.resolve(__dirname, "../.git"))
    .then(function(r) {
      repo = r;
      return repo.getMasterCommit();
    })
    .then(function(firstCommitOnMaster){
      // History returns an event.
      walker = repo.createRevWalk();
      walker.push(firstCommitOnMaster.sha());
      walker.sorting(nodegit.Revwalk.SORT.Time);
  
      return walker.fileHistoryWalk(historyFile, 500);
    })
    .then(compileHistory)
    .then(function() {
      historyCommits.forEach(function(entry) {
        commit = entry.commit;
        console.log("commit " + commit.sha());
        console.log("Author:", commit.author().name() +
          " <" + commit.author().email() + ">");
        console.log("Date:", commit.date());
        console.log("\n    " + commit.message());
      });
    })
    .done();
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))