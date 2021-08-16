const express = require('express');
const path = require('path');
const handlebars = require('express-handlebars');
const app = express();
const route = require('./src/routes');
const db = require('./src/config/db');

db.connect();

//create static direct
app.use(express.static(path.join(__dirname, 'src/public')));

app.use(
    express.urlencoded({
        extended: true,
    }),
);

app.use(express.json());

app.engine(
    'tam',
    handlebars({
        extname: '.tam',
        helpers: {
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
app.set('views', path.join(__dirname, 'src', 'resource', 'views'));

route(app);