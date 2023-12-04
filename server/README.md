# Boiler Plate with authentication

RestApi Boiler Plate with authentication using expess:

- Express
- Joi
- morgan
- nodemon
- dotenv
- sequelize(mysql)
- cors
- bcryptjs
- nodemailer
- jsonwebtoken
- multer
- moment
- midtrans-client
- crypto-js
- react-otp-input
- redis
- cloudinary

---

## Fiture MVP

- Payment gateaway using midtrans
- Encrypt crutial pyload before store to api
- Registration account using OTP
- Login and register with google
- Redis

---

## Environment Variables

Below is a list of environment variables used in this project:

- `PORT`: Port used to run the server.
- `NODE_ENV`: Node.js environment used (development, production, etc.).
- `BASE_URL`: Base URL for the API.
- `BASE_URL_CLIENT`: Base URL for the client application.
- `ACCESS_TOKEN_SECRET`: Secret key used to generate access tokens.
- `TOKEN_PAYLOAD`: Payload used in token generation.
- `MAIL_ID`: Email address used.
- `MP`: A variable that might be used for specific purposes.
- `MIDTRANS_SERVER_KEY`: Midtrans server key.
- `MIDTRANS_CLIENT_KEY`: Midtrans client key.
- `CLOUD_NAME`: Cloud name for a specific cloud service.
- `API_KEY`: API key used.
- `API_SECRET`: Secret API key.
- `DB_HOST`: Host of the database.
- `DB_PORT`: Port of the database.
- `DB_USERNAME`: Username of the database.
- `DB_PASSWORD`: Password for the database.
- `DB_NAME`: Name of the database used.
- `DB_DIALECT`: Database dialect (e.g., mysql, postgres, etc.).
- `AVATAR_URL_DEFAULT`: Default URL for avatars.

Make sure to set these environment variables before running your application. For development environments, you can use a `.env` file or an appropriate environment variable management system based on the language or framework you are using.

## URL

_Server_

```
http://localhost:4100
```

---

## Global Response

_Response (500 - Internal Server Error)_

```
{
  "status": "Internal Server Error",
  "message": "Something wen't wrong"
}
```

_Response (403) Forbidden_

```
{
    "status": "Forbidden",
    "message": "Token invalid, please login again"
}

```

_Response (401) Unauthorized_

```
{
    "status": "Unauthorized_",
    "message": "Token is required"
}

```

---

## RESTful endpoints

### POST /api/auth/otp

> generate otp for register account

_Request Header_

```
not needed
```

_Request Params_

```
not needed
```

_Request Query_

```
not needed
```

_Request Body_

```
{
    "email":"<encrypted_token_payload>"
}
```

_Response (201)_

```
{
    "message": "Created",
    "data": {
              token:"<token>"
            }
}
```

_Response (400) Bad request_

```
{
    "message": "Bad Request",
    "data": "Email already exists"
}
```

_Response (403) Forbidden_

```
{
    "message": "Forbidden",
    "data": "Invalid payload"
}
```

_Response (400 - Validation Error)_

```
{
    "status": "Validation Failed",
    "message": "\"email\" invalid email input"
}

```

---

### POST /api/auth/verify-otp

> verify otp

_Request Header_

```
not needed
```

_Request Params_

```
not needed
```

_Request Query_

```
not needed
```

_Request Body_

```
{
    "code":"<otp>",
    "token":"<token_step>"
}
```

_Response (200)_

```
{
    "message": "Ok",
    "data": {
              token:"<token>"
            }
}
```

_Response (400) Bad request_

```
{
    "message": "Bad Request",
    "data": "Otp has expired"
}

```

_Response (400) Bad request_

```
{
    "message": "Bad Request",
    "data": "Invalid token"
}

```

_Response (400) Bad request_

```
{
    "message": "Bad Request",
    "data": "Invalid OTP"
}

```

_Response (400 - Validation Error)_

```
{
    "status": "Validation Failed",
    "message": {
                  "number.base": "Code must be a number",
                  "number.integer": "Code must be an integer",
                  "number.min": "Code must be at least six digits long",
                  "number.max": "Code must be at most six digits long",
                  "any.required": "Code is required",
               }
}
```

---

