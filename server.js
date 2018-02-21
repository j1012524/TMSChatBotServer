//require('./config/config');

var logger = require('morgan'),
    cors = require('cors'),
    http = require('http'),
    express = require('express'),
    //errorhandler = require('errorhandler'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    apiai = require('apiai'),
    restClient = require('node-rest-client').Client,
    helmet = require('helmet');
//config = require('./config.json');

let app = express();
app.use(helmet());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// if (process.env.NODE_ENV === 'development') {
//   app.use(logger('dev'));
//   app.use(errorhandler())
// }

var port = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.send({
        success: 'handled well'
    });
});

app.post('/chats', cors(), (req, res) => {
    var todo = {
        text: req.body.text,
        clientAccessToken: req.body.clientAccessToken,
        sessionID: req.body.sessionID
    };

    var apiaiServer = apiai(todo.clientAccessToken);

    var request = apiaiServer.textRequest(todo.text, {
        sessionId: todo.sessionID
    });

    var client = new restClient();

    request.on('response', function(response) {
        //res.send({response});
        //  console.log(response);
        //  var options_auth = { user: "VENTURE", password: "VENTURE" };

        if (!response.result.actionIncomplete) {
            console.log("Action is complete");
            var args = {
                data: { botResponse: response },
                headers: { "Content-Type": "application/json" }
            };

            client.post("http://j1008026w7lt:7001/tm/rest/bot/user/token?user=VENTURE", args, function(data, response) {
                // parsed response body as js object
                console.log(data);
                let responseFromServer = {
                    result: { fulfillment: { speech: "From server" } }
                };
                res.send({ responseFromServer });
            });
        } else {
            res.send({ response });
        }
    });

    request.on('error', function(error) {
        console.log(error);
    });

    request.end();
});

http.createServer(app).listen(port, function(err) {
    console.log('listening in http://localhost:' + port);
});