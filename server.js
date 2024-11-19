const data = require("./data")
const express = require ('express')
const app = express()
const port = 4131

app.set("views", "templates"); // look in "templates" folder for pug templates
app.set("view engine", "pug");

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//YYYY-MM-DD HH:mm:ss
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

//------------session-----------------
const session = require('express-session');
const bcrypt = require('bcrypt');

app.use(session({
  secret: "mysecretkey",
  saveUninitialized: true,
  resave: false
}
));


//---------register------------
app.get('/register', (req, res) => {
  res.status(200).render('register.pug');
});

//Store the entered username and password in the database. 
//If the username already exists, it cannot be stored.If an error occurs, then redirect to  `"/error"`.
app.post('/register', async (req, res) => {
  try{

    const { username, password } = req.body;

    //generate the salt
    const salt = await bcrypt.genSalt(10);
    //Hashing using salt
    const hashedPassword = await bcrypt.hash(password, salt);
    //Check if user exists
    const result1 = await data.getmessbyUser(username);
    if(result1.length>=1){

      res.status(409).send('User already exists');
    }
    else{
      const result = await data.addUser({username,hashedPassword});
      if(result.affectedRows>0)
      {
        res.status(201).send('register successfully');
      }
      else{
        res.status(400).send('register unsuccessfully');
      }
    }
  }catch(error)
  {
    res.redirect('/error');
  }
  
});

//-------------login-----------
app.get('/login', (req, res) => {
  res.status(200).render('login.pug');
});

//Compare the username and password entered by the user with those in the database. 
//If they are the same, return 200, use sessions to record login status and redirect to `"/"`.
//If an error occurs, then redirect to  `"/error"`.
app.post('/login', async (req, res) => {
  try{
    const { username, password } = req.body;
    //Get the password by entering the username
    const result= await data.getPswbyUser(username);
    if(result.length>=1)
    {   //If the entered password is the same as the stored password
        if (bcrypt.compareSync(password, result[0].password)) {
          req.session.loggedin = true;
          // req.session.sortbytime = true;//By default, Posts are viewed in order of time
          // req.session.sortbylike = false;
          req.session.username = username;
          res.status(200);
          res.redirect('/');  		
        } else {
          res.status(401).send("Wrong password or username")
        }
    }else {
      res.status(401).send("Wrong password or username")
    }
  }
  catch(error){
    res.redirect('/error');
  }

});

//-------------logout------------
app.get('/logout', (req, res) => {

  req.session.destroy(() => {
    res.redirect('/');
  });

});

//-------------get--------------
// Returns the mainpage. If the user logs in, 
// file-contents is `templates/mainLogin.pug`,Otherwise, file-contents is `templates/mainNoLogin.pug`.
app.get("/", async (req, res)=>{
try{

  let page = parseInt(req.query.page ?? 1)
  if (! page) {
    page = 1;
  }

  let offset = (page-1)*5

  //Get posts sorted by time or likes
  var posts;
  if(!req.session.sortbytime&&req.session.sortbylike){

    posts = await (await data.getPostsbylike()).slice(offset, offset+5)
  }
  else{
    posts = await (await data.getPostsbytime()).slice(offset, offset+5)
  }
     
  //Change the modification time to the format YYYY-MM-DD HH:mm:ss
  for(let i=0;i<posts.length;i++){  

    if(posts[i].modifyTime!=null){

      posts[i].modifyTime= formatDate(posts[i].modifyTime);
    }
  }

  res.status(200);
  if(req.session.loggedin){

  const name = req.session.username;
  // Determine if there are more pages
  const sumofPosts = await data.sumofPosts();
  const hasMorePages = sumofPosts>offset+5;

  res.render("mainLogin.pug",{posts,page,name,hasMorePages});
      
  }
  else{
    res.render("mainNoLogin.pug",{posts,page});
  }
}
catch(error){
  res.redirect('/error');
}

})

//Redirect to `"/"`  where posts sorted by time
app.get("/api/sortTime",async(req,res)=>{  
   
  req.session.sortbytime = true;
  req.session.sortbylike = false;
  res.redirect('/');

})

