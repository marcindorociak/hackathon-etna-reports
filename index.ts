const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const cors = require('cors')
const app = express();
const morgan = require('morgan');
const webpack = require('webpack');
const webpackDevMid = require('webpack-dev-middleware'); //webpack hot reloading middleware
const webpackConfig = require('./webpack.config.js');
const compiler = webpack(webpackConfig);
const webpackHotMid = require("webpack-hot-middleware");
const etna = require('./etna/index.ts');

app.use(webpackDevMid(compiler, {
  noInfo: true,
  publicPath: '/',
  writeToDisk:true
}));
app.use(webpackHotMid(compiler));
// configure app
app.use(morgan('dev')); // log requests to the console
app.use(cors())
// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
app.listen(3000, function(){
  console.log('Server started');
});

app.get('/', function(req, res){
  res.render('home');
});

// create our router
var router = express.Router();
router.route('/cors_headers_hack').post(function(req, res) {
  var options = {
  uri: 'https://apidemo.sagex3.com/demo/service/X3CLOUDV2_SEED/graphql/',
  method: 'POST',
  json: req.body
};
  request(options, (error, response, body) => {
  if (error) {
    res.json(error);
    return
  }
  res.json(body);
})
});
//Print pdf
router.route('/generate-pdf').post(function(req, res) {
   //

   res.writeHead(200, {
       'Content-Type': 'application/pdf',
       'Access-Control-Allow-Origin': '*',
       'Content-Disposition': 'attachment; filename=Untitled.pdf'
   });
   async function wrapper() {
    let pdfResult = await etna.runTest(req.body);
    return pdfResult;
   }
   wrapper().then((pdfResult) => {
     pdfResult[0].pipe(res);
     pdfResult[0].end();
   });

});
// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);
