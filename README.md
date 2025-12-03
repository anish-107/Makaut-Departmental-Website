# **MAKAUT Departmental Website**

This repository was built to collaboratively complete the **PCA-2 Assignment for Web Technology**, where we were required to create a complete **IT Department Website** for MAKAUT.

The project includes a **frontend (React)**, **backend (Flask)**, **MySQL database**, and a fully deployed cloud setup (AWS EC2, RDS, S3).

---

## **Introduction**

1. The repository contains a fully functional web app representing a departmental website for the IT Department.
2. Users can visit the landing page and explore basic information about the department, programs, events, and notices.
3. Role-based login is supported:

   * **Admin** → Manages programs, subjects, teachers, students, events, notices, jobs, schedules.
   * **Teacher** → Views schedules, uploads relevant information, checks subjects assigned.
   * **Student** → Views notices, events, schedules, and job updates.
4. The project is structured to be scalable, following clean architecture and separation of concerns.

---

## **Features**

### **Frontend (React + Vite)**

* Modern UI with responsive design
* Routing using React Router
* Protected routes based on JWT cookies
* Clean dashboard layouts for all roles
* Admin management panels (CRUD)
* Student portal & teacher portal

### **⚙ Backend (Flask)**

* REST API using Flask Blueprint structure
* Cookie-based JWT authentication
* MySQL (pymysql) with helper utilities
* MVC-like separation (routes → services → db layer)
* Secure token blocklist implementation

### **🗄 Database (MySQL)**

* Relational DB with tables:

  * admins
  * teachers
  * students
  * programs
  * subjects
  * events
  * notices
  * schedules
  * job_updates
  * subject_teachers
  * token_blocklist
* Clean foreign key usage
* Cascade deletes for linked data

### **☁ Deployment (AWS)**

* **EC2** for Flask backend
* **RDS** for MySQL database
* **S3** for schedule image uploads
* **Vercel** for frontend hosting

---

## **File Structure**

```plaintext
Makaut-Departmental-Website/
│
├── frontend/               # Public-facing website (React + Vite)
│   └── src/                # Components, pages, hooks, utils
│
├── backend/                # Backend Services (Flask)
│   ├── src/                # DB, routes, auth handlers
│   ├── app.py              # Main backend application
│
├── docs/                   # Extra documentation & design notes
│   ├── api/                # API endpoints explanation
│   ├── db/                 # Schema & SQL scripts
│   ├── frontend/           # UI / layout documentation
│   └── backend/            # Architecture overview
│
├── tests/                  # Test cases (unit & integration)
│
├── .gitignore              # Ignored files and folders
│
├── README.md               # Project documentation (this file)
│
└── LICENSE                 # License of software
```

> For detailed folder-level explanations, open the `README.md` inside each directory.

---

## **Documentation**

Full documentation exists inside the `docs/` directory, including:

API Endpoints
DB Schema & ER Diagram
JWT Authentication Flow
Deployment Guide
Daily Task Logs
Frontend + Backend setup guides

Everything required to understand, run, or contribute to the project is documented here.

---

## **Testing**

> TODO: Add introduction to testing stack
> TODO: Document Testing Library setup for frontend


---

## **Contribution Guide**

Follow these steps if you want to contribute:

### **1. Fork the repo**

### **2. Create a new branch**

```bash
git checkout -b feature-name
```

### **3. Make changes and commit**

```bash
git commit -m "Add: New notice component"
```

### **4. Push to your branch**

```bash
git push origin feature-name
```

### **5. Open a Pull Request**

> Always run `git pull` before starting new changes to avoid merge conflicts.

---

## **Installation & Setup**

### **Backend Setup**

```bash
cd backend
pip install -r requirements.txt
python app.py
```

### **Frontend Setup**

```bash
cd frontend
npm install
npm run dev
```

Update `.env` files on both sides as needed.

---

## **Deployment**

Project deployed on **AWS** using:

* **Amazon RDS** → MySQL database
* **EC2** → Flask backend (Gunicorn + Nginx recommended)
* **S3 Bucket** → Image/file uploads (schedules)
* **Vercel** → Frontend hosting

Deployment steps are fully documented inside:

`docs/deployment/`


---

## **Contact**

If you have questions, suggestions, or want to collaborate:

**[anish.k7644@proton.me](mailto:anish.k7644@proton.me)**
**GitHub:** *anish-107*
Or open an Issue / Pull Request on the repo.

---