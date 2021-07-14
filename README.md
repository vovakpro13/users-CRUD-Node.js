# CRUD API for users
## User

1)  ### Create: `POST /users`
      _Request Body:_
   
       ```json
           {
               "firstName": "Volodymyr",
               "lastName": "Melnyk",
               "address": "Lviv, Pryrodna Street",
               "email": "vovakpro13@gmail.com",
               "password": "Volodya34mel",
               "avatar": "me.jpg"
           }
       ```
    If create success user will get the **email** letter with **activation link**
    
      **Success response example:** 
      
      ```json
      {
          "message": "User is success created!",
          "createdUser": {
              "avatars": [
                  "60ef54d0f499f61894b235e9"
              ],
              "isActivated": false,
              "isDeleted": false,
              "_id": "60ef54c5f499f61894b235e7",
              "firstName": "Volodymyr",
              "lastName": "Melnyk",
              "email": "vovakpro13@gmail.com",
              "...": "..."
          }
      }
      ```


2) ### Update data: `PUT /users/:id`
   
      * ####_Required headers:_ `Authorization` (must have **access token**)   
      
      _Request Body_ (at least must be present a one parameter):
   
      ```json
      {
         "firstName": "newName",
         "lastName": "newLastName",
         "address": "newAddress",
         "email": "newEmail"
      }
      ```

      Success response:
      ```json
      { "message": "User is success updated!" }
      ```

3) ### Get the list of users: `GET /users`

   _Query parameters_:
   - **page** - the page number
   - **perPage** - count of array items in response      
   <br>
   Response example for `/users?page=2&perPage=2`
     
   ```json
      {
       "users": [
           {
               "avatars": [],
               "isActivated": false,
               "_id": "60ef4cff6367c73520fa8742",
               "firstName": "Ostap",
               "...": "..."
           },
           {
               "avatars": [
                   {
                       "_id": "60ef54d0f499f61894b235e9",
                       "user": "60ef54c5f499f61894b235e7",
                       "imageUrl": "users/60ef54c5f499f61894b235e7/images/1f6b4f39-9517-4657-a12b-ef16763d1ede.jpg",
                       "...": "..."
                   }
               ],
               "isActivated": false,
               "_id": "60ef54c5f499f61894b235e7",
               "firstName": "Volodymyr",
              "...": "..."
           }
       ],
   
       "totalCount": 4
   }
   ```

4) ### Get user by id: `GET /users/:id`

   Response example: 

   ```json
      {
          "avatars": [
              {
                  "_id": "60ef54d0f499f61894b235e9",
                  "user": "60ef54c5f499f61894b235e7",
                  "...": "..."
              }
          ],
  
          "isActivated": false,
          "_id": "60ef54c5f499f61894b235e7",
          "firstName": "Volodymyr",
          "...": "..."
      }
   ```

5) ### Delete user: `DELETE /users/:id`
   _Required headers:_ `Authorization`

## Avatar
1) ### Upload new avatar(s): `POST /users/:id/avatar`
   
   * #### _Required headers:_ `Authorization` 
   
   _Form-data_ (max 5 photos):
   
    ```text
        {
            "avatar1": file.jpg,
            "avatar2": me.png
        }
    ```
   Success response:
   ```json
   { "message": "User is success updated !" }
   ```
   
2) ### Set new main avatar: `PATCH /users/:id/avatar/:avatarId`
   _Required headers:_ `Authorization` 

   Response example:
   ```json
   { "mainAvatar": "60ef54d0f499f61894b235e9" }
   ```

3) ### Delete avatar: `DELETE /users/:id/avatar/:avatarId`
   _Required headers:_ `Authorization` 

## Auth

1) ### Activate e-mail: `GET /auth/activate/:link`
   If activate success user must be redirected to the login form

2) ### Sign in: `POST /auth`
   
   _Request Body example_:
   ```json
   {
       "email": "vovakpro13@gmail.com",
       "password": "Volodya34mel"
   } 
   ```
   
   **Success response:**
   ```json
      {
          "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjYyOTk3MjIsImV4cCI6MTYyNjMwMDYyMn0.k5Jff3cqj2D2IoQo1PjKcF1Xf2WjXddpUHhchHpJ7u4",
          "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjYyOTk3MjIsImV4cCI6MTYzMTQ4MzcyMn0.kJ7OpwI3Faz9zicsdfZAkPhFXrdxcBb7iZooyjOFwOw",
          "user": {
              "avatars": "[ ... ]",
              "isActivated": true,
              "_id": "60ef54c5f499f61894b235e7",
              "...": "..."
          }
      }
   ```

2) ### Refresh tokens: `POST /auth/refresh`
   * #### Request header: `Authorization` must to contain a _refresh_ token !

   Success response like the sign in response


3) ### Sign out: `POST /auth/logout`
   * #### Request header: `Authorization` 

3) ### Make a request for password changing : `GET /auth/reset`
   * #### Request header: `Authorization`
   
   User will get a **email** letter with link to `'frontent-host/reset?resetToken=....'`

3) ### Password changing : `POST /auth/reset`
   * #### Request header: `Authorization` must contain the _reset_ token!

   Request body:

   ```json
      { "newPassword":  "Vovaaaaaa23"}
   ```


## Errors


| **Error code** | Message |
| ------------ | ------------- | -- |
| 4041 | Record is not found |
| 4042 | Route is not found |
| 4091 | Email is already exist |
| 4000 | The request body is wrong |
| 4001 | Email or password is wrong |
| 4002 | Email is not activated |
| 4003 | You havn`t access to this endpoint! |
| 4004 | The file has very big size |
| 4005 | The file type is not allowed! |
| 4006 | Reset token is not exist! |
| 4010 | User is not authorized! |
| 5000 | Email template is wrong! |
