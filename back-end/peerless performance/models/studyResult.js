const mongoose = require("mongoose");

const schema = mongoose.Schema;

const studyResultSchema = new schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    results: [
      {
        question: {
          type: String,
          default: "",
        },
        emotion: {
          type: String,
          default: "",
        },
        attribute: {
          type: String,
          default: "",
        },
        optimal: {
          type: String,
          default: "",
        },
        reason: {
          type: String,
          default: "",
        },
      },
    ],
  },
  {
    versionKey: false,
  }
);

const studyResult = mongoose.model("studyResult", studyResultSchema);

module.exports = studyResult;
