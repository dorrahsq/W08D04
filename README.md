# Social media website (backend) 

## Features
- SignUp (with Verification)
- LogIn 
- Forget password and reset it
- Show all users and delete any user (for admin only)
- Post CRUD
- Comment CRUD
- like-unlike any post (toggle)


## ER diagram
![Untitled Diagram drawio-5](https://user-images.githubusercontent.com/92247950/145675355-0b91d4ae-f144-4db9-8069-872a2568897d.png)


## UML diagram
![Untitled Diagram drawio](https://user-images.githubusercontent.com/92247950/145237871-9bbf654e-9416-4d0e-ab55-48c415bd8119.png)

## Models
#### - Role model 
```
{
  role: { type: String, required: true },
  permissions: { type: Array, required: true },
}
```
#### - User model 
```
{
  email: { type: String, required: true, unique: true, validate: { validator: validator.isEmail, message: "{VALUE} is not a valid email"}},
  username: { type: String, required: true },
  password: { type: String },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
  isDeleted: { type: Boolean, default: false },
  img: {type: String, default:"https://i.pinimg.com/564x/e7/c3/f4/e7c3f4a076b8472e0b1bd9c00a847f7f.jpg"},
  isVerified: { type: Boolean, default: false },
  resetLink: {data: String, default: ""}
}
```
#### - Like model 
```
{
  by: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  onPost: { type: mongoose.Schema.Types.ObjectId, ref: "post", required: true },
}
```
#### - Comment model 
```
{
  title: { type: String, required: true },
  date: { type: Date, default: new Date() },
  by: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  onPost: { type: mongoose.Schema.Types.ObjectId, ref: "post" },
}
```
#### - Post model 
```
{
  img: { type: String },
  isDeleted: { type: Boolean, default: false },
  date: { type: Date, default: new Date() },
  describe: { type: String, required: true },
  postedBy: {type: mongoose.Schema.Types.ObjectId, ref: "user", required: true},
}
```

## Routes
HTTP Method   | authorize     |    Path                                |  Request Body         
------------- | -----------   | ---------------------------            |---------------------- 
POST          | everyone      |`/user/create`                          |{email, password, role}
POST          | everyone      |`/user/log`                             |{email, password}     
GET           | admin only    |`/user/`                                |                       
DELETE        | admin only    |`/user/`                                |
GET           | everyone      |`/user/confirmation/:email/:token`      |                       
PUT           | everyone      |`/user/forgetPassword`                  |{email}     
PUT           | everyone      |`/user/resetPassword`                   |{resetLink, newPassword}  
GET           | user+admin    |`/user/:_id"`                           |                       
POST          | everyone      |`/user/googlelogin`                     |{idToken}     
PUT           | admin + user  |`/likes/`                               |{by, onPost}
GET           | admin + user  |`/likes/:onPost`                        |
POST          | admin + user  |`/comment/create`                       |{title, by, onPost}
PUT           | admin + user  |`/comment/update`                       |{id, title}
DELETE        | admin + user  |`/comment/delete/:_id`                  |
GET           | admin + user  |`/posts/`                               |
GET           | admin + user  |`/posts/userPost/:postedBy`             |
GET           | admin + user  |`/posts/onePost/:_id`                   |
POST          | admin + user  |`/posts/create`                         |{img, describe, postedBy}
PUT           | admin + user  |`/posts/archivePost/:_id`               |{id}
DELETE        | admin + user  |`/posts/delete/:_id`                    |
PUT           | admin + user  |`/posts/update`                         |{id, newdescribe}




## Installation
- Clone this folder locally
- Install all packages using `npm install` command
- Run `npm run dev` in your command line
