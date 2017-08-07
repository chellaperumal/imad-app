//Counter Code
var button = document.getElementById('counter');

button.onclick = function(){
 
    // Create Request
    var request = new XMLHttpRequest();
    
    //Store the request
    request.onreadystatechange = function(){
        if(request.readyState === XMLHttpRequest.DONE){
            if(request.status === 200){
                var counter = request.responseText;
                var span = document.getElementById('count');
                span.innerHTML = counter.toString(); 
    
            }
        }
        //If status not 200
    };
 //Make the request
 request.open('GET','http://pondychellam.imad.hasura-app.io/counter',true);
 request.send(null);
 };
 
 // Submit Name
 var nameInput = document.getElementById('name');
 var name = nameInput.value;
 var submit = document.getElementById('submit_btn');
 submit.onclick = function(){
     //Make Request
      var request = new XMLHttpRequest();
      
     //Store the request
    request.onreadystatechange = function(){
        if(request.readyState === XMLHttpRequest.DONE){
            if(request.status === 200){
                var names = request.responeText;
                names = JSON.parse(names);
                var list = '';
                 for (var i=0;i< names.length; i++){
                     list += '<li>'+ names[i] + '</li>';
                 }
 
     //Render list
     
     var ul = document.getElementById('namelist');
      ul.innerHTML = list;
            }
        } 
      //Not yet done
    };
     
     //Make the request

 request.open('GET','http://pondychellam.imad.hasura-app.io/submit-name?name'+ name,true);
 request.send(null);
 };
 