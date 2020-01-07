const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
const bcrypt = require('bcrypt')
const models = require('./models')
const session = require('express-session');

const PORT = 3000
const SALT_ROUNDS = 12

// configure view engine
app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')

// configure body parser
app.use(express.urlencoded({extended: false}))

// configure user sessions
app.use(session({
    secret: '2Zo8raCxsyTbgcD06VkubtRwSj1zWXVVYDNkhz4AlxSRQEhsxYmxms49v2KA',
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

// root route goes to login page
app.get('/',(req,res) => {
  res.render('login')
})

app.post('/',(req,res) => {
    //verify username exists
    models.User.findOne({where: {username: req.body.username}})
    .then((user) => {
        if(user) {
            bcrypt.compare(req.body.password, user.password)
            .then((samePassword) => {
                if(!samePassword) {
                    // bad password
                    req.session.destroy()
                    res.render('login',{message: 'Invalid username / password.'})
                }
                else {
                    // good password
                    req.session.isAuthenticated = true
                    req.session.username = user.username
                    req.session.user_id = user.id
                    res.redirect('/posts/all')
                }
            })
            .catch((error) => {
                // authentication error
                req.session.destroy()
                res.redirect('/')
            })
        }
        else {
            res.render('login',{message: 'Invalid username / password.'})
        }
    })
    .catch((error) => {
        console.log(error)
        req.session.destroy()
        res.render('login',{message: "Error validating username."})
    })
})

app.get('/logout',(req,res) => {
    req.session.destroy()
    res.redirect('/')
})

// register user route
app.get('/register',(req,res) => {
    res.render('register')
})

app.post('/register',(req,res) => {
    // check to see if user exists
    models.User.findOne({where: {username: req.body.username}})
    .then((user) => {
        if(user) {
            res.render('register',{message: "User name already exists!"})
        }
        else {
            bcrypt.hash(req.body.password,SALT_ROUNDS)
            .then((hashedPassword) => {
                let new_user = models.User.build({username: req.body.username, password: hashedPassword})
                new_user.save().then((savedUser) => res.redirect('/'))
            })
            .catch((error) => {
                console.log(error)
                req.session.destroy()
                res.render('register',{message: "Error creating user."})
            })
        }
    })
    .catch((error) => {
        console.log(error)
        req.session.destroy()
        res.render('register',{message: "Error creating user."})
    })
})

// main view route - /posts/all shows all the posts
app.get('/posts/:cat', authenticate, (req,res) => {
    // get the list of categories for dropdown based on all the published posts
    models.Post.findAll({where: {isPublished: true}})
        .then((posts) => {
            let cat_names = []
            for (let i=0; i<posts.length; i++) {
                if (!cat_names.includes(posts[i].dataValues.category)) {
                    cat_names.push(posts[i].dataValues.category)
                }
            }
            let categories = []
            for (let i=0; i<cat_names.length; i++) {
                categories.push({cat: cat_names[i]})
            }
            // get the list of posts
            if (req.params.cat == 'all') {
                models.Post.findAll({include: [{model: models.User, as: 'user'}], where: {isPublished: true}, order: ['id']})
                .then(posts => {
                    res.render('posts',{username: req.session.username, categories: categories, posts: posts})
                })
                .catch((error) => {
                    console.log(error)
                    res.redirect('/posts/all')              
                })
            }
            else {
                models.Post.findAll({include: [{model: models.User, as: 'user'}], where: {category: req.params.cat, isPublished: true}, order: ['id']})
                .then(posts => {
                    res.render('posts',{username: req.session.username, categories: categories, posts: posts})
                })
                .catch((error) => {
                    console.log(error)
                    res.redirect('/posts/all')              
                })
            }
        })
        .catch((error) => {
            console.log(error)
            res.redirect('/posts/all')              
        })
})

app.get('/manage', authenticate, (req,res) => {
    models.Post.findAll({where: {user_id: req.session.user_id}}, {order: 'id'})
    .then(posts => {
        res.render('manage',{username: req.session.username, categories: [{cat: 'Python'},{cat: 'SQL'}], posts: posts})
    })
})

app.post('/manage', authenticate, (req,res) => {
    models.Post.findOne({where: {title: req.body.title, category: req.body.category, user_id: req.session.user_id}})
    .then((post) => {
        if(post) {
            // found matching post - this is an update
            models.Post.update({body: req.body.body, isPublished: false}, {where: {id: post.dataValues.id}})
            .then(() => res.redirect('/manage'))
            .catch((error) => {
                console.log(error)
                res.redirect('/manage')
            })
        }
        else {
            // need to create new post and save it
            let post = models.Post.build({title: req.body.title, body: req.body.body, category: req.body.category, isPublished: false, user_id: req.session.user_id })
            post.save().then(() => {
                res.redirect('/manage')
            })
            .catch((error) => {
                console.log(error)
                res.redirect('/manage')
            })
        }
    })
    .catch((error) => {
        console.log(error)
        res.redirect('/manage')
    })
})

app.post('/delete', authenticate, (req,res) => {
    models.Post.destroy({where: {id: req.body.del_post_id}})
    .then(() => res.redirect('/manage'))
    .catch((error) => {
        console.log(error)
        res.redirect('/manage')
    })
})

app.post('/publish', authenticate, (req,res) => {
    models.Post.update({isPublished: true}, {where: {id: req.body.pub_post_id}})
    .then(() => res.redirect('/manage'))
    .catch((error) => {
        console.log(error)
        res.redirect('/manage')
    })
})

app.listen(PORT,() => {
    console.log(`Server is running on localhost:${PORT}`)
})
