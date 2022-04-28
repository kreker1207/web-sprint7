const change = require('./changeStr');
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
    if (app.get('done') === true) {
        res.end(`
        <h1>Charset</h1>
        <form action="/" method="POST">
        Change charset: <input type="text" name="string" placeholder="Input string"><br><br>
        Select charset or several charset: <select name="select" id="select" multiple="multiple">
            <option value="utf8">UTF-8</option>
            <option value="iso">ISO-8859-1</option>
            <option value="windows">Windows-1252</option>
        </select>
        <button id="change">Change charset</button>
        <button>Clear</button><br>
        <br><br>
        Input string: <input type="text" name="changedStr" placeholder="${app.get('string')}"><br>
        UTF-8 <input type="text" name="utf-8" placeholder="${app.get('utf')}"><br>
        ISO-8859-1 <input type="text" name="iso" placeholder="${app.get('iso')}"><br>
        Windows-1252 <input type="text" name="windows" placeholder="${app.get('windows')}"><br>
        </form>
        `);
    }
    else
        res.sendFile(path.join(__dirname + '/index.html'));
})
router.post('/', (req, res) => {
    sess = req.session;
    sess.string = req.body.string;
    sess.select = req.body.select;
    sess.iso = "$ and $ are a currency";
    sess.utf = "$ and $ are a currency";
    sess.windows = "$ and $ are a currency";
    
    for (let i = 0; sess.select[i]; i++) {
        if (sess.select[i] === 'utf8') {
            app.set('done', true);
            sess.utf = change.changeStrUTF(sess.string);
        }  
        if (sess.select[i] === 'iso') {
            app.set('done', true);
            sess.iso = change.changeStrISO(sess.string);
        }    
        if (sess.select[i] === 'windows') {
            app.set('done', true);
            sess.windows = change.changeStrWindows(sess.string);
        }
    }
    
    app.set('utf', sess.utf);
    app.set('iso', sess.iso);
    app.set('windows', sess.windows);
    app.set('string', sess.string);
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

app.listen(3000);
console.log("Running at port 3000");