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
     
     //Render list
     var names = ['name1','name2','name3','name4'];
     var list = '';
     for (var i=0;i<names.length;i++){
         list += '<li>'+ names[i] + '</li>';
     }
     var ul = document.getElementById('namelist');
     ul.innerHTML = list;
 };
 