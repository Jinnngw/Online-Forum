window.addEventListener("load", ()=>{


  document.querySelector('.mainpagebox div').addEventListener('click', async function () {

    window.location.href = '/';   
 });

 document.querySelector('.personalbox div').addEventListener('click', async function () {

   window.location.href = '/myposts';   
 });

  document.getElementById('sort_timeNo').addEventListener('click', async function () {
    const result= await fetch('/api/sortTime');

    if(result.status==200)
    {
       window.location.href = '/'; }
  });


  document.getElementById('sort_likeNo').addEventListener('click', async function () {
    const result= await fetch('/api/sortLike');
    
    if(result.status==200)
    {
       window.location.href = '/'; }
      
  });

});