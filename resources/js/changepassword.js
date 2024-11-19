window.addEventListener("load", ()=>{
  

    document.querySelector('.mainpagebox div').addEventListener('click', async function () {

      window.location.href = '/';   
     });
 
    document.querySelector('.personalbox div').addEventListener('click', async function () {
   
      window.location.href = '/myposts';   
     });

    document.getElementById('confirpassw_btn').addEventListener('click', async ()=> {

      try{

        const oldpassword = document.getElementById("Opassword").value;
        const result1 = await fetch('/api/confirpassw', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({oldpassword:oldpassword}),
        })

        //if oldpassword is correct
        if(result1.status==200)
        {
          //hide div of confirmming password and show div of setting password
          document.getElementById('confirpassw_div').style.display = 'none';
          document.getElementById('setPassword_div').style.display = 'block';
          document.getElementById('banner_changepassw').textContent = '';


          document.getElementById('changepassw_btn').addEventListener('click', async ()=> {
              
            const newpassword = document.getElementById("Npassword").value;
            if(newpassword!='')
            {
              const result2 = await fetch('/api/changepassw', {
                method: 'POST',
                headers: {
                      'Content-Type': 'application/json',
                },
                body: JSON.stringify({newpassword:newpassword}),
              })
                
              //if change password is successfully！
              if(result2.status==200){
                    
                const banner = document.getElementById('banner_changepassw');
                banner.textContent = 'Setup successful!';
                setTimeout(function() {
                banner.textContent = '';
                }, 1500);
              }
              else{

                const banner = document.getElementById('banner_changepassw');
                banner.textContent = 'Setup unsuccessful!';
                setTimeout(function() {
                    banner.textContent = '';
                }, 1500);
              }

            }else{
                //The entered password cannot be empty
                const banner = document.getElementById('banner_changepassw');
                banner.textContent = 'The entered password cannot be empty';
                setTimeout(function() {
                    banner.textContent = '';
                }, 2000);
            }
              
          })

        }//old password is not correct
        else{
          
          const banner = document.getElementById('banner_changepassw');
          banner.textContent = 'Password is not correct';
          setTimeout(function() {
            banner.textContent = '';
          }, 1500);
                
        }
      }catch(error){
        window.location.href = '/error';
      }

    })

});