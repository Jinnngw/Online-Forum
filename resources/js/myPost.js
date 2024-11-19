window.addEventListener("load", ()=>{

    document.querySelector('.mainpagebox div').addEventListener('click', async function () {

       window.location.href = '/';   
    });

    document.querySelector('.personalbox div').addEventListener('click', async function () {
  
      window.location.href = '/myposts';   
    });


    document.getElementById('sort_mytime').addEventListener('click', async function () {
      const result= await fetch('/api/sortmyTime');

      if(result.status==200)
      { window.location.href = '/myposts'; }

    });
  

    document.getElementById('sort_mylike').addEventListener('click', async function () {
      const result= await fetch('/api/sortmyLike');
      
      if(result.status==200)
      {  window.location.href = '/myposts'; }   
    });

    document.querySelectorAll(".likebox div").forEach(likedbutton => {
      likedbutton.addEventListener("click", async () => {
      
        const post = likedbutton.parentNode.parentNode;//get this post
 
        if (!post) { return; }
 
        const postId = parseInt(post.getAttribute("post-id"));//get this post's id
        const likedCountElement = likedbutton.nextElementSibling;//get the like-count
        const likedCount = parseInt(likedCountElement.textContent)+1;
 
        try{
 
          const result = await fetch('/api/addmylike', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: postId, likecount: likedCount}),
          });
         
          if(result.status==200)
          {   
            likedCountElement.textContent = likedCount;//set the new like-count
          }
 
        }
        catch(error){
          window.location.href = '/error';
        }
 
       });
     
     });
   
     document.querySelectorAll(".deletebox div").forEach(deletebutton => {
      deletebutton.addEventListener("click", async () => {
        
         const post = deletebutton.parentNode.parentNode;
 
         if (!post) { return; }
 
         const postId = parseInt(post.getAttribute("post-id"));
         console.log(postId);

         try{
              const response = await fetch("/api/myPost", {
              method: "DELETE",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ id: postId}), 
              });

              if(response.status == 200||response.status==404){
                window.location.href = 'myposts';//successfully deleted
              }

            }catch (error) {
              window.location.href = '/error';
            }
 
      });
     
    });

 
 
    document.querySelectorAll(".editbox div").forEach(editbutton => {
      editbutton.addEventListener("click", async () => {
        
        const post = editbutton.parentNode.parentNode;
 
        if (!post) { return; }
 
        const postId = parseInt(post.getAttribute("post-id"));
        const contentElement = post.querySelector(".content");
        const timeElement = post.querySelector(".time");

         
        try {
          //Show popup
          document.getElementById('myModal').style.display = 'flex';
          document.getElementById('myModal').style.justifyContent = 'center';
          document.getElementById('myModal').style.alignItems = 'center';
          document.getElementById('editPost').value = contentElement.textContent;

       
          document.getElementById('editOK').addEventListener('click', async ()=> {
            const content = document.getElementById('editPost').value;
      
            //If the modified content is empty
            if(content == ''){
              
              const banner = document.getElementById('banner_modal');
              banner.textContent = 'The modified content should not be empty!';
              setTimeout(function() {
               banner.textContent = '';
              }, 1500);
          
            }else if(content.length>50){
         
              const banner = document.getElementById('banner_modal');
              banner.textContent = 'The modified content should not exceed 50 characters!';
              setTimeout(function() {
               banner.textContent = '';
              }, 1500);

            }
            else{

              const result = await fetch('/api/editmyPost', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: postId, content: document.getElementById('editPost').value}),
              })
              
              if(result.status==200){
                  
                contentElement.textContent = document.getElementById('editPost').value;
                //Change the modification time to the format YYYY-MM-DD HH:mm:ss
                const currentTime = new Date();
                const formattedTime = `${currentTime.getFullYear()}-${currentTime.getMonth() + 1}-${currentTime.getDate()} ${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`;
                timeElement.textContent = `Modified at: ${formattedTime}`;
                window.location.href = '/myposts';
  
              }else if(result.status==401)
              {
                const banner = document.getElementById('banner_modal');
                banner.textContent = "You can't edit this post!";
                setTimeout(function() {
                  banner.textContent = '';
                }, 1500);
                
              }else if(result.status==400){
                
                const banner = document.getElementById('banner_modal');
                banner.textContent = "fail to edit this post!";
                setTimeout(function() {
                  banner.textContent = '';
                }, 1500);
        
              }
            
            }

          });

         } catch (error) {
          window.location.href = '/error';
      }
 
      });
     
    });

 
   //set up Popup
    document.getElementById('closeModalBtn').addEventListener('click', function() {
      document.getElementById('myModal').style.display = 'none';
    });
       
    document.getElementById('editCancel').addEventListener('click', function() {
      document.getElementById('myModal').style.display = 'none';
    });
   
    window.addEventListener('click', function(event) {

      if(event.target == document.getElementById('myModal')){

        document.getElementById('myModal').style.display = 'none';
      }
    });

});
