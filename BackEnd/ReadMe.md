# /User

## /User/Register

Register User

### Post

| **name** | **intor**     |
| :------- | :------------ |
| name     | User Name     |
| email    | User Email    |
| password | User Password |

### Return

| **name**   | **intor**                           |
| :--------- | :---------------------------------- |
| token      | Login Token, Use for other Function |
| *userinfo* | User Info for Login User            |

### Error

| **Type** | **intor**            |
| :------- | :------------------- |
| 406      | Email Already exists |

## /User/Login

Login User and get login user info

### Post

| **name**  | **intor**            |
| :-------- | :------------------- |
| idoremail | User Name or User ID |
| password  | User Password        |

### Return

| **name**   | **intor**                           |
| :--------- | :---------------------------------- |
| token      | Login Token, Use for other Function |
| *userinfo* | User Info for Login User            |

### Error

| **Type** | **intor**               |
| :------- | :---------------------- |
| 401      | Email or Password Error |

## /User/Logout

Logout User

### Post

| **name** | **intor**                           |
| :------- | :---------------------------------- |
| token    | Login Token, Use for other Function |

## /User/Info

Get User Info From User id

### Get

| **name** | **intor** |
| :------- | :-------- |
| Uid      | User ID   |

### Return

| **name**   | **intor** |
| :--------- | :-------- |
| *userinfo* | User Info |

### Error

| **Type** | **intor**     |
| :------- | :------------ |
| 404      | User No Found |

## /User/Wishlist/list

get user wishlist

### Get

| **name** | **intor** |
| :------- | :-------- |
| uid      | User ID   |

### Return

| **name**      | **intor**          |
| :------------ | :----------------- |
| *movieinfo*[] | List of Movie Info |

### Error

| **Type** | **intor**     |
| :------- | :------------ |
| 404      | No User Found |

## /User/Wishlist/add

Add WishList

### Post

| **name** | **intor**   |
| :------- | :---------- |
| token    | Login Token |
| mid      | Movie ID    |

### Return

| **name** | **intor** |
| :------- | :-------- |
| null     | Success   |

### Error

| **Type** | **intor**            |
| :------- | :------------------- |
| 401      | Error Token          |
| 404      | No Movie Found       |
| 406      | Movie Already exists |

## /User/Wishlist/remove

Remove WishList

### Post

| **name** | **intor**   |
| :------- | :---------- |
| token    | Login Token |
| mid      | Movie ID    |

### Return

| **name** | **intor** |
| :------- | :-------- |
| null     | Success   |

### Error

| **Type** | **intor**     |
| :------- | :------------ |
| 401      | Error Token   |
| 406      | Do not exists |

## /User/Banlist/add

Add BanList

### Post

| **name** | **intor**   |
| :------- | :---------- |
| token    | Login Token |
| Uid      | User ID     |

### Return

| **name** | **intor** |
| :------- | :-------- |
| null     | Success   |

### Error

| **Type** | **intor**      |
| :------- | :------------- |
| 401      | Error Token    |
| 406      | Already exists |

## /User/Banlist/remove

Remove Banlist

### Post

| **name** | **intor**   |
| :------- | :---------- |
| token    | Login Token |
| Uid      | User ID     |

### Return

| **name** | **intor** |
| :------- | :-------- |
| null     | Success   |

### Error

| **Type** | **intor**     |
| :------- | :------------ |
| 401      | Error Token   |
| 406      | Do not exists |

## /User/Comment

get User All Move Comment

### Get

| **name** | **intor** |
| :------- | :-------- |
| Uid      | User ID   |

### Return

| **name**    | **intor**       |
| :---------- | :-------------- |
| *comment*[] | List of Comment |

### Error

| **Type** | **intor**     |
| :------- | :------------ |
| 404      | No User Found |

## /User/Recommend/add

Set Recommendation for 1000 score

### Post

| **name** | **intor**                   |
| :------- | :-------------------------- |
| token    | Login Token                 |
| tag      | Recommend Tag, split by `,` |

### Return

| **name** | **intor** |
| :------- | :-------- |
| null     | Success   |

### Error

| **Type** | **intor**   |
| :------- | :---------- |
| 401      | Error Token |

## /User/Recommend/Clear

Clear Recommend Model

### Get

| **name** | **intor**   |
| :------- | :---------- |
| token    | Login Token |

### Return

| **name** | **intor** |
| :------- | :-------- |
| null     | Success   |

### Error

| **Type** | **intor**   |
| :------- | :---------- |
| 401      | Error Token |

## /User/JSON [s2]

Get User DIY JSON

### Get

| **name** | **intor**   |
| :------- | :---------- |
| token    | Login Token |

### Return

| **name** | **intor**       |
| :------- | :-------------- |
| *JSON*   | User Store Json |

### Error

| **Type** | **intor**   |
| :------- | :---------- |
| 401      | Error Token |

## /User/JSON [s2]

Set User DIY JSON

### Post

| **name** | **intor**       |
| :------- | :-------------- |
| token    | Login Token     |
| json     | user store JSON |

### Return

| **name** | **intor** |
| :------- | :-------- |
| null     | Success   |

### Error

| **Type** | **intor**   |
| :------- | :---------- |
| 401      | Error Token |