### POST /api/auth/register

> register user

_Request Header_

```
not needed
```

_Request Params_

```
not needed
```

_Request Body_

```
{
    "payload":"<encrypted_token_payload>",
    "token":"<token_step>"
}
```

_Response (201)_

```
{
    "message": "Created",
    "data": "Register Successfully"
}
```

_Response (400)_

```
{
    "status": "Bad request",
    "message": "User already exists"
}
```

_Response (400 - Validation Error)_

```
{
    "status": "Validation Failed",
    "message": "\"email\" invalid email input"
}
```

_Response (403 - Forbidden)_

```
{
    "status": "Forbidden",
    "message": "Invalid token payload"
}
```

---

### POST /api/auth/register/google

> register or login with goole account

_Request Header_

```
not needed
```

_Request Params_

```
not needed
```

_Request Body_

```
{
    "first_name":"<string>",
    "last_name":"<string>",
    "image":"<string_uri>",
    "email":"<string_email>"
}
```

_Response (201)_

```
{
    "message": "Created",
    "data": {
              "token":"<token>"
            }
}
```

_Response (200)_

```
{
    "message": "Ok",
    "data": {
              "token":"<token>"
            }
}
```

_Response (400 - Validation Error)_

```
{
    "status": "Validation Failed",
    "message": "\"email\" invalid email input"
}
```

---

### POST /api/auth/login

> login

_Request Header_

```
not needed
```

_Request Params_

```
not needed
```

_Request Body_

```
{
  "payload":"<encrypted_token_payload>"
}
```

_Response (200)_

```
{
    "message": "Ok",
    "data": {
              "token":"<token>"
            }
}
```

_Response (404)_

```
{
    "status": "Not Found",
    "message": "User Not found Not Found"
}
```

_Response (400)_

```
{
    "status": "Bad request",
    "message": "Invalid Password"
}
```

_Response (400 - Validation Error)_

```
{
    "status": "Validation Failed",
    "message": "\"email\" invalid email input"
}
```

---

### POST /api/auth/forgot-password

> forgot password

_Request Header_

```
not needed
```

_Request Params_

```
not needed
```

_Request Body_

```
{
  "email":"<encrypted_token_email>",
}
```

_Response (200)_

```
{
    "message": "Ok",
    "data": {
              "token":"<token>"
            }
}
```

_Response (404)_

```
{
    "status": "Not Found",
    "message": "User with this email is not found'"
}
```

_Response (400 - Validation Error)_

```
{
    "status": "Validation Failed",
    "message": "\"email\" invalid email input"
}
```

---

### PATCH /api/auth/reset-password/:token

> rset password or change password

_Request Header_

```
not needed
```

_Request Params_

```
/<token>
```

_Request Query_

```
not needed
```

_Request Body_

```
{
    "payload":"<encrypted_token_payload>"
}
```

_Response (200)_

```
{
    "message": "Updated",
    "data": "Password updated sucessfully"
}
```

_Response (403) Forbidden_

```
{
    "status": "Forbidden",
    "message": "Invalid token payload"
}

```

_Response (403) Forbidden_

```
{
    "status": "Forbidden",
    "message": "Invalid token reset password"
}

```

_Response (400) Bad Request_

```
{
    "status": "Bad Request",
    "message": "token expired"
}
```

_Response (400 - Validation Error)_

```
{
    "status": "Validation Failed",
    "message": "\"password\" password and confirm password must match"
}
```

---

### GET /api/premium/account

> get price list premium account

_Request Header_

```
Authorization: `Bearer <token_login>`
```

_Request Params_

```
not needed
```

_Request Query_

```
not needed
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "message": "Ok",
    "data": [
        {
            <data_list_spesific>
        }
    ]
}
```

_Response (404) Not Found_

```
{
    "status": "Not Found",
    "message": "User Notfound"
}
```

---

### GET /api/payment/methods

> get active payment methods

_Request Header_

```
Authorization: `Bearer <token_login>`
```

_Request Params_

```
not needed
```

_Request Query_

```
not needed
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "message": "Ok",
    "data": [
        {
            <data_list_spesific>
        }
    ]
}
```

_Response (404) Not Found_

```
{
    "status": "Not Found",
    "message": "User Notfound"
}
```

