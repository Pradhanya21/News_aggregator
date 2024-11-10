const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log("DB connected");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.DATABASE_CLOUD, {
//       useNewUrlParser: true, // No longer necessary in Mongoose 6
//       useUnifiedTopology: true, // No longer necessary in Mongoose 6
//     });
//     console.log("DB connected");
//   } catch (error) {
//     console.error(error.message);
//     process.exit(1);
//   }
// };

module.exports = connectDB;
