const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GroupSchema = new Schema({
  name: { type: String, minLength: 3, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  admins: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Group', GroupSchema);