//Redirect to `"/"`  where posts sorted by likes
app.get("/api/sortLike",async(req,res)=>{ 
  req.session.sortbytime = false;
  req.session.sortbylike = true;
  res.redirect('/');
})

//Redirect to `"/myposts"`  where posts sorted by time if the use logs in otherwise redirect to `"/login"`
app.get("/api/sortmyTime",async(req,res)=>{  
  req.session.sortbytime = true;
  req.session.sortbylike = false;
  res.redirect('/myposts');
})

// Redirect to `"/myposts"`  where posts sorted by likes if the use logs in otherwise redirect to `"/login"`
app.get("/api/sortmyLike",async(req,res)=>{ 
  req.session.sortbytime = false;
  req.session.sortbylike = true;
  res.redirect('/myposts');
})

//Returns file-contents of `templates/myPosts.pug` which is personal posts page if the user logs in.
// Otherwise, returns file-contents of `templates/login.pug` if the user doesn't log in.
app.get("/myposts",async(req,res)=>{  
if(req.session.loggedin){
  try{
    let page = parseInt(req.query.page ?? 1)
    if (! page) {
       page = 1;
    }
  
    let offset = (page-1)*5
    const name = req.session.username;
     
    //Get posts sorted by time or likes
    var posts;
    if(!req.session.sortbytime&&req.session.sortbylike){
      posts = await (await data.getPostsbyUserLike(name)).slice(offset, offset+5)
    }
    else{
    posts = await (await data.getPostsbyUserTime(name)).slice(offset, offset+5)
    }
    //Change the modification time to the format YYYY-MM-DD HH:mm:ss
    for(let i=0;i<posts.length;i++){

      if(posts[i].modifyTime!=null){
        posts[i].modifyTime= formatDate(posts[i].modifyTime);
      }
    }

    res.status(200);
    const sumofPosts = await data.sumofmyPosts(name);
    const hasMorePages = sumofPosts>offset+5;

    res.render("myPosts.pug",{posts,page,name,hasMorePages});
      
  }
  catch (error) {
    res.redirect('/error'); 
  }
}
else{
  res.redirect('/login');
}

})

//Returns file-contents of `templates/changePassw.pug` if the user logs in.
//Otherwise, returns file-contents of `templates/login.pug` if the user doesn't log in.
app.get("/changepassw",async(req,res)=>{   
  if(req.session.loggedin){

    const name = req.session.username;
    res.status(200).render("changePassw.pug",{name});

  }else{
    res.redirect('/login');
  }

})
//Returns file-contents of `templates/changeName.pug` if the user logs in.
//Otherwise. returns file-contents of `templates/login.pug` if the user doesn't log in.
app.get("/changename",async(req,res)=>{  
  if(req.session.loggedin){
    const name = req.session.username;
    res.status(200).render("changeName.pug",{name});
  }else{
    res.redirect('/login');
  }
})

//Returns file-contents of `templates/deleteAccount.pug` if the user logs in.
//Otherwise,Returns file-contents of `templates/login.pug` if the user doesn't log in.
app.get("/deleteAccount",async(req,res)=>{  
  if(req.session.loggedin)
  {
    const name = req.session.username;
    res.status(200).render("deleteAccount.pug",{name});

  }else{
    res.redirect('/login');
  } 
})

app.get("/error",async(req,res)=>{

  res.status(500).render("error_page.pug"); 

})

app.get("/unauthorized",async(req,res)=>{

  res.status(401).render("unauthorized.pug"); 

})


// ---------------post---------------

//If the user doesn't log in, it will redirect to  `"/unauthorized"`,
//otherwise, it can add a post on the pages(main page, personal posts page)and in the database.
//If an error occurs, then redirect to  `"/error"`.
app.post("/api/post", async(req, res) => {
  if(req.session.loggedin){

    const content  = req.body.content;
    const name = req.session.username;
    
    try{
        
     await data.addPost({ name, content });
     res.status(200).send('Sent successfully')
  
    }catch (error) {
      res.redirect('/error');
    }

  }else{
    res.redirect('/unauthorized');
  }
    
})

