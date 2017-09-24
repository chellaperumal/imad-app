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
    secret: 'someRandomSecretValue',
    cookie: {maxAge: 1000*60*60*24*30}
}));


function createTemplate (data){
		var title = data.title;
		var date = data.date;
		var heading = data.heading;
		var content = data.content;
       
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
		        <hr/>
		        <h4>Comments</h4>
		        <div id="comment_form">
		        </div>
		        <div id="comments">
		        <center>Loading comments...</center>
		        </div>
		    </div>
		    <script type="text/javascript" src="/ui/article.js"></script>
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
            //res.setHeader('Content-Type', 'application/json');
           
            res.send(JSON.parse('{"message":"User successfully created"}') + username);
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
              
              // res.setHeader('Content-Type', 'application/json');
                res.status(403).send('Username or Password is invalid');
               //res.send(JSON.parse('{"message":"Username or Password is invalid"}'));
           
       } else{
           var dbString = result.rows[0].password;       
           var salt = dbString.split('$')[2];
           var hashedPassword = hash(password,salt);
           if(hashedPassword === dbString){
            
            req.session.auth = {userId: result.rows[0].id};   
          
            //res.setHeader('Content-Type', 'application/json');
            //res.send(JSON.parse('{"message":"Credentials are Correct"}'));
           res.send("Credentials are Correct");  
           }
           else 
           {
              res.status(403).send("Username or Password is invalid");
           }
        }
       }
    });
});


app.get('/check-login', function(req,res){
   
   if(req.session && req.session.auth && req.session.auth.userId){
       
       pool.query('SELECT * FROM "user" WHERE id = $1', [req.session.auth.userId], function (err,result) {
           if (err) {
               res.status(500).send(err.toString());
           }else{
               res.send(result.rows[0].username);
           }
          });
   }
   else{
       res.status(400).send('You are not logged in');
   }
      
});

app.get('/logout',function(req,res){
   delete req.session.auth;
    res.send('<html><body>Logged Out!<br/><br/><a href = "/">Back to Home</a></body></html>');
});

var pool = new Pool(config);

app.get('/get-articles', function (req,res){
   pool.query('SELECT * FROM article ORDER BY date DESC', function (err, result){
       if (err){
           res.status(500).send(err.toString());
       }else{
           res.send(JSON.Stringify(result.rows));
       }
   });
   
});

app.get('/get-comments/:articleName', function (req,res){
   pool.query('SELECT comment.*,"user".username FROM article, comment, "user" WHERE article.titlel = $1 AND article.id = comment.article_id AND comment.user_id = "user".id ORDER BY comment.timestamp DESC', [req.params.articleName],function (err,res){
      if(err){
          res.status(500).send(err.toString());
      }else{
          res.send(JSON.stringify(result.rows));
      }
         });
   
});


app.post('/submit-comment/:articleName',function (req,res){
   
   if(req.session && req.session.auth && req.session.auth.userId){
       pool.query('SELECT * FROM article WHERE title = $1', [req.params.articleName], function (err, result){
         if(err){
             res.status(500).send(err.toString());
         }  else{
             if(result.rows.length === 0){
                 res.status(400).send('Article Not found');
            }else{
                var articleId = result.rows[0].id;
                pool.query("INSERT INTO comment (comment,articleid, user_id') VALUES ($1,$2,$3)",[req.body.comment,articleId,req.session.auth.userId],function(err,result){
                    if(err){
                        res.status(500).send(err.toString());
                    }else{
                        res.status(200).send("Comment Inserted!")
                    }
                });
            }
         }
       });
   }
   else{
    res.status(403).send('Only logged in users can commnet');    
   }
   
   
});


app.get('/articles/:articleName', function (req, res) {
 //var articleName = req.params.articleName;
 pool.query("SELECT * FROM article WHERE title = $1", [req.params.articleName],function(err,result){
    if(err){
        
        res.status(500).send(err.toString());
    }
    else
    {
        if(result.rows.length===0){
            res.status(404).send('Article Not found');
        }else {
            var articleData = result.rows[0];
            res.send(crateTemplate(articleData));
        }
    }
    });
 });

app.get('/ui/:fileName', function (req,res){
    res.sendFile(path.join(__dirname, 'ui', req.params.fileName));
});




// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
