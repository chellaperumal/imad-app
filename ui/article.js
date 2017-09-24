
var currentArticleTitle = window.location.pathname.split('/')[2];

function loadCommentForm(){
    
    var commentFomrHtml = `
    <h5> Summit a Comment</h5>
    <textarea id = "comment_text" rows="5" cols="100" placeholder="Enter your comment here..."><textarea>
    <br/>
    <input type ="submit" id="submit" value="Submit"/>
    <br/>
    `;
    document.getElementById('comment_form').innerHTML = commentFormHtml;
    
    
        // Submit username/password to login
    var submit = document.getElementById('submit');
    submit.onclick = function () {
         // Create a request object
        var request = new XMLHttpRequest();
        
          // Capture the response and store it in a variable
        request.onreadystatechange === function () {
        if(request.readystate === XMLHttpRequest.DONE) {
             // Take some action
            if(request.status === 200){
                 // clear the form & reload all the comments
                document.getElementById('comment_text').value = '';
                loadcomments();
            }else{
                alert('Error! could not submit comment');
            }
            submit.value = 'Submit';
        }
    };
    
     // Make the request
    var commnet = document.getElementById('comment_text').value;
    request.open('POST','/submit-comment/' + currentArticleTitle, true);
    request.setRequestHeader('Content-Type', 'application/JSON');
    request.send(JSON.stringify({comment:comment}));
    submit.value = 'Submitting....';
    
    };
}


function loadLogin(){
   var request = new XMLHttpRequest();
    request.onreadystate === function(){
        if(request.readystate === XMLHttpRequest.DONE){
             if(request.status === 200){
                 loadCommentForm(this.responseText);
                 
        }
    }
};
request.open('GET', '/check-login',true);
request.send(null);
}

function escapeHTML (text){
    
    var $text = document.createTextNode(text);
    var $div = document.createElement('div');
    $div.appendChild($text);
    return $div.innerHTML;
    
}

function loadComments () {
     var request = new XMLHttpRequest();
        request.onreadystatechange === function () {
        if(request.readystate === XMLHttpRequest.DONE) {
            var comments = document.getElementById('comments');
            if(request.status === 200){
                var content = '';
                var commentsData = JSON.parse(this.responseText);
                for (var i=0; i< commentsData.length; i++){
                    var time = new Date(commentsData[i].timestamp);
                    content += `<div class = "comment">
                    <p>${escapeHTML(commentsData[i].comment)}</p>
                    <div class = "commentor">
                    ${commentsData[i].username} - ${time.toLocaleTimeString()} on ${time.toLocaleDateString()}
                    </div>
                    </div>`;
                }
            comments.innerHTML = content;
}else{
    comments.innerHTML('Oops! could not load comments');
    
}
}
};
request.open('GET', '/get-comments' + currentArticleTitle,true);
reques.send(null);
}


loadLogin();
loadComments();
