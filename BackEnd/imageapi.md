## /Image/{MovieName}/{MovieName} [s2]

Get Movie Title Image 

### Get

| **name**  | **intor**  |
| :-------- | :--------- |
| MovieName | Movie Name |

### Return

Movie Title Image

### Error

| **Type** | **intor**                      |
| :------- | :----------------------------- |
| No found | Return no random default image |

## /Image/{MovieName}/{ActorName} [s2]

Get Movie Actor Image

### Get

| **name**  | **intor**        |
| :-------- | :--------------- |
| MovieName | Movie Name       |
| ActorName | Movie Actor Name |

### Return

Actor Image

### Error

| **Type** | **intor**                      |
| :------- | :----------------------------- |
| No found | Return no random default image |

## /Image/User/{Userid} [s2]

Get User Profile Image

### Get

| **name** | **intor** |
| :------- | :-------- |
| User ID  | User ID   |

### Return

User Profile Image

### Error

| **Type** | **intor**                          |
| :------- | :--------------------------------- |
| No found | Return no random image from VUPSIM |

## /UploadImage/User [s2]

**POST:** Upload User Image

### Post

Image File

### URL Params

| **name** | **intor**        |
| :------- | :--------------- |
| token    | Login User Token |

### Return

| **name** | **intor** |
| :------- | :-------- |
| null     | Success   |

### Error

| **Type** | **intor**   |
| :------- | :---------- |
| 401      | Error Token |

 