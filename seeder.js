const fs = require("fs");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load models
const BootCamp = require("./models/Bootcamp");

// const connectDB = () => {
//   mongoose
//     .connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useCreateIndex: true,
//       useFindAndModify: false,
//       useUnifiedTopology: true
//     })
//     .then(con =>
//       console.log(
//         `MongoDB connected: ${conn.connection.host}`.cyan.underline.bold
//       )
//     )
//     .catch(err => console.log(`MongoDB connection failed`.red.underline.bold));
// };

dotenv.config({ path: `./config/dev.env` });

connectDB();

// Read JSON files
const bootCamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

const insertBootcamps = async () => {
  try {
    console.log(bootCamps);

    await BootCamp.create(bootCamps);

    console.log(`Bootcamps imported`.green.inverse);
    process.exit();
  } catch (error) {
    console.log(`Bootcamps import failed`.red.inverse);
    console.log(error);
  }
};

const deleteBootcamps = async () => {
  try {
    await BootCamp.deleteMany();
    console.log(`Bootcamps deleted`.green.inverse);
    process.exit();
  } catch (error) {
    console.log(`Bootcamps delete failed`.red.inverse);
  }
};

if (process.argv[2] === "-i") {
  insertBootcamps();
} else if (process.argv[2] === "-d") {
  deleteBootcamps();
} else {
  console.log("Please add valid options for the seeder -i or -d");
  process.exit();
}
