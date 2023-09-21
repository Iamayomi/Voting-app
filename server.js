const app = require('./app');
const connectDB = require('./config/db');

const port = process.env.PORT || 3000;

connectDB;

app.listen(port, () => {
    console.log(`App running on port ${port}...`)
});

