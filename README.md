# 3900UNSoftWare

BackEnd

## /User

### /User/Login

Login User and get 

#### Post

| **name**        | **intor**          |
| :-------------- | :----------------- |
| usernameoremail | User Name or Email |
| password        | User Password      |

#### Return

| **name**   | **intor**                           |
| :--------- | :---------------------------------- |
| token      | Login Token, Use for other Function |
| *userinfo* | User Info for Login User            |

#### Error

| **Type** | **intor**               |
| :------- | :---------------------- |
| 401      | Email or Password Error |

### /User/Logout

Logout User

#### Post

| **name** | **intor**                           |
| :------- | :---------------------------------- |
| token    | Login Token, Use for other Function |

### /User/Wishlist

get user wishlist

#### Get

| **name** | **intor** |
| :------- | :-------- |
| uid      | User ID   |

#### Return

| **name**      | **intor**          |
| :------------ | :----------------- |
| *movieinfo*[] | List of Movie Info |

#### Error

| **Type** | **intor**     |
| :------- | :------------ |
| 404      | No User Found |

### /User/Wishlist/add

Add WishList

#### Post

| **name** | **intor**   |
| :------- | :---------- |
| token    | Login Token |
| mid      | Movie ID    |

#### Return

| **name** | **intor** |
| :------- | :-------- |
| null     | Success   |

#### Error

| **Type** | **intor**      |
| :------- | :------------- |
| 401      | Error Token    |
| 406      | Already exists |

### /User/Wishlist/remove

Remove WishList

#### Post

| **name** | **intor**   |
| :------- | :---------- |
| token    | Login Token |
| mid      | Movie ID    |

#### Return

| **name** | **intor** |
| :------- | :-------- |
| null     | Success   |

#### Error

| **Type** | **intor**     |
| :------- | :------------ |
| 401      | Error Token   |
| 406      | Do not exists |

### /User/Comment

get User All Move Comment

#### Get

| **name** | **intor** |
| :------- | :-------- |
| Uid      | User ID   |

#### Return

| **name**    | **intor**       |
| :---------- | :-------------- |
| *comment*[] | List of Comment |

#### Error

| **Type** | **intor**     |
| :------- | :------------ |
| 404      | No User Found |

## /Movie

### /Movie/add

User Submit new Movie (Allow Exp>25 User to add)

#### Post

| **name**    | **intor**                          |
| :---------- | :--------------------------------- |
| name        | Movie Name                         |
| intor       | Movie Intor                        |
| info        | Movie detailed information         |
| type        | Movie Type                         |
| tag         | Movie Tag, split by `,`            |
| director    | Movie Director Name                |
| performer   | Movie Performer Name, split by `,` |
| publishdate | Movie Publish Date                 |
| token       | Login User Token                   |

#### Return

| **name**    | **intor**  |
| :---------- | :--------- |
| *movieinfo* | Movie Info |

#### Error

| **Type** | **intor**                             |
| :------- | :------------------------------------ |
| 401      | Error Token or Do not have Enough Exp |

### /Movie/Recommend

Recommend Movie for User

#### Get

| **name** | **intor**                                      |
| :------- | :--------------------------------------------- |
| token    | Login User Token, If Null, Return Random Movie |

#### Return

| **name**      | **intor**           |
| :------------ | :------------------ |
| *movieinfo*[] | Get Movie Info List |

### /Movie/Search

Search Movie

#### Get

| **name**   | **intor**   |
| :--------- | :---------- |
| searchtext | Search Text |

#### Return

| **name**      | **intor**                                    |
| :------------ | :------------------------------------------- |
| *movieinfo*[] | Similar Movie Info List, Order by Similarity |

### /Movie/Info

Get Movie Info

#### Post

| **name** | **intor**                                            |
| :------- | :--------------------------------------------------- |
| Mid      | Movie ID                                             |
| token    | Login User Token, If Null, Return No Ban Movie Score |

#### Return

| **name**    | **intor**  |
| :---------- | :--------- |
| *movieinfo* | Movie Info |

#### Error

| **Type** | **intor**      |
| :------- | :------------- |
| 404      | Movie No Found |

## /Comment

### /Comment/User

Same as[ **/User/Comment** ](https://3900w12a-unsoftware.atlassian.net/wiki/spaces/SD/pages/589825/API+Design?parentProduct=JSW&initialAllowedFeatures=byline-contributors.byline-extensions.page-comments.edit.delete.page-reactions&locale=zh-CN#%2FUser%2FComment)

### /Comment/add

Add a New Comment

#### Post

| **name** | **intor**                  |
| :------- | :------------------------- |
| Mid      | Movie ID                   |
| token    | Login User Token           |
| score    | Score for this Movie (0-5) |
| comment  | Comment for this Move      |

#### Return

| **name**      | **intor**    |
| :------------ | :----------- |
| *commentinfo* | Comment Info |

#### Error

| **Type** | **intor**              |
| :------- | :--------------------- |
| 404      | Movie No Found         |
| 401      | Error Token            |
| 406      | Comment Already exists |

### /Comment/remove

Remove Comment

#### Post

| **name** | **intor**        |
| :------- | :--------------- |
| Cid      | Comment ID       |
| token    | Login User Token |

#### Return

| **name** | **intor**      |
| :------- | :------------- |
| null     | Success Remove |

#### Error

| **Type** | **intor**        |
| :------- | :--------------- |
| 404      | Comment No Found |
| 401      | Error Token      |

### /Comment/List

List All Comment for movie

#### Post

| **name** | **intor**                                     |
| :------- | :-------------------------------------------- |
| Mid      | Movie ID                                      |
| token    | Login User Token, If Null, Return All Comment |

#### Return

| **name**        | **intor**            |
| :-------------- | :------------------- |
| *commentinfo[]* | List of Comment Info |

#### Error

| **Type** | **intor**      |
| :------- | :------------- |
| 404      | Movie No Found |