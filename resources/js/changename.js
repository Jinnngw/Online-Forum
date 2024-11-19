window.addEventListener("load", ()=>{

    document.querySelector('.mainpagebox div').addEventListener('click', async function () {

       window.location.href = '/';   
    });

    document.querySelector('.personalbox div').addEventListener('click', async function () {
  
      window.location.href = '/myposts';   
    });
   
    document.getElementById('changename_btn').addEventListener('click', async ()=> {
        try{

          document.getElementById('banner_changename').textContent = '';
          const username = document.getElementById('name').value;
          //If the entered name is not empty
          if(username!=''){
              const result = await fetch('/api/changeName', {
                method: 'POST',
                headers: {
                 'Content-Type': 'application/json',
                },
                body: JSON.stringify({username:username}),
              })
        
              if(result.status==200){
                const banner = document.getElementById('banner_changename');
                banner.textContent = 'Setup successful!';
              
                //Change the name displayed on this page
                const navPerson = document.querySelector('.nav_person p');
                navPerson.textContent = `${username}`;
        
                const changenameP = document.querySelector('.changenamep');
                changenameP.textContent = `Current name is ${username}`;
                
              }else {
                const banner = document.getElementById('banner_changename');
                banner.textContent = 'Setup unsuccessfully!';
                setTimeout(function() {
                  banner.textContent = '';
                }, 2000);
              }
            }else{
                //If the entered name is empty
                const banner = document.getElementById('banner_changename');
                banner.textContent = 'The entered name cannot be empty';
                setTimeout(function() {
                    banner.textContent = '';
                  }, 1500); 
            }
            
        }catch(error){
          window.location.href = '/error';
        }

    });
    
});
