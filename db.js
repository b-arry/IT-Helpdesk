const mongoose = require('mongoose');

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`);
    process.exit(1);
  }
};

const disconnect = async () => {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error(`Error disconnecting from MongoDB: ${error}`);
    process.exit(1);
  }
};

module.exports = {
  connect,
  disconnect,
};