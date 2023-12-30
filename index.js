const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');

require('dotenv').config();

const routeClient = require('./routes/client/index.route');
const routeAdmin = require('./routes/admin/index.route');
const database = require('./config/database');
const systemConfig = require('./config/system');
const app = express();
const port = process.env.PORT;

database.connect();

app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');
app.use(express.static(`${__dirname}/public`));

// TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// flash 
app.use(cookieParser('keyrandom'));
app.use(session({cookie: {maxAge: 60000}}));
app.use(flash());

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// variables 
app.locals.prefixAdmin = systemConfig.PREFIX_ADMIN;

// Routes
routeClient(app);
routeAdmin(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})