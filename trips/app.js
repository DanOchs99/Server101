// array to hold user objects
global.users = [];
// array to hold trip objects
global.trips = [];

// object with destinations and associated images
global.images = {};
images['Atlanta'] = 'http://www.100resilientcities.org/wp-content/uploads/2017/06/Atlanta.jpg'
images['Berkeley'] = 'http://www.100resilientcities.org/wp-content/uploads/2017/06/cities-berkeley_optimized.jpg';
images['Boston'] = 'http://www.100resilientcities.org/wp-content/uploads/2017/06/Boston-hero-crop.jpg';
images['Boulder'] = 'http://www.100resilientcities.org/wp-content/uploads/2017/06/cities-boulder_optimized.jpg';
images['Calgary'] = 'http://www.100resilientcities.org/wp-content/uploads/2017/06/Calgary.jpg';
images['Chicago'] = 'http://www.100resilientcities.org/wp-content/uploads/2017/06/Chicago-hero-crop.jpg';
images['Colima'] = 'http://www.100resilientcities.org/wp-content/uploads/2017/06/colima1.jpg';
images['Dallas'] = 'http://www.100resilientcities.org/wp-content/uploads/2017/06/Dallas-hero-crop.jpg';
images['El Paso'] = 'http://www.100resilientcities.org/wp-content/uploads/2017/06/iStock_000008529796Medium.jpg';
images['Miami'] = 'http://www.100resilientcities.org/wp-content/uploads/2017/06/Greater-Miami-2.jpg';
images['Guadalajara'] = 'http://www.100resilientcities.org/wp-content/uploads/2017/06/Guadalajara.jpg';
images['Honolulu'] = 'http://www.100resilientcities.org/wp-content/uploads/2017/06/Honolulu.jpg';
images['Houston'] = 'http://www.100resilientcities.org/wp-content/uploads/2019/08/Houston-skyline.jpg';
images['Juarez'] = 'http://www.100resilientcities.org/wp-content/uploads/2017/06/Ciudad-juarez-master-istock-hero-crop.jpg';
images['Los Angeles'] = 'http://www.100resilientcities.org/wp-content/uploads/2017/06/cities-la_optimized.jpg';
images['Louisville'] = 'http://www.100resilientcities.org/wp-content/uploads/2017/06/Louisville.jpg';
images['Mexico City'] = 'http://www.100resilientcities.org/wp-content/uploads/2017/06/cities-mexico_optimized.jpg';
images['Minneapolis'] = 'http://www.100resilientcities.org/wp-content/uploads/2017/06/Minneapolis.jpg';
images['Montreal'] = 'http://www.100resilientcities.org/wp-content/uploads/2017/06/montreal.jpg';
images['Nashville'] = 'http://www.100resilientcities.org/wp-content/uploads/2017/06/Nashville.jpg';
images['New Orleans'] = 'http://www.100resilientcities.org/wp-content/uploads/2017/06/iStock_000013159742Medium-BSD.jpg';
images['New York City'] = 'http://www.100resilientcities.org/wp-content/uploads/2017/06/cities-nyc_optimized.jpg';
images['Norfolk'] = 'http://www.100resilientcities.org/wp-content/uploads/2017/06/cities-norfolk_optimized.jpg';
images['Oakland'] = 'http://www.100resilientcities.org/wp-content/uploads/2017/06/cities-oakland_optimized.jpg';
images['Pittsburgh'] = 'http://www.100resilientcities.org/wp-content/uploads/2017/06/Pittsburgh-hero-crop.jpg';
images['San Francisco'] = 'http://www.100resilientcities.org/wp-content/uploads/2017/06/cities-sanfran_optimized.jpg';
images['Seattle'] = 'http://www.100resilientcities.org/wp-content/uploads/2017/06/Seattle.jpg';
images['St. Louis'] = 'http://www.100resilientcities.org/wp-content/uploads/2017/06/St-Louis-hero-cro.jpg';
images['Toronto'] = 'http://www.100resilientcities.org/wp-content/uploads/2017/06/toronto.jpg';
images['Tulsa'] = 'http://www.100resilientcities.org/wp-content/uploads/2017/06/Tulsa-hero-cro.jpg';
images['Vancouver'] = 'http://www.100resilientcities.org/wp-content/uploads/2017/06/Vancouver.jpg';
images['Washington, DC'] = 'http://www.100resilientcities.org/wp-content/uploads/2017/06/Washington-DC.jpg';

// an array of the available destinations
global.cities = Object.keys(images);

const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const mustacheExpress = require('mustache-express');

app.engine('mustache',mustacheExpress());
app.set('views','./views');
app.set('view engine','mustache');

const session = require('express-session');
app.use(session({
    secret: 'googlewhattouseforsessionsecretinfo',
    resave: false,
    saveUninitialized: true
}));

// middleware for user authentication
function authenticate(req,res,next) {
    if(req.session) {
        if(req.session.isAuthenticated) {
            next()
        } else {
            res.redirect('/')
        }
    } else {
        res.redirect('/')
    }
}

// use express.Routers for handle endpoints
const indexRouter = require('./routes/index')
const tripsRouter = require('./routes/trips')

app.use('/',indexRouter);
app.use('/trips',authenticate,tripsRouter);

// start the express server
app.listen(3000,() => {
    console.log("Server is running at localhost:3000...");
});