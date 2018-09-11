const mongoose = require("mongoose");
const mongooseUniqueValidator = require("mongoose-unique-validator");
const slugify = require("slugify");
let User = mongoose.model("User");

let TutorialSchema = new mongoose.Schema(
  {
    slug: { type: String, lowercase: true, unique: true },
    imageUrl: String,
    heading: String,
    subHeading: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    upToDate: String,
    tags: [{ type: String }],
    videoUrl: String,
    githubRepoUrl: String,
    mainSteps: [{ type: mongoose.Schema.Types.ObjectId, ref: "Step" }]
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
