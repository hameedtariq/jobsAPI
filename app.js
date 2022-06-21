require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const connectDB = require('./db/connect')

// basic security
const rateLimitter = require('express-rate-limit')
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')




// routers
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')
const authenticationUser = require('./middleware/authentication')
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
// extra packages

app.set('trust proxy',1)
app.use(rateLimitter({
  windowMs: 10 * 60 * 1000,
  max:100,
}))

app.use(helmet())
app.use(xss())
app.use(cors())

// routes

app.use('/api/v1/auth',authRouter)
app.use('/api/v1/jobs',authenticationUser,jobsRouter)
app.get('/', (req, res) => {
  res.send('jobs api');
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
