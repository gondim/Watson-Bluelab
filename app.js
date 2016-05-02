/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var express     = require('express'),
  app           = express(),
  server        = require('http').createServer(app),
  io            = require('socket.io').listen(server),
  fs            = require('fs'),
  path          = require('path'),
  vcapServices  = require('vcap_services'),
  bluemix       = require('./config/bluemix'),
  extend        = require('util')._extend,
  watson        = require('watson-developer-cloud'),
  UAparser      = require('ua-parser-js'),
  userAgentParser = new UAparser();

// Bootstrap application settings
require('./config/express')(app);

var credentialsDialog =  extend({
  url: 'https://gateway.watsonplatform.net/dialog/api',
  username: '8e81235a-a093-4212-8ea4-9f63be724865',
  password: 'sUCRjbgnw0r6',
  version: 'v1'
}, bluemix.getServiceCreds('dialog')); // VCAP_SERVICES

/*var credentialsSpeechToText = extend({
  version: 'v1',
  url: 'https://stream.watsonplatform.net/speech-to-text/api/hu3',
  username: process.env.STT_USERNAME || '8b9cda7d-18e1-46a8-8129-988391d59a77',
  password: process.env.STT_PASSWORD || '8es9PgTTLMqH'
}, vcapServices.getCredentials('speech_to_text'));*/

var config = extend({
  version: 'v1',
  url: 'https://stream.watsonplatform.net/speech-to-text/api',
  username: process.env.STT_USERNAME || '8b9cda7d-18e1-46a8-8129-988391d59a77',
  password: process.env.STT_PASSWORD || '8es9PgTTLMqH'
}, vcapServices.getCredentials('speech_to_text'));

var authService = watson.authorization(config);

var nlClassifier = watson.natural_language_classifier({
  url : 'https://gateway.watsonplatform.net/natural-language-classifier/api',
  username : 'cbc2ebc2-725b-41c0-9eb7-dbee827a4678',
  password : 'RDgNu0y0khxg',
  version  : 'v1'

});

//bucho
app.post('/api/classify', function(req, res, next) {
  var params = {
    classifier: process.env.CLASSIFIER_ID || '3a84dfx64-nlc-2068', // pre-trained classifier
    text: req.body.text
  };

  nlClassifier.classify(params, function(err, results) {
    if (err)
      return next(err);
    else
      res.json(results);
  });
});



app.get('/', function(req, res) {
  res.render('index', {
    ct: req._csrfToken,
    GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID
  });
});

var dialog_id_in_json = (function() {
  try {
    var dialogsFile = path.join(path.dirname(__filename), 'dialogs', 'dialog-id.json');
    var obj = JSON.parse(fs.readFileSync(dialogsFile));
    return obj[Object.keys(obj)[0]].id;
  } catch (e) {
  }
})();

var dialog_id = process.env.DIALOG_ID || dialog_id_in_json || '<missing-dialog-id>';

// Create the service wrapper
var dialog = watson.dialog(credentialsDialog);

app.post('/conversation', function(req, res, next) {
  var params = extend({ dialog_id: dialog_id }, req.body);
  dialog.conversation(params, function(err, results) {
    if (err)
      return next(err);
    else
      res.json({ dialog_id: dialog_id, conversation: results});
  });
});

app.post('/profile', function(req, res, next) {
  var params = extend({ dialog_id: dialog_id }, req.body);
  dialog.getProfile(params, function(err, results) {
    if (err)
      return next(err);
    else
      res.json(results);
  });
});


// Handle audio stream processing for speech recognition
/*app.post('/', function(req, res) {
    var audio;
 
    if(req.body.url && req.body.url.indexOf('audio/') === 0) {
        // sample audio stream
        audio = fs.createReadStream(__dirname + '/../public/' + req.body.url);
    } else {
        // malformed url
        return res.status(500).json({ error: 'Malformed URL' });
    }
 
    // use Watson to generate a text transcript from the audio stream
    speech_to_text.recognize({audio: audio, content_type: 'audio/l16; rate=44100'}, function(err, transcript) {
        if (err)
            return res.status(500).json({ error: err });
        else
            return res.json(transcript);
    });
});*/

// Get token using your credentials
app.post('/api/token', function(req, res, next) {
  authService.getToken({url: config.url}, function(err, token) {
    if (err)
      next(err);
    else
      res.send(token);
  });
});


// error-handler settings
require('./config/error-handler')(app);
module.exports = app;

//uma tentativa aqui
var port = (process.env.VCAP_APP_PORT || 3000);
server.listen(port);
console.log('listening at:', port);