console.log('Loaded!');

var element = document.getElementById('main-text');
element.innerHTML = 'New value to be printed';

var img = document.getElementById('madi');
img.onClick = function(){
  img.style.marginleft = '100px';  
};