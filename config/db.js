const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config({ path: './config/config.env' });
const Vote = require('./../models/voteModels');


mongoose.connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true
});

mongoose.connection
    .on("error", err => console.log("Fail to connect💥💥💥", err))
    .once("open", () => console.log("DATABASE connected successfully ✔✔✔"))



const votes = JSON.parse(
    fs.readFileSync(`${__dirname}/././../voter-data/vote-review.json`, 'utf-8')
);


const importData = async () => {
    try {
        await Vote.create(votes);
        console.log('Data Upload successfully');
    } catch (err) {
        console.error(err);
    }
    process.exit();
}

const deleteData = async () => {
    try {
        await Vote.deleteMany();
        console.log('Data Deleted successfully');
    } catch (err) {
        console.error(err);
    }
    process.exit();
}


if (process.argv[2] === '--import')
    importData();
if (process.argv[2] === '--delete')
    deleteData();






