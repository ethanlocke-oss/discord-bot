const { Schema, model } = require("mongoose");

// Remove the mongo ID and version key when returning JSON
const removeIdAndVersion = (doc, ret) => {
  delete ret._id;
  delete ret.__v;
};

const robotModel = new Schema(
  {
    userId: { type: String, unique: true },
    hitPoints: { type: Number, default: 5 },
    hasFought: { type: Boolean, default: false },
    armour: { type: Number, default: 0 },
    damage: { type: Number, default: 1 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 }
  },
  {
    toJSON: {
      transform: removeIdAndVersion
    }
  }
);

module.exports = model("Robot", robotModel);