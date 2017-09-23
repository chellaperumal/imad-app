
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
 
 
 var submit = document.getElementById('sub_cmt');
 submit.onclick = function(){
     //Make Request
      var request = new XMLHttpRequest();
      
     //Store the request
    request.onreadystatechange = function(){
        if(request.readyState === XMLHttpRequest.DONE){
            if(request.status === 200){
                var cmts = ['comment1','comment2','comment3'];
                cmts = JSON.parse(cmts);
                var cmtary = [];
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
 request.send();
 };