const express = require('express');
require('dotenv').config();
const path = require('path');
const app = express();
const route = require('./routes');
const methodOverride = require('method-override');
const PORT = process.env.PORT || 3001;
const getBreadcrumbs = require('./app/middlewares/BreadCrumsCreate');
const passport = require('passport');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const autoCallClientWeb = require('./utils/autoCallClientWeb');
const corsMiddleware = require('./app/middlewares/cors');
const server = require('http').createServer(app);
const getUserInfo = require('./app/middlewares/getUserInfo');
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});
const connectIo = require('./config/socket/index');

app.use(express.static(path.join(__dirname, 'public')));
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());
app.use(methodOverride('_method'));
app.use(flash());
app.use(getBreadcrumbs);
app.use(corsMiddleware);
app.use(cookieParser());
app.use(getUserInfo);

route(app);

connectIo(io);

autoCallClientWeb.start();

server.listen(PORT, () => {
    console.log(`Our app is running on port ${PORT}`);
});