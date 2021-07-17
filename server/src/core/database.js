const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

const connectToDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    console.log(`Database succesfully connected to: ${MONGODB_URI}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectToDB;
