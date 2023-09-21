const express = require('express');
const app = express();
const userRoute = require('./routes/userRoute');
const voterReviewRoute = require('./routes/voteRoute');


app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// app.all("*", function (err) {
//     console.log(err);
// })

app.use("/vote-app/user", userRoute);
app.use("/vote-app", voterReviewRoute);


module.exports = app;