window.addEventListener("load", ()=>{

  document.getElementById("banner").textContent = "";

  const button = document.getElementById('Rbtn');
  button.addEventListener('click', async function () {
  
    try{
 
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const data = {
        username: username,
        password: password
      };
      //Username or password is empty
      if(username==''||password==''){

        document.getElementById("banner").textContent = "Username or password cannot be empty!";

      }else{
        const result = await fetch("/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
          })
      
        if(result.status==201)
        {
            
            document.getElementById("banner").textContent = "Register successfully";
            document.getElementById("password").value = "";
            document.getElementById("username").value = "";
          
        }else if(result.status==400){
       
          document.getElementById("banner").textContent = "Register Fail: Try Again";
          document.getElementById("password").value = "";
          document.getElementById("username").value = "";
      
        }else if(result.status==409){
    
          document.getElementById("banner").textContent = "User already exists";
          document.getElementById("password").value = "";
          document.getElementById("username").value = "";
        }
      }
    }catch(error)
    {
      window.location.href = '/error'; 
    }
      
  });

});