const express = require('express');
const bodyParser = require('body-parser');
const app = exports.module = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./'));

// const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
// const { IamAuthenticator } = require('ibm-watson/auth');

// const toneAnalyzer = new ToneAnalyzerV3({
//     authenticator: new IamAuthenticator({ apikey: 'qB92x6pn98MGaei5j9TLmUhdCjmmU5eITHzJMbS2gKFM' }),
//     version: '2016-05-19',
//     serviceUrl: 'https://gateway.watsonplatform.net/tone-analyzer/api/'
//     //https://api.us-south.tone-analyzer.watson.cloud.ibm.com/instances/5942acc2-d420-4bfc-96b0-5684b5ae65d1
// });

// app.post('/myaction', function(req, res) {
//     text1 = req.body.textArea;
//     toneAnalyzer.tone(
//         {
//             toneInput: text1,
//             contentType: 'text/plain'
//         })
//         .then(response => {
//             console.log(text1)
//             console.log(JSON.stringify(response.result, null, 2));
//             res.send(response.result);
//         })
//         .catch(err => {
//             console.log(err);
//         });
// })

app.listen(3000);

