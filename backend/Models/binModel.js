const mongoose = require('mongoose');

const binSchema = new mongoose.Schema({
  bin1: {
    type: String,
    default: '0'
  },
  bin2: {
    type: String, 
    default: '0'
  },
  bin3: {
    type: String,
    default: '0'
  },
  photo: {
    type: String,
    default: null
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Static method to update or create the single bin record
binSchema.statics.updateLatestData = async function(binData) {
  // Always use the same ID to ensure only one record exists
  const SINGLETON_ID = 'latest_bin_data';
  
  const updatedData = {
    ...binData,
    lastUpdated: new Date(),
    _id: SINGLETON_ID
  };
  
  // Use upsert to update existing or create new
  const result = await this.findOneAndUpdate(
    { _id: SINGLETON_ID },
    updatedData,
    { 
      upsert: true, 
      new: true,
      setDefaultsOnInsert: true
    }
  );
  
  return result;
};

// Static method to get the latest data
binSchema.statics.getLatestData = async function() {
  const SINGLETON_ID = 'latest_bin_data';
  
  let result = await this.findById(SINGLETON_ID);
  
  // If no data exists, create default record
  if (!result) {
    result = await this.create({
      _id: SINGLETON_ID,
      bin1: '0',
      bin2: '0', 
      bin3: '0',
      photo: null
    });
  }
  
  return result;
};

const Bin = mongoose.model('Bin', binSchema);

module.exports = Bin;
