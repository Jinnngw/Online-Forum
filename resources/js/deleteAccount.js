window.addEventListener("load", ()=>{



    document.querySelector('.mainpagebox div').addEventListener('click', async function () {

        window.location.href = '/';   
     });
 
    document.querySelector('.personalbox div').addEventListener('click', async function () {
   
       window.location.href = '/myposts';   
     });

    
    document.getElementById('confirpassw_btn').addEventListener('click', async ()=> {

        try{
   
         const password = document.getElementById("password").value;
         const result1 = await fetch('/api/confirpassw', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({oldpassword:password}),
         })
   
         //if password is correct
          if(result1.status==200){

            document.getElementById('confirpassw_div').style.display = 'none';
            document.getElementById('confirdelete_btn').style.display = 'block';
            document.getElementById('canceldelete_btn').style.display = 'block';
            document.getElementById('banner_deleteAccount').textContent = 'Do you want to delete this account?';

            //If confirm to delete the account
            document.getElementById('confirdelete_btn').addEventListener('click', async ()=> {

               
                const response = await fetch("/api/account", {
                    method: "DELETE",
                });
               
                if(response.status==200)
                {
                    document.getElementById('banner_deleteAccount').textContent = 'Successfully deleted';
                    document.getElementById('canceldelete_btn').style.display = 'none';
                    document.getElementById('confirdelete_btn').style.display = 'none';
                  

                    // 1.5s later log out
                    setTimeout(() => {
                      window.location.href = '/logout';
                    }, 1500);  
                }

            });

            //If cancel to delete the account
            document.getElementById('canceldelete_btn').addEventListener('click', async ()=> {

              window.location.href = '/deleteAccount';   
            });
    

          }else{
            //password is not correct
            const banner = document.getElementById('banner_deleteAccount');
            banner.textContent = 'Password is not correct';
            setTimeout(function() {
                banner.textContent = '';
            }, 2000);
          }

        }catch(error){
            window.location.href = '/error';
        }

    });

});