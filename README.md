<p align="center">
  <a href="https://github.com/mlamine300/task-manager" target="_blank">
    <img src="https://ik.imagekit.io/lamine300/20251121_2230_Task%20Manager%20App%20Banner_remix_01kam52qm6e3mrbb5tq25ndqad.png" alt="Task Manager Banner" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/MERN-Stack-3FA037?style=for-the-badge&logo=javascript&logoColor=white" />
  <img src="https://img.shields.io/badge/React.js-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-Security-blue?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
</p>

<h2 align="center">🚀 Premium Full-Stack Task Manager Application</h2>

<p align="center">
  A powerful, responsive, and secure task manager built using the <strong>MERN stack</strong>.<br />
  Manage tasks, users, and workflows with an elegant UI and robust backend architecture.
</p>

---

## ✨ Key Features

### 🔧 Core Functionality

- Create, edit, delete, and categorize tasks
- Mark tasks as complete or in progress
- Add priorities, due dates, and descriptions
- Secure routes with JWT authentication

### 👤 User Management

- Register + Login
- Protected user data
- Hashed passwords (bcrypt)

### 🧠 Smart Experience

- Smooth UI/UX with React
- Responsive design
- Global state management

### 🔒 Security

- JWT-based authentication
- Secure password hashing
- API route protection

---

## 🧰 Tech Stack

| Layer        | Technology                    |
| ------------ | ----------------------------- |
| **Frontend** | React, Fetch API, Context API |
| **Backend**  | Node.js, Express.js           |
| **Database** | MongoDB, Mongoose             |
| **Security** | JWT, bcrypt                   |
| **Styling**  | CSS / Modern UI               |

---

## 🗂️ Project Structure Overview

    task-manager/
    │
    ├── backend/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── models/
    │   ├── routes/
    │   └── server.js
    │
    ├── frontend/
    │   ├── src/
    │   │   ├── components/
    │   │   ├── pages/
    │   │   ├── context/
    │   │   └── App.js
    │   └── public/
    │
    └── README.md

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repo

    git clone https://github.com/mlamine300/task-manager

### 2️⃣ Install backend

    cd task-manager/backend
    npm install

### 3️⃣ Install frontend

    cd ../frontend
    npm install

### 4️⃣ Environment Variables (`backend/.env`)

    MONGODB_URI=your_mongo_connection_string
    JWT_SECRET=your_secret_key
    PORT=5000
    CLIENT_URL=http://localhost:3000

### 5️⃣ Run the project

#### Backend

    npm run dev

#### Frontend

    npm start

---

## 🚀 Deployment

Deploy using:

- **Vercel** → Frontend\
- **Render / Railway / Heroku** → Backend\
- **MongoDB Atlas** → Database

---

## 🛣️ Roadmap

- [ ] Add drag-and-drop task organization\
- [ ] Add dark/light theme\
- [ ] Add multi-user collaboration\
- [ ] Add activity logs

---

## 👤 Author

**mlamine300**\
🌐 GitHub: https://github.com/mlamine300

---

## 📄 License

MIT License --- free to use, modify, and distribute.
