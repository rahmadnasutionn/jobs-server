require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const jobsRoutes = require('./routes/jobs');

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

const authenticateUser = require('./middleware/authentication');
const connectDB = require('./db/connect');

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
}));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(xss());

app.get('/', (req, res) => {
    res.send('jobs api');
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/jobs', authenticateUser, jobsRoutes);

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const PORT = process.env.PORT || 3000;

const start = async() => {
    try {
        await connectDB(process.env.URL_MONGODB_DEV);
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}...`)
        });
    } catch (error) {
        console.log(error);
    }
};

start();