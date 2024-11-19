// this package behaves just like the mysql one, but uses async await instead of callbacks.
const mysql = require(`mysql-await`); // npm install mysql-await

// first -- I want a connection pool: https://www.npmjs.com/package/mysql#pooling-connections
// this is used a bit differently, but I think it's just better -- especially if server is doing heavy work.
var connPool = mysql.createPool({
  connectionLimit: 5, // it's a shared resource, let's not go nuts.
  // host: "cse-mysql-classes-01.cse.umn.edu",// this will work
  host: "localhost",
  user: "C4131F23U221",
  database: "C4131F23U221",
  password: "48891", // we really shouldn't be saving this here long-term -- and I probably shouldn't be sharing it with you...
});

connPool.on('error', () => {});

//Delete the posts of users that do not exist in the users table and return the posts according to time
async function getPostsbytime(){
  try {
    await connPool.awaitQuery("DELETE FROM posts WHERE name NOT IN (SELECT name FROM users WHERE name IS NOT NULL)");
    const result = await connPool.awaitQuery("SELECT * FROM posts WHERE isActive = TRUE AND  name != '' ORDER BY modifyTime DESC");
    return result;
  } catch (error) {
    console.error('Error getting posts by time:', error);
    throw error;
  }
}
//Delete the posts of users that do not exist in the users table and return the posts according to like-count
async function getPostsbylike(){
  try {
    await connPool.awaitQuery("DELETE FROM posts WHERE name NOT IN (SELECT name FROM users WHERE  name IS NOT NULL)");
    const result = await connPool.awaitQuery("SELECT * FROM posts WHERE isActive = TRUE AND  name != '' ORDER BY liked DESC");
    return result;
  } catch (error) {
    console.error('Error getting posts by like-count:', error);
    throw error;
  }
}

//Return the specific user's posts according to time 
async function getPostsbyUserTime(name){
  try {
    const result = await connPool.awaitQuery('SELECT * FROM posts WHERE isActive = TRUE and  name= ? ORDER BY modifyTime DESC',[name]);
    return result;
  } catch (error) {
    console.error('Error getting posts by time:', error);
    throw error;
  }
}

//Return the specific user's posts according to like-count 
async function getPostsbyUserLike(name){
  try {
    const result = await connPool.awaitQuery('SELECT * FROM posts WHERE isActive = TRUE and  name= ? ORDER BY liked DESC',[name]);
    return result;
  } catch (error) {
    console.error('Error getting posts by time:', error);
    throw error;
  }
}

//add a post
async function addPost({ name, content }){

  try {
    
    const result = await connPool.awaitQuery(
      'INSERT INTO posts (name, Content) VALUES (?, ?)',
      [name, content]
    );

    return result;
  } catch (error) {
    console.error('Error adding post to the database:', error);
    throw error;
  }

}

//like a post
async function addLike({likeCount,postId})
{
  try {
    const result = await connPool.awaitQuery(
      'UPDATE posts SET liked= ? WHERE id= ?',
       [likeCount,postId]
    );
    return result;
  } catch (error) {
    console.error('Error adding post to the database:', error);
    throw error;
  }
}

//delete a post
async function deletePost(postId){

  try {

    const result = await connPool.awaitQuery(
      'delete from posts where id=?',
       [postId]
    );
    return result;
  } catch (error) {
    console.error('Error deleting post to the database:', error);
    throw error;
  }

}

//edit a post
async function editPost({content,postId}){
  try {

    const result = await connPool.awaitQuery(
      'UPDATE posts SET Content=?, modifyTime=CURRENT_TIMESTAMP WHERE id=?',
      [content, postId]
    );
    return result;
  } catch (error) {
    console.error('Error editing post to the database:', error);
    throw error;
  }
}

//get username by id from posts table
async function getUserbyId(Id){

  try {

    const result = await connPool.awaitQuery(
      'select name from posts where id=?',
      [Id]
    );
    return result;
  } catch (error) {
    console.error('Error getting username by id from the database:', error);
    throw error;
  }

}

//add user
async function addUser({username,hashedPassword})
{
  try {
   
    const result = await connPool.awaitQuery(
      'INSERT INTO users (name,password) values (?,?)',
      [username,hashedPassword]
    );
    
   
    return result;
  } catch (error) {
    console.error('Error adding user to the database:', error);
    throw error;
  }
   
}

//delete user and his posts
async function deleteUser(username){

  try {

    const result1 = await connPool.awaitQuery(
      'delete from users where name=?',
       [username]
    );

    if(result1.affectedRows>0)
    {
      await connPool.awaitQuery('DELETE FROM posts WHERE name = ?', [username]);
      return true;
    }
    else{
      return false;
    }
  } catch (error) {
    console.error('Error deleting post to the database:', error);
    throw error;
  }

}

//get password by username from users table
async function getPswbyUser(username)
{
  try {

    const result = await connPool.awaitQuery(
      'select password from users where name=?',
      [username]
    );
   
    return result;
  } catch (error) {
    console.error('Error getting password by username from the database:', error);
    throw error;
  }
   
}

//get username by password from users table
async function getUserbyPsw(oldpassword)
{
  try {

    const result = await connPool.awaitQuery(
      'select name from users where password=?',
      [oldpassword]
    );
  
    return result;
  } catch (error) {
    console.error('Error getting username by password from the database:', error);
    throw error;
  }
   
}


//get message by username from users table
async function getmessbyUser(username)
{ 
  try {

    const result = await connPool.awaitQuery(
      'select * from users where  name=?',
      [username]
    );
   
    return result;
  } catch (error) {
    console.error('Error getting message by username from the database:', error);
    throw error;
  }

}

//set password by username in user table
async function setPswbyUser({hashedPassword,username})
{
  try {

    const result = await connPool.awaitQuery(
      'Update users set password=? where  name=?',
      [hashedPassword,username]
    );
    
    return result;
  } catch (error) {
    console.error('Error setting new Hpassword in database', error);
    throw error;
  }
   
}

//change name in users table
async function changeName_Users({newname,oldname})
{
  try {

    const result = await connPool.awaitQuery(
      'update users set name= ? where name=?',
      [newname,oldname]
    );
    
    return result;
  } catch (error) {
    console.error('Error changing username of the users', error);
    throw error;
  }
   
}

//change name in posts table
async function changeName_Posts({newname,oldname})
{
  try {

    const result = await connPool.awaitQuery(
      'update posts set name= ? where  name=?',
      [newname,oldname]
    );
    return result;
  } catch (error) {
    console.error('Error changing username of the posts', error);
    throw error;
  }
   
}

//return the sum of the posts
async function sumofPosts() {
  try {
    const result = await connPool.awaitQuery('SELECT COUNT(*) as count FROM posts WHERE isActive = true');
    const totalCount = result[0].count;
    return totalCount;
  } catch (error) {
    console.error('Error getting sum of posts', error);
    throw error;
  }
}

//return the sum of the posts from a specific user
async function sumofmyPosts(name) {
  try {
    const result = await connPool.awaitQuery('SELECT COUNT(*) as count FROM posts WHERE isActive = true and name=?',[name]);
    const totalCount = result[0].count;
    return totalCount;
  } catch (error) {
    console.error('Error getting sum of my posts', error);
    throw error;
  }
}
module.exports = {getPostsbytime,getPostsbylike,getPostsbyUserTime,getPostsbyUserLike,addPost,addLike,deletePost,editPost,addUser,
  getPswbyUser,getUserbyPsw,getUserbyId,getmessbyUser,changeName_Users,changeName_Posts,setPswbyUser,
  deleteUser,sumofPosts,sumofmyPosts}