# /Movie

## /Movie/add

User Submit new Movie (Allow Exp>25 User to add)

### Post

| **name**    | **intor**                          |
| :---------- | :--------------------------------- |
| name        | Movie Name                         |
| info        | Movie detailed information         |
| type        | Movie Type                         |
| tag         | Movie Tag, split by `,`            |
| director    | Movie Director Name                |
| performer   | Movie Performer Name, split by `,` |
| publishdate | Movie Publish Date                 |
| token       | Login User Token                   |

### Return

| **name**    | **intor**  |
| :---------- | :--------- |
| *movieinfo* | Movie Info |

### Error

| **Type** | **intor**              |
| :------- | :--------------------- |
| 401      | Error Token            |
| 406      | Do not have Enough Exp |

## /Movie/Recommend [s3]

Recommend Movie for User

### Get

| **name** | **intor**                                  |
| :------- | :----------------------------------------- |
| token    | Login User Token, If Null, No User History |
| Mid      | Movie ID                                   |

### Return

| **name**      | **intor**           |
| :------------ | :------------------ |
| *movieinfo*[] | Get Movie Info List |

### Error

| **Type** | **intor**      |
| :------- | :------------- |
| 404      | Movie No Found |

## /Movie/Search

Search Movie

### Get

| **name**   | **intor**   |
| :--------- | :---------- |
| searchtext | Search Text |

### Return

| **name**      | **intor**                                    |
| :------------ | :------------------------------------------- |
| *movieinfo*[] | Similar Movie Info List, Order by Similarity |

## /Movie/Info

Get Movie Info

### Get

| **name** | **intor**                                            |
| :------- | :--------------------------------------------------- |
| Mid      | Movie ID                                             |
| token    | Login User Token, If Null, Return No Ban Movie Score |

### Return

| **name**    | **intor**  |
| :---------- | :--------- |
| *movieinfo* | Movie Info |

### Error

| **Type** | **intor**      |
| :------- | :------------- |
| 404      | Movie No Found |

## /Movie/ListOrder

List Movie Order By

### Get

| **name** | **intor**                                 |
| :------- | :---------------------------------------- |
| orderby  | MovieName WishListCount PublishDate Score |
| limit    | get How many Movies (int)                 |
| desc     | True: descending  (bool)                  |

### Return

| **name**      | **intor**         |
| :------------ | :---------------- |
| *movieinfo*[] | List of MovieInfo |

### Error

| **Type** | **intor**     |
| :------- | :------------ |
| 404      | No User Found |

# /Comment

## /Comment/User

Same as[ **/User/Comment** ](https://3900w12a-unsoftware.atlassian.net/wiki/spaces/SD/pages/589825/API+Design?parentProduct=JSW&initialAllowedFeatures=byline-contributors.byline-extensions.page-comments.edit.delete.page-reactions&locale=zh-CN#%2FUser%2FComment)

## /Comment/add

Add a New Comment

### Post

| **name** | **intor**                  |
| :------- | :------------------------- |
| Mid      | Movie ID                   |
| token    | Login User Token           |
| score    | Score for this Movie (0-5) |
| comment  | Comment for this Move      |

### Return

| **name**      | **intor**    |
| :------------ | :----------- |
| *commentinfo* | Comment Info |

### Error

| **Type** | **intor**      |
| :------- | :------------- |
| 404      | Movie No Found |
| 401      | Error Token    |

## /Comment/remove

Remove Comment

### Post

| **name** | **intor**        |
| :------- | :--------------- |
| Cid      | Comment ID       |
| token    | Login User Token |

### Return

| **name** | **intor**      |
| :------- | :------------- |
| null     | Success Remove |

### Error

| **Type** | **intor**        |
| :------- | :--------------- |
| 404      | Comment No Found |
| 401      | Error Token      |

## /Comment/Movie

List All Comment for movie

### Post

| **name** | **intor**        |
| :------- | :--------------- |
| Mid      | Movie ID         |
| token    | Login User Token |

### Return

| **name**        | **intor**            |
| :-------------- | :------------------- |
| *commentinfo[]* | List of Comment Info |
| score           | score of the movie   |

### Error

| **Type** | **intor**      |
| :------- | :------------- |
| 404      | Movie No Found |

## /Comment/Like [s2]

Like Common, Note: Server do not know is user like this comment, frontend need record that.

### Post

| **name** | **intor**        |
| :------- | :--------------- |
| Cid      | Comment ID       |
| token    | Login User Token |

### Return

| **name**      | **intor**            |
| :------------ | :------------------- |
| *commentinfo* | List of Comment Info |

### Error

| **Type** | **intor**        |
| :------- | :--------------- |
| 404      | Comment No Found |

## /Comment/DisLike [s2]

disLike Common

### Post

| **name** | **intor**                                     |
| :------- | :-------------------------------------------- |
| Cid      | Comment ID                                    |
| token    | Login User Token, If Null, Return All Comment |

### Return

| **name**      | **intor**            |
| :------------ | :------------------- |
| *commentinfo* | List of Comment Info |

### Error

| **Type** | **intor**        |
| :------- | :--------------- |
| 404      | Comment No Found |

 