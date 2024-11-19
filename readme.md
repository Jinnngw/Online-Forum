#### How to start this software: 

The commands you need：

```
npm install
npm install express
npm install pug
npm install express-session
npm install bcrypt
npm install mysql-await
npm install tunnel-ssh
npm install prompt
node tunnel.js
node server.js
```

##### Accounts and posts are stored in users table and posts table.You can use one of these account to login or you can register a new one yourself:

```
username: allen password:123
username: bob   password:123
username: Allen password:123
```



I use **Google Chrome** and a **2560*1600** screen during development, and I also use the **MEDIA QUERIES** method to make my website adapt to other screen sizes as much as possible.



#### ENDPOINTS:

##### Get request:

`GET /`:  Returns the mainpage. If the user logs in, file-contents is `templates/mainLogin.pug`,Otherwise, file-contents is `templates/mainNoLogin.pug`.

`GET /myposts`:  Returns file-contents of `templates/myPosts.pug` which is personal posts page if the user logs in. Otherwise, returns file-contents of `templates/login.pug` if the user doesn't log in.

`GET /register`: Returns file-contents of `templates/register.pug` 

`GET /login`: Returns file-contents of `templates/login.pug` 

`GET /logout`: Logs the user out by terminating their session.

`GET /api/sortTime `: Redirect to `"/"`  where posts sorted by time(Refer to the above)

`GET /api/sortLike `: Redirect to `"/"`  where posts sorted by likes(Refer to the above)

`GET /api/sortmyTime `: Redirect to `"/myposts"`  where posts sorted by time if the use logs in otherwise redirect to `"/login"`

`GET /api/sortmyLike `: Redirect to `"/myposts"`  where posts sorted by likes if the use logs in otherwise redirect to `"/login"`

`GET /changepassw `: Returns file-contents of `templates/changePassw.pug` if the user logs in.Otherwise, returns file-contents of `templates/login.pug` if the user doesn't log in.

`GET /changename`: Returns file-contents of `templates/changeName.pug` if the user logs in.Otherwise. returns file-contents of `templates/login.pug` if the user doesn't log in.

`GET /deleteAccount`: Returns file-contents of `templates/deleteAccount.pug` if the user logs in.Otherwise,Returns file-contents of `templates/login.pug` if the user doesn't log in.

`GET /error`: Returns file-contents of `templates/error_page.pug` 

`GET /unauthorized`: Returns file-contents of `templates/unauthorized.pug` 



##### Post request:

`post /login`: Compare the username and password entered by the user with those in the database. If they are the same, return 200, use sessions to record login status and redirect to `"/"`.If an error occurs, then redirect to  `"/error"`.

`post /register`: Store the entered username and password in the database. If the username already exists, it cannot be stored.If an error occurs, then redirect to  `"/error"`.

`post /api/post`: If the user doesn't log in, it will redirect to  `"/unauthorized"`,otherwise, it can add a post on the pages(main page, personal posts page)and in the database.If an error occurs, then redirect to  `"/error"`.

`post /api/addlike`: If the user doesn't log in, it will redirect to  `"/unauthorized"`,otherwise, it can like a post and increase likes of the posts shown on mainpage and in the database.If an error occurs, then redirect to  `"/error"`.

`post /api/addmylike`:  If the user doesn't log in, it will redirect to  `"/unauthorized"`,otherwise, it can like a post and increase likes of the posts shown on personal posts page and in the database.If an error occurs, then redirect to  `"/error"`.

`post /editPost`: If the user doesn't log in, it will redirect to  `"/unauthorized"`,otherwise, it can edit a post if the user owns this post on the mainpage.If an error occurs, then redirect to  `"/error"`.

`post /editmyPost`:  If the user doesn't log in, it will redirect to  `"/unauthorized"`,otherwise, it can edit a post if the user owns this post on personal posts page.If an error occurs, then redirect to  `"/error"`.

`post /api/changeName`: 

If the user doesn't log in, it will redirect to  `"/unauthorized"`,otherwise, it can change username shown on main page and in the database.If an error occurs, then redirect to  `"/error"`.

`post /api/confirpassw`:  If the user doesn't log in, it will redirect to  `"/unauthorized"`,otherwise, it can confirm whether the entered password is consistent with the database password.If an error occurs, then redirect to  `"/error"`.

`post /api/changepassw`:  If the user doesn't log in, it will redirect to  `"/unauthorized"`,otherwise, it can change password stored in database.If an error occurs, then redirect to  `"/error"`.



##### Delete request:

`delete /api/Post`: If the user doesn't log in, it will redirect to  `"/unauthorized"`,otherwise, it can delete the posts shown on main page and stored in database.If an error occurs, then redirect to  `"/error"`.

`delete /api/myPost`: If the user doesn't log in, it will redirect to  `"/unauthorized"`,otherwise, it can delete the posts shown on personal page and stored in database.If an error occurs, then redirect to  `"/error"`.

`delete /api/account`: If the user doesn't log in, it will redirect to  `"/unauthorized"`,otherwise, it can delete user account in frontend and in database.If an error occurs, then redirect to  `"/error"`.



- Any other METHOD/URL combination return the file-contents of `templates/404.pug`



