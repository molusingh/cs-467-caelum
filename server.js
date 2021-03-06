/*
 * Author: Anmolbir Mann
/*
 * Import neccessary modules
 */
var express = require('express');

/*
 * Set up App
 */
var app = express();
app.use(express.static('public'));
const port = process.env.PORT || 8080;
app.set('port', port);


/*
 * Home page handler
 */
app.get('/', function(req, res)
{
    res.sendfile('index.html');
});

/*
 * Not found handler
 */
app.use(function(req, res)
{
    res.status(404);
    res.send('404 Error');
});

/*
 * Error handler
 */
app.use(function(err, req, res, next)
{
    console.error(err.stack);
    res.status(500);
    res.send('500 Error');
});

/*
 * Run using command: node [filename] [port number]
 */
app.listen(app.get('port'), function()
{
    console.log('Express started on http://localhost:' + port);
});
