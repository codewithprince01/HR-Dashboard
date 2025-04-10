const mongoose = require("mongoose");

const hrSchema = new mongoose.Schema({
  srNo: { type: Number, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  position: { type: String, required: true },
  department: { type: String },
  experience: { type: String },
  profileImage: { type: String },
  resume: { type: String },
  declaration: { type: Boolean, default: false },

  status: {
    type: String,
    default: "New",
  },

  dateOfJoining: { type: Date },
  isEmployee: { type: Boolean, default: false },
  role: { type: String },


  attendance: [
    {
      date: { type: Date, default: Date.now },
      status: { type: String, enum: ["Present", "Absent"], default: "Present" },
      task: { type: String },
    },
  ],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

hrSchema.pre("save", async function (next) {
  if (!this.isNew) return next();
  try {
    const lastRecord = await this.constructor.findOne().sort({ srNo: -1 });
    this.srNo = lastRecord ? lastRecord.srNo + 1 : 1;
    next();
  } catch (err) {
    next(err);
  }
});


module.exports = mongoose.model("HR", hrSchema);
