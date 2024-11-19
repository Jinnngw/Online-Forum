window.addEventListener("load", ()=>{

    document.getElementById("banner").textContent = "";
     
    document.getElementById('Lbtn').addEventListener('click', async function () {

        try{

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const data = {
              username: username,
              password: password
            };
        
            const result = await fetch("/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
            })
        
          if(result.status==200)
          {
            //If the login is successful, jump to the main page
            window.location.href = "/";
            
          }else if(result.status==401){
            
             document.getElementById("banner").textContent = "Login Fail: Wrong password or username";
             document.getElementById("password").value = "";
             document.getElementById("username").value = "";
        
          }
        
          }catch(error)
          {
             window.location.href = '/error'; 
          }

    })
    
});