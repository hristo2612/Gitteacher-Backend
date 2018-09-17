const mongoose = require("mongoose");
const mongooseUniqueValidator = require("mongoose-unique-validator");
const slugify = require("slugify");
let User = mongoose.model("User");
const isGithubUrl = /^(?:http(?:s)?:\/\/)?(?:[^\.]+\.)?github\.com(\/.*)?$/;

let TutorialSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "Can't be blank.."],
      index: true
    },
    imageUrl: String,
    heading: {
      type: String,
      required: [true, "Heading can't be blank.."],
      minlength: 4,
      maxlength: 99
    },
    subHeading: {
      type: String,
      required: [true, "Sub Heading can't be blank.."],
      minlength: 4,
      maxlength: 99
    },
    // author: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User"
    // },
    upToDate: String,
    tags: [{ type: String }],
    videoUrl: String,
    githubRepoUrl: String
    //mainSteps: [{ type: mongoose.Schema.Types.ObjectId, ref: "Step" }]
  },
  { timestamps: true }
);

TutorialSchema.plugin(mongooseUniqueValidator, { message: "is already used" });

TutorialSchema.methods.slugify = function() {
  this.slug = slugify(this.heading);
};

TutorialSchema.pre("validate", function(next) {
  if (!this.slug) {
    this.slugify();
  }
  if (!isGithubUrl.test(this.githubRepoUrl)) {
    next(["Please state a valid github repository"]);
  }
  next();
});

TutorialSchema.methods.tutorialJSON = function() {
  return {
    slug: this.slug,
    heading: this.heading,
    imageUrl: this.imageUrl,
    subHeading: this.subHeading,
    author: this.author,
    upToDate: this.author,
    tags: this.tags,
    videoUrl: this.videoUrl,
    githubRepoUrl: this.githubRepoUrl,
    mainSteps: this.mainSteps
  };
};

mongoose.set("useCreateIndex", true);
mongoose.model("Tutorial", TutorialSchema);
