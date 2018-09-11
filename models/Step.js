const mongoose = require("mongoose");

let StepSchema = new mongoose.Schema(
  {
    title: { type: String },
    info: { type: String },
    list: [{ type: String }],
    tutorial: { type: mongoose.Schema.Types.ObjectId, ref: "Tutorial" }
  },
  { timestamps: true }
);

StepSchema.methods.stepJSON = function() {
  return {
    id: this._id,
    title: this.title,
    info: this.info,
    list: this.list
  };
};
