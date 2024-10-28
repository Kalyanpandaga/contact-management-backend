# Contact Management System

## Overview

This is a Contact Management System built using Next.js and Prisma. The application allows users to manage their contacts efficiently, including features for registration, contact management, and user authentication.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Running the Backend Server](#running-the-backend-server)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Database Setup](#database-setup)
- [Contributing](#contributing)
- [License](#license)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v14 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Prisma CLI](https://www.prisma.io/docs/getting-started/setup-prisma/install-prisma) (optional for schema generation)
- A PostgreSQL or SQLite database

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Kalyanpandaga/contact-management-system
cd contact-management-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create a .env file
```bash
touch .env
```
 Add the following environment variables in the .env file:

```bash
DATABASE_URL="your_database_url_here"
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password
```

### 4. Run database migrations:

```bash
npx prisma migrate dev --name init
```

## Running the Backend Server
To start the backend server, use the following command:
```bash
npm run dev
```

The server will run on http://localhost:3000.


## Database Schema  Overview
User: Represents the user entity with fields for user management.
Contact: Represents the contacts with fields for name, email, phone number, address, and timezone.
UserOtp: Handles OTP for password recovery.


## API Documentation

### User Endpoints

1. **Register a New User**
   - **Endpoint**: `POST /register`
   - **Description**: Registers a new user with  `name`, `email`, and `password`.
   - **Request Payload**:
     ```json
     {
       "name": "John Doe",
       "email": "johndoe@example.com",
       "password": "Password@123"
     }
     ```
   - **Response**:
      ```json
    {
        message: "user registered successfully. Check email for verification OTP."
    }
     ```

2. **Login**
   - **Endpoint**: `POST /login`
   - **Description**: Authenticates a user and returns an access token and refresh token.
   - **Request Payload**:
     ```json
     {
       "email": "johndoe@example.com",
       "password": "Password@123"
     }
     ```
   - **Response**:
     ```json
     {
       "accessToken": "your_access_token",
       "refreshToken": "your_refresh_token"
     }
     ```

3. **forget password**
   - **Endpoint**: `POST /forget-password`
   - **Description**: Sends an OTP to the user's email for password recovery.
   - **Request Payload**:
     ```json
     {
        "email": "johndoe@example.com"
     }
     ```
   - **Response**:
     ```json
     {
        "message": "OTP sent to email."
     }   
     ```


4. **Reset Password**
   - **Endpoint**: `POST /reset-password`
   - **Description**:Resets the user's password using the OTP.
   - **Request Payload**:
     ```json
     {
        "email": "johndoe@example.com",
        "otp": "123456",
        "newPassword": "NewPassword@123"
     }
     ```
   - **Response**:
     ```json
    {
        "message": "Password reset successfully."
    }
     ```
  

### Contact End Points 

1. **Create Contact**
   - **Endpoint**: `POST /contacts/create`
   - **Description**: Creates a new contact.
   - **Headers**: 
     ```plaintext
     Authorization: Bearer {accessToken}
     ```
   - **Request Payload**:
     ```json
    {
    "name": "Jane Doe",
    "email": "janedoe@example.com",
    "phoneNumber": "9876543210",
    "address": "456 Elm St",
    "timezone": "GMT"
    }
    ```
     


2. **Download Contacts**
   - **Endpoint**: `GET /contacts/download`
   - **Description**:Downloads contacts as a CSV file.
   - **Headers**:
     ```plaintext
     Authorization: Bearer {accessToken}
     ```
   - **Response**:
    return a csv file
     ```

3. **Update Contact**
   - **Endpoint**: `PUT /contacts/update/:id`
   - **Description**: Updates an existing contact.
   - **Headers**: 
     ```plaintext
     Authorization: Bearer {accessToken}
     ```
   - **Request Payload**:
     ```json
    {
    "name": "Jane Doe",
    "email": "janedoe@example.com",
    "phoneNumber": "9876543210",
    "address": "456 Elm St",
    "timezone": "GMT"
    }
    ```


4. **Fetch Contacts**
   - **Endpoint**: `GET /contacts?sortBy=name&sortOrder=asc&offset=0&limit=5'`
   - **Description**: Deletes a contact by ID.
   - **Headers**: 
     ```plaintext
     Authorization: Bearer {accessToken}
     ```
   - **Response**:
     ```json
    {
        "name": "John",
        "email": "johndoe@example.com",
        "timezone": "GMT",
        "from_date": "2024-01-01",
        "to_date": "2024-12-31"
    }
    ```

5. **Update Contact**
   - **Endpoint**: `DELETE /contacts/delete/:id`
   - **Description**: Deletes a contact by ID.
   - **Headers**: 
     ```plaintext
     Authorization: Bearer {accessToken}
     ```
   - **Response**:
     ```json
    {
     "message": "Contact deleted successfully."
    }
    ```
