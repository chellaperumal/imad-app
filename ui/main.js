
function loadLoginForm(){
    var loginHtml = `
    <h3>Login / Register to unlock features</h3>
    <input type ="text" id="username" placeholder="Username"/>
    <input type ="passwrord" id="password"/>
    <br/><br>
    <input type = "submit" id = "login_btn" value = "Login"/>
    <input type = "submit" id = "register_btn" value = "Register"/>
    
    `;
    document.getElementById('login_area').innerHTML = loginHtml;
    
    var submit = documment.getElementById('login_btn');
    submit.onclick = function(){
        var request = new XMLHttpRequest();
        request.onreadstatechange = function(){
            if(request.readystate === XMLHttpRequest.DONE){
                if(request.status === 200){
                    submit.value = 'Success !';
                }else if(request.status === 403) {
                    submit.value = 'Invalid Credentials. Try again? ';
                }else if(reques.status === 500){
                    alert('Something went wrong on the server');
                    submit.value = 'Login';
                }else {
                    alert('Something went wrong on the server');
                    submit.value = 'Login';
                }
      loadLogin();          
    }
    //
};

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
            } else if (request.status === 403){
                alert('Username or Password is incorrect');
            } else if (request.status === 500){
                alert('Something went wrong in the server');
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
 request.setRequestHeader('Content-Type', 'application/json');
 request.send(JSON.stringify({username: username, password: password}));
 };
 
 
 