---

### GET /api/payment/response/:orderId

> get response payment by order id

_Request Header_

```
Authorization: `Bearer <token_login_user>`
```

_Request Params_

```
/<order_id>
```

_Request Query_

```
not needed
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "message": "Ok",
    "data": {
        <data_response>
    }
}
```

_Response (404) Not Found_

```
{
    "status": "Not Found",
    "message": "User Notfound"
}
```

_Response (404) Not Found_

```
{
    "status": "Not Found",
    "message": "order id not found"
}
```

---

### POST /api/payment

> create payment

_Request Header_

```
Authorization: `Bearer <token_user_login>`
```

_Request Params_

```
not needed
```

_Request Body_

```
{
    "request_midtrans":{
        "payment_type": "bank_transfer",
        "transaction_details": {
            "order_id": "<unique generate id",
            "gross_amount": "<encrypted_token_payload>"
        },
        "bank_transfer":{
            "bank": "<only : "bca", "bri", and, "bni">"
        }
},
    "order_detail":{
            "sku":"<string>"
        }
}
```

_Response (201)_

```
{
    "message": "Created",
    "data": {
        "status_code": "201",
        "status_message": "<message>",
        "transaction_id": "<id_string",
        "order_id": "<id_generate_from_client>",
        "merchant_id": "<merchant_id>",
        "gross_amount": "<number_positive>",
        "currency": "<string>",
        "payment_type": "<string>",
        "transaction_time": "<iso_date>",
        "transaction_status": "<string>",
        "fraud_status": "<string>",
        "va_numbers": [
            {
                "bank": "<string>",
                "va_number": "<string>"
            }
        ],
        "expiry_time": "<iso_date>"
    }
}
```

_Response (400 - Validation Error)_

```
{
    "status": "Validation Failed",
    "message": "\"email\" invalid email input"
}
```

_Response (404) Not Found_

```
{
    "status": "Not Found",
    "message": "User Not found"
}
```

_Response (404) Not Found_

```
{
    "status": "Not Found",
    "message": "Packet Not found"
}
```

---

### POST /api/payment/notification

> post call back notification from midrans

_Request Header_

```
not needed
```

_Request Params_

```
not needed
```

_Request Body_

```
{
        "status_code": "<string>",
        "status_message": "<message>",
        "transaction_id": "<id_string",
        "order_id": "<id_generate_from_client>",
        "merchant_id": "<merchant_id>",
        "gross_amount": "<number_positive>",
        "currency": "<string>",
        "payment_type": "<string>",
        "transaction_time": "<iso_date>",
        "transaction_status": "<string>",
        "fraud_status": "<string>",
        "va_numbers": [
            {
                "bank": "<string>",
                "va_number": "<string>"
            }
        ],
        "expiry_time": "<iso_date>"
}
```

_Response (400 - Validation Error)_

```
{
    "status": "Validation Failed",
    "message": "\"email\" invalid email input"
}
```

_Response (200) global success_

```
{
    "message": "Ok",
    "data": "Create payment successfully"
}
```

_Response (200) cancel_

```
{
    "message": "Ok",
    "data": "Order status updated to cancel"
}
```

_Response (200) expire_

```
{
    "message": "Ok",
    "data": "Order status updated to expire"
}
```

_Response (200) paid_

```
{
    "message": "Ok",
    "data": "Order status updated to paid"
}
```

---

### GET /api/user/profile

> get user profile

_Request Header_

```
Authorization: `Bearer <token_login>`
```

_Request Params_

```
not needed
```

_Request Query_

```
not needed
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "message": "Ok",
    "data": {
        <detail_user>
    }
}
```

_Response (404) Not Found_

```
{
    "status": "Not Found",
    "message": "User Notfound"
}
```

---

### GET /api/video-posts?page=1&limit=10&category=1&search=test

> get all video and query

_Request Header_

```
not needed
```

_Request Params_

```
not needed
```

_Request Query_

```
?page=<number_of_page>
?limit=<limit_show_data>
?category=<category_id>
?search=<search_by_title>
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "message": "Ok",
    "data": {
        "count": <number>,
        "results": [
            {
               <details_video>
            }
        ]
    }
}
```

---

