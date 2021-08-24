const express = require('express');
const path = require('path');
const handlebars = require('express-handlebars');
const app = express();
const route = require('./routes');
const methodOverride = require('method-override');
const db = require('./config/db');
const PORT = process.env.PORT || 3000;
const getBreadcrumbs = require('./app/middlewares/BreadCrumsCreate');
//create server socket
/* const server = require('http').createServer(app);
const io = require('socket.io')(server); */

db.connect();

//create static direct
app.use(express.static(path.join(__dirname, 'public')));


app.use(
    express.urlencoded({
        extended: true,
    }),
);
//convert req to json
app.use(express.json());
//use engine handlebars to create view
app.engine(
    'tam',
    handlebars({
        extname: '.tam',
        helpers: {
            convetDayOfWeek: (day) => {
                const DOW = [
                    "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"
                ];
                return DOW[day];
            },
            convetPartOfDay: (part) => {
                const POD = [
                    "Sáng",
                    "Chiều",
                    "Tối"
                ]
                return POD[part];
            },
            plusOne: function(index) {
                return index + 1;
            },
            sum: (a, b) => a + b,
            sortable: (field, sort) => {
                const sortType = field == sort.column ? sort.type : 'default';

                const classTypes = {
                    default: '',
                    asc: 'asc',
                    desc: 'desc',
                }
                const types = {
                    asc: 'desc',
                    desc: 'asc',
                    default: 'desc',
                }

                classType = classTypes[sortType];
                nextType = types[sortType];

                return `href="?_sort&column=${field}&type=${nextType}" class="${classType} ms-3"`;
            }
        },
    }),
);


app.set('view engine', 'tam');
app.set('views', path.join(__dirname, 'resourse', 'views'));

app.use(methodOverride('_method'));

app.use(getBreadcrumbs);


route(app);

/* io.on('connection', function(socket) {
    console.log('user log' + socket);
}); */
server.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});