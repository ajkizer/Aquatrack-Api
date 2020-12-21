const fs = require("fs");

const mongoose = require("mongoose");

const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });

const Aquarium = require("./models/Aquarium");
const User = require("./models/User");
const Livestock = require("./models/Livestock");
const Waterchange = require("./models/Waterchange");
const Plant = require("./models/Plant");

//connect to db
const conn = mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const aquariums = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/aquariums.json`, "utf-8")
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);

const livestock = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/livestock.json`, "utf-8")
);

const waterchanges = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/waterchanges.json`, "utf-8")
);

const plants = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/plants.json`, "utf-8")
);
//import into DB
const importData = async () => {
  try {
    await Aquarium.create(aquariums);
    await User.create(users);
    await Livestock.create(livestock);
    await Waterchange.create(waterchanges);
    await Plant.create(plants);
    console.log("Data imported...");
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

//delete data
const deleteData = async () => {
  try {
    await Aquarium.deleteMany();
    await User.deleteMany();
    await Livestock.deleteMany();
    await Waterchange.deleteMany();
    await Plant.deleteMany();
    console.log("DATA DESTROYED!!!");
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
