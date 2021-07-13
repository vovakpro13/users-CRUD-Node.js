const express = require('express');
const fileUpload = require('express-fileupload');

const { config: { PORT } } = require('./constants');
const { userRouter, authRouter } = require('./routes');
const { ErrorHandler } = require('./errors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.use('/users', userRouter);
app.use('/auth', authRouter);

app.use('/*', ErrorHandler.throwRouteNotFound);
app.use(ErrorHandler.handleErrors);

app.listen(PORT, () => console.log(`Server started on port: ${ PORT }`));