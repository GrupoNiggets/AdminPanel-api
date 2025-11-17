const mongoose = require('mongoose');

const StatusSchema = new mongoose.Schema(
  {
    responseCode: { type: Number, required: false },
    responseTime: { type: Number, required: false },
    timestamp: { type: Date, required: false }
  },
  { collection: 'status' }
);

module.exports = mongoose.model('Status', StatusSchema);
