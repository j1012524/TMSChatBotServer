var logger = require('morgan'),
  cors = require('cors'),
  http = require('http'),
  express = require('express'),
  errorhandler = require('errorhandler'),
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

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
  app.use(errorhandler())
}

var port = process.env.PORT || 3001;

app.post('/chats', (req, res) => {
  var todo = {
    text:req.body.text,
    clientAccessToken: req.body.clientAccessToken,
    sessionID: req.body.sessionID

  };

  var apiaiServer = apiai(todo.clientAccessToken);

  var request = apiaiServer.textRequest(todo.text, {
      sessionId: todo.sessionID
  });

  request.on('response', function(response) {
    console.log(response);
    var options_auth = { user: "MOBDRVR", password: "MOBDRVR" };
    var client = new restClient(options_auth);

    var args = {
        data: { test: "hello" },
        headers: { "Content-Type": "application/json" }
    };

    client.post("http://321dq72j.jda.corp.local:7010/base/rest/TRACKANDTRACE/ChatBot/1.0", args, function (data, response) {
        // parsed response body as js object
        console.log(data);
        // raw response
        console.log(response);
    });

    // // registering remote methods
    // client.registerMethod("postMethod", "http://321dq72j.jda.corp.local:7010/base/rest/TRACKANDTRACE/ChatBot/1.0", "POST");
    //
    // client.methods.postMethod(args, function (data, response) {
    //     // parsed response body as js object
    //     console.log(data);
    //     // raw response
    //     console.log(response);
    // });
  });

  request.on('error', function(error) {
      console.log(error);
  });

  request.end();

  res.send();

  // todo.save().then((doc) => {
  //   res.send(doc);
  // }, (e) => {
  //   res.status(400).send(e);
  // });
});

http.createServer(app).listen(port, function (err) {
  console.log('listening in http://localhost:' + port);
});
