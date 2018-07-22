const express = require('express');
const fs = require('fs');
const generateFiles = require('./generateFiles');
const registerLogic = require('./registerLogic');

let app = express();
let appRegisterLogic = registerLogic();

//listening for connections
app.listen(3000, () => {
    console.log('server is runing...');
})

//serve handle bars views
app.set('view engine', 'hbs');

//serve static scripts and assets
app.use(express.static(__dirname + '/public'));

//save server log
app.use((request, response, next) => {
    let log = `Get a reqest ${new Date().getHours()}:${new Date().getMinutes()} ${new Date().getDay()}/${new Date().getMonth()}/${new Date().getFullYear()} ${request.method} ${request.url} ${request.body}`;
    console.log(log);

    let previous = fs.readFileSync('server-log.log');
    fs.writeFileSync('server-log.log', `${previous}\n${log}`);
    next();
})

//default Route
app.get('/', (request, response) => {
    response.render('index.hbs');
})

app.get('/signup', (request, response) => {
    if(request.query.email &&
       request.query.pass  &&
       request.query.username
      ){
        console.log(request.query);
        let userInfo = request.query;
        let result = appRegisterLogic.signup(userInfo.email, userInfo.pass, userInfo.username);
        if(result)
            response.render('dashboard.hbs',{
                username: request.query.username
            });
        else 
            response.render('signup.hbs');
    } else
            response.render('signup.hbs');
})

app.get('/login', (request, response) => {
    if(request.query.email &&
       request.query.pass 
     ){
        console.log(request.query);
        let userInfo = request.query;
        let result = appRegisterLogic.signin(userInfo.email, userInfo.pass);
        if(result)
            response.render('dashboard.hbs',{
                username: appRegisterLogic.getUsername(request.query.email)
            });
        else
            response.render('login.hbs');
    } else
    response.render('login.hbs');
})

app.get('/dashboard', (request, response) => {
    response.render('dashboard.hbs');
})

app.get('/flot', (request, response) => {
    response.render('flot.hbs');
})

app.get('/content', (request, response) => {
    response.render('content.hbs');
})

app.get('/panels-wells', (request, response) => {
    response.render('panels-wells.hbs');
})

app.get('/tables', (request, response) => {
    response.render('tables.hbs');
})

app.get('/forms', (request, response) => {
    response.render('tables.hbs');
})

//Route not available
app.use((request, response, next) => {
    response.render('notavailable.hbs');
})