//If the user doesn't log in, it will redirect to  `"/unauthorized"`,
//otherwise, it can like a post and increase likes of the posts shown on mainpage and in the database.
//If an error occurs, then redirect to  `"/error"`.
app.post("/api/addlike", async(req,res)=>{
  if(req.session.loggedin){

    const postId = req.body.id;
    const likeCount = req.body.likecount;

    try{
  
      const result =  await data.addLike({likeCount,postId});
      if(result.affectedRows>0){

        res.status(200).send("Like successfully");
      }else{
        res.status(400).send("fail to add like");
      }
 
    }catch(error){
      res.redirect('/error');
    }  
    
  }else{
    res.redirect('/unauthorized');
  }
})

//If the user doesn't log in, it will redirect to  `"/unauthorized"`,
//otherwise, it can like a post and increase likes of the posts shown on personal posts page and in the database.
//If an error occurs, then redirect to  `"/error"`.
app.post("/api/addmylike", async(req,res)=>{
  if(req.session.loggedin){

    const postId = req.body.id;
    const likeCount = req.body.likecount;
  
    try{
  
      const result =  await data.addLike({likeCount,postId});

      if(result.affectedRows>0){
        res.status(200).send("Like successfully");
      }else{
        res.status(400).send("fail to add like");
      }
    }
     catch(error){
      res.redirect('/error');
    }  
  
  }else{
    res.redirect('/unauthorized');
  }
})

//If the user doesn't log in, it will redirect to  `"/unauthorized"`,
//otherwise, it can edit a post if the user owns this post on the mainpage.
//If an error occurs, then redirect to  `"/error"`.
app.post("/api/editPost", async(req,res)=>{

  if(req.session.loggedin){
     
    try{

      const postId = req.body.id;
      const content = req.body.content;
      //get the owner of the post
      const user = await data.getUserbyId(postId);
      
      //If the user is the owner
      if(user[0].name == req.session.username){
        
          const result = await data.editPost({content,postId});
          if(result.affectedRows > 0){
            res.status(200).send("Post editd");
          }
          else{
            res.status(400).send("fail to edit post");
          }
      }
      else{
        res.status(401).send('unauthorized');
      }   
    }
    catch(error){
      res.redirect('/error');
    }  
  }else{
    res.redirect('/unauthorized');
  }

})

//If the user doesn't log in, it will redirect to  `"/unauthorized"`,
//otherwise, it can edit a post if the user owns this post on personal posts page.
//If an error occurs, then redirect to  `"/error"`.
app.post("/api/editmyPost", async(req,res)=>{
  if(req.session.loggedin){  
    try{

      const postId = req.body.id;
      const content = req.body.content;
      //get the owner of the post
      const user = await data.getUserbyId(postId);
      
      //If the user is the owner
      if(user[0].name == req.session.username){
        
          const result = await data.editPost({content,postId});
          if(result.affectedRows > 0){
            res.status(200).send("Post editd");
          }
          else{
            res.status(400).send("fail to edit post");
          }
      }
      else{
        res.status(401).send('unauthorized');
      }   
    }
    catch(error){
      res.redirect('/error');
    }  
  }else{
    res.redirect('/unauthorized');
  }
})

//If the user doesn't log in, it will redirect to  `"/unauthorized"`,
//otherwise, it can change username shown on main page and in the database.
//If an error occurs, then redirect to  `"/error"`.
app.post("/api/changeName", async(req, res) => {
  if(req.session.loggedin){
    try{
      const newname = req.body.username;
      const oldname = req.session.username;
      //change the name in users table
      const result1 = await data.changeName_Users({newname,oldname});
      if(result1.affectedRows>0){
        req.session.username=newname; 
        //change the name in posts table
        await data.changeName_Posts({newname,oldname});
        res.status(200).send('Name changed successfully');
      }else{
        res.status(400).send('Name changed unsuccessfully');
      }
    }catch(error){
      res.redirect('/error');
    }

  }else{
    res.redirect('/unauthorized');
  }

})