#### Overall Features：

- Recent Posts view
- Posts by like-count view
- Post creation
- Post editing
- Post deleting
- Post liking
- Account creation
- Account deletion
- Tracke Logged-in vs. not-logged-in status 
- Use salt+ hash to store password
- Posts are associated with a specific user, only the associated user can edit or delete a given post.
- Change Password
- Change Name
- Dark Mode Changes
- Pagination(Assume that each page can only have 5 pages of posts. If there are 6 posts, you can go to the second page. If there are only five posts, you cannot go to the second page.)



#### Pages and Detailed Features：

##### Main page: 

#####  `GET /`:  Returns the mainpage.

If the user doesn't log in, file-contents is `templates/mainNoLogin.pug`：

1.Users can only view the first page of posts (each page has 5 posts). And users cannot perform any operations on posts (like, edit, delete).

2.The default viewing order of posts is sorted by time (newest first). User can click the `By likes` button to sort by number of likes (the most liked posts are at the top), and can click `By time` button to switch the order.And this order will always exist (No matter go to a new page, from no login to login or reopen the browser) unless you click the button to switch or logout.

3.The user can click on the little house icon to enter the mainpage, and can click on the moon icon to switch to dark night mode. However, when clicking on the little man icon which represents the personal posts page, it will be redirected to the login page because the user does not log in. You can clikc the moon icon to change into Dark Mode.



If the user logins in, file-contents is `templates/mainLogin.pug`:

1.User can view all posts, and there are only 5 posts on one page. If you want to see more, you need to go to the next page.

2.The default post order is the same as the post order selected before logging in. This order will be saved until you click the different buttons or logout to switch order to sort by time.

3.User can only edit and delete his own posts, but he can like all posts. When editing a post, the modified content cannot be empty or more than 50 characters, otherwise a prompt will appear. Click the 🆗 button to complete the modification. In the sort by time mode, the modified new post will appear at the top, and the modification time will also be updated. Click the ❌ button or cancel button to cancel modifications.

4.Username is case sensitive. So "Allen" and "allen" is different. Allen cannot edit allen's posts.

5.If there are 6 posts in total, if you delete a post on the first page, the posts on the second page will go to the first page, so there are still 5 posts on the first page.

6.User can add posts, and the input content cannot be empty, otherwise a prompt will appear. User cannot enter more than 50 characters, otherwise there will be a reminder as well. New post with username,modifiedtime and like-count will appear at the top, if sorted by time.

7.When user likes a post, the number of likes will be updated in real time and the page will not be reloaded.

8.When user clicks the 'logout', the session will be cleared and the main page will change to the page when there is no login.



##### Login Page:

`GET /login`: Returns file-contents of `templates/login.pug` .

1.Username is case sensitive. So "Allen" and "allen" is different.

2.If the entered username is incorrect, “ Register Fail: Wrong password or usernamer” will be displayed.

3.If the entered password is incorrect, “ Register Fail: Wrong password or usernamer” will be displayed.

4.If login is successful，use session to store login status information and redirect to main page:

```
req.session.loggedin = true;
req.session.username = username;
```



##### Register Page:

`GET /register`: Returns file-contents of `templates/register.pug` .

1.If the user name to be registered already exists, it will prompt "User already exists". 

2.Use salt+hash to store passwords.

3.Allen and allen can both be registered since username is case sensitive.



##### Personal posts page:

Returns file-contents of `templates/myPosts.pug` which is personal posts page if the user logs in. Otherwise, returns file-contents of `templates/login.pug` if the user doesn't log in.

1.On this page, user can only see the posts that the user has posted. User can edit, delete, like, and switch the order of viewing posts.



##### Change name page:

`GET /changename`: Returns file-contents of `templates/changeName.pug` if the user logs in.Otherwise, Returns file-contents of `templates/login.pug` if the user doesn't log in.

1.If the entered new name is empty, a prompt "cannot be empty" will appear.

2.After changing the name, the name of the posts and the name on the navigation bar will change.

3.If the name user want to change already exists, it will be prompted "Setup unsuccessfully!".



##### Change password page:

`GET /changepassw `: Returns file-contents of `templates/changePassw.pug` if the user logs in.Otherwise, returns file-contents of `templates/login.pug` if the user doesn't log in.

1. User need to enter the old password before changing the new password. If the old password is incorrect, the new password cannot be changed.

2. The new password entered cannot be empty, otherwise, a prompt will appear

   

##### Delete account page:

`GET /deleteAccount`: Returns file-contents of `templates/deleteAccount.pug` if the user logs in.Otherwise,Returns file-contents of `templates/login.pug` if the user doesn't log in.

1.Before deleting the account, you must first enter the password to confirm that it is you. If the password is incorrect, the account cannot be deleted. If the password is correct, you can choose to delete the account. After deletion, the user will be deleted from the users table, and the posts posted by the user will also be deleted.

2.Every time the server obtains posts information from the database, it will delete posts from non-existing users.



#### Source:

1.Embedded video from:https://a.sinaimg.cn/mintra/pic/2112130543/weibo_login.mp4

2.Icons from：https://www.iconfont.cn/

3.images from：Draco in oil painting
