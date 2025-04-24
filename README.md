# Demo Credit 



## Description

**Demo-Credit**  Demo Credit is a mobile lending app that requires wallet functionality. This is needed as borrowers need a wallet to receive the loans they have been granted and also send the money for repayments.


## ✨ Features 

## 🔧 Tech Stack

- **Node.js**
- **TypeScript**
- **Express.js**
- **MySQL** 
- **Joi** for input validation
- **Jest** for testing
- **Knex ORM** 

## 🚀 Getting Started

### Prerequisites

- Node.js LTS version
- npm or yarn
- MySQL running locally or via a service

### 1. Clone The Repo

```bash
git clone https://github.com/Kelvin-Teck/demo-credit.git
cd demo-credit
```
### 2. Install the Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a .env file in the root directory with the following:

```env
NODE_ENV=<current_environment> # development or production
PORT=<your_specified_port> 
DB_HOST=<database_host> # if in development - <localhost> production - <your_remote_databse_host>
DB_PORT=<your_database_port> # if in development defaults - 3306, production - <your_remote_database_port> 
DB_USER=<your_database_user>
DB_PASSWORD=<your_database_password>
DB_NAME=<your_database_name>
EMAIL_SERVICE=gmail
EMAIL_HOST=gmail
EMAIL_PORT=587
EMAIL_PASS=<your_email_app_password>
EMAIL_USER=<your_email_address>
ADJUTOR_API_BASE_URL=https://adjutor.lendsqr.com/v2
ADJUTOR_API_KEY=<your_api_key>
```
Make sure your MySQL server is running and the database `your_database_name` exists. You can create it with:

```sql
CREATE DATABASE demo_credit;
```

### 4. Running Database Migrations

```bash
npm run migrate
```
This will set up your tables using Knex.

### 5. Start the Development Server
```bash
npm run dev
```
The server should now be running on http://localhost:`your_specified_port`


