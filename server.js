var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

var config = {
    user: 'pondychellam',
    database: 'pondychellam',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password:  process.env.DB_PASSWORD
    
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'soemRandomSecretValue',
    cookie: {maxAge: 1000*60*60*24*30}
}));


function crateTemplate (data){
		var title = data.title;
		var date = data.date;
		var heading = data.heading;
		var content = data.content;
        var comment = data.comment;
        
		var htmlTemplate = `
		<html>
		    <head>
		        <title>
		        ${title}      
		        </title>
		      <meta name="viewport" content="width-device-width,initial-scale=1"/>

		     <link href="/ui/style.css" rel="stylesheet" />
		    
		        </head>
		    <body>
		        		        
		        <div class="container">
		            <div>
		                <a href="/">Home</a>
		            </div>
		        <hr>
		        <h3>
		            ${heading}
		        </h3>
		        <div>
		            ${date.toDateString()}
		        </div>
		        <div>
		        
		        ${content}
		        </div>
		        
		        <div>
		        <h6>Please add your feedback in the below box</h6>
		        <textarea rows="5" cols="75" type="text name="cmnt" id="cmnt"></textarea>
		        <br>
		        <input type="submit" id="sub_cmt"/>
		        <ul id="cmntlist">
		        </div>
		        
		    </div>
		    </body>
		</html>
`;
	return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function hash(input, salt){
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2","10000",salt,hashed.toString('hex')].join('$');
        
}

app.get('/hash/:input',function(req,res){
   var hashedString = hash(req.params.input, 'this-is-some-randome-string');
   res.send(hashedString);
    
});

app.post('/create-user',function(req,res){
   var username = req.body.username;
   var password = req.body.password;
   
   var salt = crypto.randomBytes(128).toString('hex');
   var dbString = hash(password,salt);
    pool.query('INSERT INTO "user" (username,password) VALUES ($1,$2)',[username,dbString], function(err,result){
     if(err){
           res.status(500).send(err.toString());
       } else{
           res.send('User Succesfully created: ' + username);
       }   
    });
});


app.post('/login',function(req,res){
   var username = req.body.username;
   var password = req.body.password;
    
     pool.query('SELECT * FROM "user" WHERE username =$1',[username], function(err,result){
     if(err){
           res.status(500).send(err.toString());
       } else{
           if(result.rows.length === 0){
               res.send(403).send('Username or Password is invalid');
       } else{
           var dbString = result.rows[0].password;       
           var salt = dbString.split('$')[2];
           var hashedPassword = hash(password,salt);
           if(hashedPassword === dbString){
            
            req.session.auth = {userId: result.rows[0].id};   
            
            res.send('User Credentials are Correct');
           }else {
              res.send(403).send('Username or Password is invalid');
           }
        }
       }
    });
});


app.get('/check-login', function(req,res){
   
   if(req.session && req.session.auth && req.session.auth.userId){
       res.send('You are logged in :' + req.session.auth.userId.toString());
   }else{
       res.send('You are not logged in');
   }
});

app.get('/Logout',function(req,res){
   delete req.session.auth;
    res.send('You are successfully logged out');
});

var pool = new Pool(config);
app.get('/test-db',function(req,res){
    pool.query('SELECT * FROM test',function(err,result){
       if(err){
           res.status(500).send(err.toString());
       } else{
           res.send(JSON.stringify(result.rows));
       }
    });
});

var counter = 0;
app.get('/counter',function(req,res){
   counter = counter + 1;
   res.send(counter.toString());
});

var names = [];
app.get('/submit-name', function(req,res){
   var name = req.query.name;
   names.push(name);
    res.send(JSON.stringify(names));
});


app.get('/articles/:articleName', function (req, res) {
// var articleName = req.params.articleName;
 pool.query("SELECT * FROM article WHERE title = $1", [req.params.articleName],function(err,result){
    if(err){
        res.status(500).send(err.toString());
    }else{
        if(result.rows.length===0){
            res.status(404).send('Article Not found');
        }else{
            var articleData = result.rows[0];
            res.send(crateTemplate(articleData));
        }
    }
 });
 });


var subcmt = document.getElementById('sub_cmt');
 subcmt.onclick = function(){
     //Make Request
      var request = new XMLHttpRequest();
      
     //Store the request
    request.onreadystatechange = function(){
        if(request.readyState === XMLHttpRequest.DONE){
            if(request.status === 200){
                var cmts = request.responseText;
                cmts = JSON.parse(cmts);
                var cmtary = '';
                 for (var i=0;i< cmts.length; i++){
                     cmtary += '<li>'+ cmts[i] + '</li>';
                 }
 
     //Render list
     
     var ul = document.getElementById('cmntlist');
      ul.innerHTML = cmtary;
            }
        } 
      //Not yet done
    };
     
     //Make the request
 var cmtInput = document.getElementById('cmnt');
 var cmnt = cmtInput.value;
 request.open('GET','http://pondychellam.imad.hasura-app.io/articles/:articleName?cmnt='+ cmnt,true);
 request.send(null);
 };


app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname,'ui','style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname,'ui','main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
