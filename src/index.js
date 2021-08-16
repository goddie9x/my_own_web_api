const express = require('express');
const path = require('path');
const handlebars = require('express-handlebars');
const app = express();
const route = require('./routes');

const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://goddie9x:Mtamhm97@cluster0.hlbwa.mongodb.net/Cluster0?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});
//create static direct
app.use(express.static(path.join(__dirname, 'public')));

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
app.set('views', path.join(__dirname, 'resource', 'views'));