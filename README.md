# Gitteacher-Official
A project aiming to tutorialize community github repositories and help you learn step by step. The nice thing is anyone can learn something new and teach something new.

## ---> API --->

## Status Codes

```422``` and following JSON format, IF a request fails any validations:

```JSON
{
  "errors":{
    "body": [
      "can't be empty"
    ]
  }
}
```

```401``` for Unauthorized requests, when a request requires authentication but it isn't provided

```403``` for Forbidden requests, when a request may be valid but the user doesn't have permissions to perform the action

```404``` for Not found requests, when a resource can't be found to fulfill the request

## Endpoints:

### Sign In:

`POST /users/login`

#### Request `Body` : (email, password) ?required

```JSON
{
  "user": {
    "email": "hristoapps@gmail.com",
    "password": "1234"
  }
}
```

#### Response: [User](#users-for-authentication)

### Sign Up:

`POST /users/register`

#### Request `Body` : (email, username, password) ?required

```JSON
{
  "user":{
    "username": "chrisb",
    "email": "hristoapps@gmail.com",
    "password": "12345"
  }
}
```

#### Response: [User](#users-for-authentication)

### Current User

`GET /users/user`

#### Request `Header` : ([Token](#for-protected-endpoints-set-header)) ?required

#### Response: [User](#users-for-authentication)



### Update User

`PUT /users/user`

#### Request `Header` : ([Token](#for-protected-endpoints-set-header)) ?required

#### Request `Body`:

```JSON
{
  "user":{
    "email": "chris.bogoev@gmail.com",
    "bio": "We are made to eat & drink",
    "image": "http://A_NICE_IMAGE_THAT_YOU_WANT_TO_USE.imageurl.com"
  }
}
```

#### Response: [User](#users-for-authentication)

### Get Profile

`GET /profiles/:username`

#### Request `Header` : ([Token](#for-protected-endpoints-set-header)) ?optional

#### Response: [Profile](#profile)


## Sample RESPONSE data:


### User

```JSON
{
  "user": {
    "email": "hristoapps@gmail.com",
    "token": "jwt.token",
    "username": "chrisb",
    "bio": "Do your homework so you can work home..",
    "image": null
  }
}
```

### Profile

```JSON
{
  "profile": {
    "username": "chrisb",
    "bio": "Do your homework so you can work home..",
    "image": "https://avatars2.githubusercontent.com/u/1840777"
  }
}
```


-----------------

#### For protected endpoints set Header:

`Authorization: Token jwt.token`
