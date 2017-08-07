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