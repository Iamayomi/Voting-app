const mongoose = require('mongoose');
require('dotenv').config({ path: './config/config.env' });

mongoose.connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true
});

mongoose.connection
    .on("error", err => console.log("Fail to connect💥💥💥", err))
    .once("open", () => console.log("DATABASE connected successfully ✔✔✔"))


