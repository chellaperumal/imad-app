
 // Submit username/password to login
 
 var submit = document.getElementById('submit_btn');
 submit.onclick = function(){
     //Make Request
      var request = new XMLHttpRequest();
      
     //Store the request
    request.onreadystatechange = function(){
        if(request.readyState === XMLHttpRequest.DONE){
            if(request.status === 200){
                console.log('user logged in');
                alert('Logged in Successfully');
            }
            else(request.status === 403){
                alert('Username or Password is incorrect');
            }
            else(request.status === 500){
                alert('Something went wrong on the server');
            }
        } 
      //Not yet done
    };
     
     //Make the request
 var username = document.getElementById('username').value;
 var password = document.getElementById('password').value;
 console.log(username);
 console.log(password);
 request.open('POST','http://pondychellam.imad.hasura-app.io/login',true);
 request.send(JSON.stringify({username: username, password: password}));
 };
 