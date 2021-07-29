import mongoose from 'mongoose';

const URI: string = String(process.env.MONGODB_URI);

const database = mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Database succesfully connected to: ${URI}`);
  })
  .catch((err) => {
    console.log(
      `MongoDB connection error. Please make sure MongoDB is running. ${err}`
    );
  });

export default database;
