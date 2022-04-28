const hash = require('./hash');
const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const router = express.Router();
app.use(session({secret: 'shhhhhhh', saveUninitialized: true, resave: true}));
app.use(bodyParser.urlencoded({extended: true}));
var sess;

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
    sess = req.session;
    let hacked = app.get('hacked');

    if (hacked) {
        app.set('hacked', false);
        res.end(`
        <h1>Password</h1>
        <form action="/guess" method="POST">
            <p style="color:green">Hacked!!</p><br><br>
            <p>Password not saved at session</p>
            <input type="password" name="password" id="password" placeholder="Password to session">
            <input type="text" name="salt" id="salt" placeholder="Salt to session">
            <button type="submit">Save</button>
        </form> 
        `);
        res.redirect('/clear');
    }
    else if (sess.password) {
        res.end(`
        <h1>Password</h1>
        <form action="/guess" method="POST">
            <p>Password saved at session</p>
            <p>Hash is ${sess.hash}</p>
            Try to guess
            <input type="password" name="password_" id="password_" placeholder="Password to session">
            <button type="submit">Check password</button>
            <button type="submit" method="GET">Clear</button>
        </form>
        `);
    }
    else {
        res.sendFile(path.join(__dirname + '/index.html'));
    }  
})
router.post('/', (req, res) => {
    sess = req.session;
    sess.password = req.body.password;
    sess.salt = req.body.salt;
    sess.hash = hash(sess.password, sess.salt).passwordHash;
    app.set('data', sess.password);
    res.redirect('/');
})
router.post('/guess', (req, res) => {
    sess = req.session;
    let guess = app.get('data');
    if (guess === sess.password) {
        app.set('hacked', true);
    }
    res.redirect('/');    
})
router.get('/clear', (req, res) => {
    req.session.destroy((err) => {
        if (err)
            return console.log(err);
        res.redirect('/');
    })
})
app.use('/', router);

app.listen(8800);
console.log("Running at port 8800");