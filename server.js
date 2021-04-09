/*eslint-env node*/
(function() {
    'use strict';
	
    var express = require('express');
    var compression = require('compression');
    var url = require('url');
    var request = require('request');
    var fs = require('fs');
    var slash = require('slash');
    var xml2js = require('xml2js');
  	var bodyParser = require('body-parser');  
    var yargs = require('yargs').options({
        'port' : {
            'default' : 8484,
            'description' : 'Port to listen on.'
        },
        'public' : {
			'default':false,
            'type' : 'boolean',
            'description' : 'Run a public server that listens on all interfaces.'
        },
        'upstream-proxy' : {
            'description' : 'A standard proxy server that will be used to retrieve data.  Specify a URL including port, e.g. "http://proxy:8000".'
        },
        'bypass-upstream-proxy-hosts' : {
            'description' : 'A comma separated list of hosts that will bypass the specified upstream_proxy, e.g. "lanhost1,lanhost2"'
        },
        'help' : {
            'alias' : 'h',
            'type' : 'boolean',
            'description' : 'Show this help.'
        }
    });
    var argv = yargs.argv;

    if (argv.help) {
        return yargs.showHelp();
    }

    // eventually this mime type configuration will need to change
    // https://github.com/visionmedia/send/commit/d2cb54658ce65948b0ed6e5fb5de69d022bef941
    // *NOTE* Any changes you make here must be mirrored in web.config.
    var mime = express.static.mime;
    mime.define({
        'application/json' : ['czml', 'json', 'geojson', 'topojson'],
        'image/crn' : ['crn'],
        'image/ktx' : ['ktx'],
        'model/gltf+json' : ['gltf'],
        'model/gltf.binary' : ['bgltf', 'glb'],
        'text/plain' : ['glsl']
    });

    var app = express();
    app.use(compression());
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    app.use(express.static(__dirname));
	app.use( bodyParser.json() );       // to support JSON-encoded bodies
	app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	  extended: true
	})); 
    function getRemoteUrlFromParam(req) {
        var remoteUrl = req.params[0];
        if (remoteUrl) {
            // add http:// to the URL if no protocol is present
            if (!/^https?:\/\//.test(remoteUrl)) {
                remoteUrl = 'http://' + remoteUrl;
            }
            remoteUrl = url.parse(remoteUrl);
            // copy query string
            remoteUrl.search = url.parse(req.url).search;
        }
        return remoteUrl;
    }

    var dontProxyHeaderRegex = /^(?:Host|Proxy-Connection|Connection|Keep-Alive|Transfer-Encoding|TE|Trailer|Proxy-Authorization|Proxy-Authenticate|Upgrade)$/i;

    function filterHeaders(req, headers) {
        var result = {};
        // filter out headers that are listed in the regex above
        Object.keys(headers).forEach(function(name) {
            if (!dontProxyHeaderRegex.test(name)) {
                result[name] = headers[name];
            }
        });
        return result;
    }

    var upstreamProxy = argv['upstream-proxy'];
    var bypassUpstreamProxyHosts = {};
    if (argv['bypass-upstream-proxy-hosts']) {
        argv['bypass-upstream-proxy-hosts'].split(',').forEach(function(host) {
            bypassUpstreamProxyHosts[host.toLowerCase()] = true;
        });
    }

    app.get('/proxy/*', function(req, res, next) {
        // look for request like http://localhost:8080/proxy/http://example.com/file?query=1
        var remoteUrl = getRemoteUrlFromParam(req);
        if (!remoteUrl) {
            // look for request like http://localhost:8080/proxy/?http%3A%2F%2Fexample.com%2Ffile%3Fquery%3D1
            remoteUrl = Object.keys(req.query)[0];
            if (remoteUrl) {
                remoteUrl = url.parse(remoteUrl);
            }
        }

        if (!remoteUrl) {
            return res.status(400).send('No url specified.');
        }

        if (!remoteUrl.protocol) {
            remoteUrl.protocol = 'http:';
        }

        var proxy;
        if (upstreamProxy && !(remoteUrl.host in bypassUpstreamProxyHosts)) {
            proxy = upstreamProxy;
        }

        // encoding : null means "body" passed to the callback will be raw bytes

        request.get({
            url : url.format(remoteUrl),
            headers : filterHeaders(req, req.headers),
            encoding : null,
            proxy : proxy
        }, function(error, response, body) {
            var code = 500;

            if (response) {
                code = response.statusCode;
                res.header(filterHeaders(req, response.headers));
            }

            res.status(code).send(body);
        });
    });

    var server = app.listen(argv.port, argv.public ? "192.168.1.144" : 'localhost', function() {
        if (argv.public) {
            console.log('Bank Server');
        } else {
            console.log('Bank Server', server.address().port);
        }
    });

    server.on('error', function (e) {
        if (e.code === 'EADDRINUSE') {
         //   console.log('Error: Port %d is already in use, select a different port.', argv.port);
          //  console.log('Example: node server.js --port %d', argv.port + 1);
        } else if (e.code === 'EACCES') {
         //   console.log('Error: This process does not have permission to listen on port %d.', argv.port);
            if (argv.port < 1024) {
              //  console.log('Try a port number higher than 1024.');
            }
        }
       // console.log(e);
        process.exit(1);
    });

    server.on('close', function() {
		console.log('Bank server stopped.');
    });

    /* DB Connection */
    var mysql      = require('mysql');
    var connection = mysql.createConnection({
    host     : 'localhost',
    port     : 3306,
    user     : 'root',
    password : '',
    database : 'bankmanager'
    });

    connection.connect(function(err) {
    if (err) {
        return console.error('error: ' + err.message);
    }
    console.log('Connected to the Bank Manager Server.');

    });


    /* GET accounts */
    app.post('/api/get-accounts', function(req, res, next) {
    console.log("requests")
    console.log(req.body)
    var user_id = req.body.user_id;
  
   // console.log(req.body);
     connection.query('SELECT * FROM account WHERE id IN (SELECT account_id FROM user_account WHERE user_account.user_id = ?)', [user_id], function(error, results, fields) {
        if (results.length > 0) {
          console.log(results[0].userid);
          var account_id = String(results[0].id);
          var account_type = String(results[0].status);
          res.send(results);
        } else {
          res.send(false);
        }
      });
  
  });
  
  /* Check Account Exists */
  app.post('/api/check-account', function(req, res, next) {
  
    var account_id = req.body.account_id;
  
   // console.log(req.body);
     connection.query('SELECT STATUS FROM account WHERE id = ?', [account_id], function(error, results, fields) {
        if (results.length > 0) {
          console.log(results[0].userid);
          res.send(results);
        } else {
          res.send(false);
        }
      });
  
  });
  
  
  /* Check Balance */
  app.post('/api/check-balance', function(req, res, next) {
  
    var user_id = req.body.user_id;
  
   // console.log(req.body);
     connection.query('SELECT amount FROM `account` WHERE id = ?', [user_id], function(error, results, fields) {
        if (results.length > 0) {
          console.log(results[0].userid);
          res.send(results);
        } else {
          res.send(false);
        }
      });
  
  });
  
  /* Transfer Amount */
  app.post('/api/transfer', function(req, res, next) {
  
    var account_id = req.body.account_id;
    var amount = req.body.amount;
  
   // console.log(req.body);
     connection.query('UPDATE account SET amount = amount + ? WHERE id = ?', [amount, account_id], function(error, results, fields) {
        if (results.length > 0) {
          console.log(results[0].userid);
          res.send(results);
        } else {
          res.send(false);
        }
      });
  
  });

    /* Get Username */
    app.post('/api/get-username', function(req, res, next) {
  
      var user_id = req.body.user_id;
    
     // console.log(req.body);
       connection.query('SELECT name FROM `user` WHERE id = ?', [user_id], function(error, results, fields) {
          if (results.length > 0) {
            console.log(results[0].userid);
            res.send(results);
          } else {
            res.send(false);
          }
        });
    
    });
    app.get('/transfer', function(req, res, next) {
      // res.send('respond with a resource');
       res.render('transfer.html', { title: 'Sample' });
    s});
     

})();