//If the user doesn't log in, it will redirect to  `"/unauthorized"`,
//otherwise, it can confirm whether the entered password is consistent with the database password.
//If an error occurs, then redirect to  `"/error"`.
app.post("/api/confirpassw", async(req, res) => {
  if(req.session.loggedin){
      try{
        const oldpassword = req.body.oldpassword;
        const username = req.session.username;
        const result= await data.getPswbyUser(username);
      
        //if the old password equals to user's password
        if(bcrypt.compareSync(oldpassword, result[0].password))
        {
          res.status(200).send('The old password is correct');
        }
        else{
          res.status(400).send('The old password is not correct');
        }
     }catch(error)
     {
      res.redirect('/error');
     }

  }else{
    res.redirect('/unauthorized');
  }

})

// If the user doesn't log in, it will redirect to  `"/unauthorized"`,
//otherwise, it can change password stored in database.
//If an error occurs, then redirect to  `"/error"`.
app.post("/api/changepassw", async(req, res) => {
  if(req.session.loggedin){  
    try{
      const newpassword = req.body.newpassword;
      const hashedPassword = await bcrypt.hash(newpassword, 10);

      const username = req.session.username;
      const result = await data.setPswbyUser({hashedPassword,username})

       //if change password successfully
      if(result.affectedRows>0){
        res.status(200).send('Password changed successfully');
      }else{
        res.status(400).send('Password changed unsuccessfully');
      }
    }catch(error){
      res.redirect('/error');
    }
  }else{
    res.redirect('/unauthorized');
  }

})


// ----------------Delete-----------------

// If the user doesn't log in, it will redirect to  `"/unauthorized"`,
//otherwise, it can delete the posts shown on main page and stored in database.
//If an error occurs, then redirect to  `"/error"`.
app.delete('/api/Post', async(req, res) => {
  if(req.session.loggedin){
    try {
      const post = req.body;
      if ("id" in post && post["id"]!==""){
        //Get the owner of the post
        const user = await data.getUserbyId(post["id"]);
        //If the user is the owner
        if(user[0].name == req.session.username){

          const result = await data.deletePost(post["id"]);
          if(result.affectedRows>0){ 
            return res.status(200).send("post deleted"); 
          }else{
            return res.status(404).send("post not found."); 
          }
        }
        else{
          res.status(401).send('unauthorized');
        }
        
      }else{
        return res.status(400).send("Missing 'id' property in the request JSON.");
      }
    }catch(error)
    {
      res.redirect('/error');
    }
  }
  else{
    res.redirect('/unauthorized');
  }

});

// If the user doesn't log in, it will redirect to  `"/unauthorized"`,
//otherwise, it can delete the posts shown on personal page and stored in database.
//If an error occurs, then redirect to  `"/error"`.
app.delete('/api/myPost', async(req, res) => {

  if(req.session.loggedin){
    try {
      const post = req.body;
      if ("id" in post && post["id"]!==""){
        //Get the owner of the post
        const user = await data.getUserbyId(post["id"]);
        //If the user is the owner
        if(user[0].name == req.session.username){

          const result = await data.deletePost(post["id"]);
          if(result.affectedRows>0){ 
            return res.status(200).send("post deleted"); 
          }else{
            return res.status(404).send("post not found."); 
          }
        }
        else{
          res.status(401).send('unauthorized');
        }
        
      }else{
        return res.status(400).send("Missing 'id' property in the request JSON.");
      }
    }catch(error){
      res.redirect('/error');
    }
  }
  else{
    res.redirect('/unauthorized');
  }

});


//If the user doesn't log in, it will redirect to  `"/unauthorized"`,
//otherwise, it can delete user account in frontend and in database.
//If an error occurs, then redirect to  `"/error"`.
app.delete('/api/account', async(req, res) => {
 
  if(req.session.loggedin){

   try{
      const username = req.session.username;
      const result = await data.deleteUser(username);
      if(result)
      {
        res.status(200).send('successfully deleted');
      }
   }catch(error){
    res.redirect('/error');
   }

  }else{
    res.redirect('/unauthorized');
  }

});


app.use("/", express.static("resources"))

// put at bottom so it's run last -- this acts as a "catch all" letting us 404!
app.use((req, res, next) => {
  res.status(404).render("404.pug"); 
})

app.listen(port , () => {
    console.log(`Example app listening on port ${port}`)
})