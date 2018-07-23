const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser')

const generateFiles = require('./generateFiles');
const registerLogic = require('./registerLogic');

const k8sAPI = require('./k8sAPI');
let API = k8sAPI('192.168.42.22','8443');


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

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

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
    response.render('dashboard.hbs',{
        username: request.query.username
    });
})

app.get('/flot', (request, response) => {

    let namespace = appRegisterLogic.getNamepace(request.query.username);
    API.getAutoscalerInfo(namespace)
    .then((res) => {

        response.render('flot.hbs',{
            username: request.query.username,
            autoScalerInfo: JSON.stringify(res, undefined, 2)
        });
    })
    .catch((e)=> console.log(e))


})

app.get('/content', (request, response) => {
    response.render('content.hbs',{
        username: request.query.username
    });
})

app.get('/panels-wells', (request, response) => {
    response.render('panels-wells.hbs',{
        username: request.query.username
    });
})

app.get('/tables', (request, response) => {

    let namespace = appRegisterLogic.getNamepace(request.query.username);
    API.getContainerInfo(namespace)
    .then((res) => {

        response.render('tables.hbs',{
            username: request.query.username,
            containerInfo: JSON.stringify(res, undefined, 2)
        });

    })
    .catch((e)=> console.log(e))

})

app.get('/forms', (request, response) => {

    let namespace = appRegisterLogic.getNamepace(request.query.username);

    API.getServiceNames(namespace)
    .then((res) => {
      
        API.getUserIP(namespace)
        .then((res2) => {

            response.render('forms.hbs',{
                username: request.query.username,
                serviceInfo: JSON.stringify(res,undefined,2),
                userIPForWordpress: res2.userIPForWordpress,
                userIPForPhpmyadmin: res2.userIPForPhpmyadmin,
            });

        })
    })
    .catch((e)=> console.log(e))

})

app.post('/createnamespace',(request, response) => {
    console.log(request.body);

    let email = appRegisterLogic.getEmail(request.body.username);
    appRegisterLogic.addNamespace(email, request.body.domainName);


    // API.createNamespace(request.body.domainName)
    // .then((res) => {
    //     console.log(res);
        response.send({result:'Name space create successfully'});
    // })
    // .catch((e)=>{
    //     console.error(e);
    // })

})

//Route not available
app.use((request, response, next) => {
    response.render('notavailable.hbs');
})
