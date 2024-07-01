const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  group: { type: Schema.Types.ObjectId, ref: 'Group', default: null },
  message: String,
  image: {
    url: String,
    publicID: String,
  },
  dateSent: { type: Date, default: Date.now },
  dateEdited: { type: Date, default: Date.now },
  seen: { type: Boolean, default: false },
  edited: { type: Boolean, default: false },
});

module.exports = mongoose.model('Message', MessageSchema);
