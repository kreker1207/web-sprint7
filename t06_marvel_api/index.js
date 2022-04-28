async function func() {
    let url = 'https://gateway.marvel.com:443/v1/public/characters?apikey=366d13c242e7d58e1b048b5a8a52bd03'
    let response = await fetch(url);
    let res = await response.json()

    document.getElementById('code').innerText = res.code
    document.getElementById('status').innerText = res.status
    document.getElementById('copyright').innerText = res.copyright
    document.getElementById('attrText').innerText = res.attributionText
    document.getElementById('attrHTML').innerText = res.attributionHTML
    document.getElementById('etag').innerText = res.etag

    document.getElementById('offset').innerText = res.data.offset
    document.getElementById('limit').innerText = res.data.limit
    document.getElementById('total').innerText = res.data.total
    document.getElementById('count').innerText = res.data.count
}
window.onload = func



const express = require('express')
const expressThymeleaf = require('express-thymeleaf')
const {TemplateEngine} = require('thymeleaf')
const bodyParser = require('body-parser')
const request = require('request')
const PORT = process.env.PORT ?? 8080

const app = express()
const templateEngine = new TemplateEngine()
app.engine('html', expressThymeleaf(templateEngine))
app.set('view engine', 'html')
app.set('views', __dirname + '/')
app.use(bodyParser.urlencoded({extended: false}))

app.listen(PORT, () => {
console.log(`Server has been started on port ${PORT}...`)
})

app.get('/', async function(req, res) {
res.render('index', )
})