### GET /api/video-posts/my-video

> get user own videos

_Request Header_

```
Authorization: `Bearer <token_login>`
```

_Request Params_

```
not needed
```

_Request Query_

```
not needed
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "message": "Ok",
    "data": [
        {
            <data_list_spesific>
        }
    ]
}
```

---

### GET /api/video-posts/:id

> get video detail

_Request Header_

```
not needed
```

_Request Params_

```
<id>
```

_Request Query_

```
not needed
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "message": "Ok",
    "data": [
        {
            <data_list_spesific>
        }
    ]
}
```

---

### POST /api/video-posts

> Post video

_Request Header_

```
Authorization: `Bearer <token_login>`
```

_Request Params_

```
not needed
```

_Request Query_

```
not needed
```

_Request Body_

```
    "title":"<title>",
    "description":"<description>",
    "for_kids":<boolean>,
    "category_id":<category_id>,
    "visibility":<boolean>,
    "image":<file>,
    "video":<file>,

```

_Response (201)_

```
{
    "status": "Created",
    "message": "Video Success Upload",
}
```

_Response (400) Validation Failed_

```
{
    "status": "Validation Failed",
    "message": "Thumbnail Required"
}
```

_Response (400) Validation Failed_

```
{
    "status": "Validation Failed",
    "message": "Video Required"
}
```

_Response (400) Validation Failed_

```
{
    "status": "Validation Failed",
    "message": "Validate Joi"
}
```
_Response (500) Failed Upload_

```
{
    "status": "Upload Failed",
    "message": "Error uploading files to Cloudinary"
}
```

---

### PUT /api/video-posts/:id

> Edit video

_Request Header_

```
Authorization: `Bearer <token_login>`
```

_Request Params_

```
<id>
```

_Request Query_

```
not needed
```

_Request Body_

```
    "title":"<title>",
    "description":"<description>",
    "for_kids":<boolean>,
    "category_id":<category_id>,
    "visibility":<boolean>,
    "image":<file>,

```

_Response (200)_

```
{
    "status": "Updated",
    "message": "Video Updated Successfully",
}
```

_Response (400) Validation Failed_

```
{
    "status": "Validation Failed",
    "message": "Validate Joi"
}
```

_Response (403) Not authorized_

```
{
    "status": "Forbidden",
    "message": "You are not authorized to edit this video"
}
```

_Response (404) Not found_

```
{
    "status": "Not Found",
    "message": "Video Post Not Found"
}
```

_Response (500) Failed Upload_

```
{
    "status": "Upload Failed",
    "message": "Error uploading files to Cloudinary"
}
```

---

### DELETE /api/video-posts/:id

> Delete video

_Request Header_

```
Authorization: `Bearer <token_login>`
```

_Request Params_

```
<id>
```

_Request Query_

```
not needed
```

_Request Body_

```
    "title":"<title>",
    "description":"<description>",
    "for_kids":<boolean>,
    "category_id":<category_id>,
    "visibility":<boolean>,
    "image":<file>,

```

_Response (200)_

```
{
    "status": "Deleted",
    "message": "Video Deleted Successfully",
}
```

_Response (400) Validation Failed_

```
{
    "status": "Validation Failed",
    "message": "Validate Joi"
}
```

_Response (403) Not authorized_

```
{
    "status": "Forbidden",
    "message": "You are not authorized to edit this video"
}
```

_Response (404) Not found_

```
{
    "status": "Not Found",
    "message": "Video Post Not Found"
}
```

---

### GET /api/categories-video

> get categories

_Request Header_

```
not needed
```

_Request Params_

```
not needed
```

_Request Query_

```
not needed
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "message": "Ok",
    "data": [
        {
            <data_list_spesific>
        }
    ]
}
```

---

### POST /api/categories-video

> Create Category

_Request Header_

```
Authorization: `Bearer <token_admin>`
```

_Request Params_

```
not needed
```

_Request Query_

```
not needed
```

_Request Body_

```
    "name":"<name>",

```

_Response (201)_

```
{
    "status": "Created",
    "message": "Category Created",
}
```

_Response (400) Validation Failed_

```
{
    "status": "Validation Failed",
    "message": "Validate Joi"
}
```

---