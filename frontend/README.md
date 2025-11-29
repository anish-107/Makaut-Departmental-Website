# **Frontend**
> TODO : Add a bit of information regarding frontend.

---

## **Introduction**
> TODO : Basic Control Flow and Data Flow

---

## **File Structure**
```plaintext
Frontend/
│
├── node_modules/           # Not available on github (created with `npm install` on local machine).
│   
├── public/                 # Public assets and static files like images and videos (anything here will be available to all)
│
├── src/                    # Source Code Folder
|      |
|      ├── assets/          # Static assets images, videos but this won't be available to all
|      |
|      ├── components/      # Reusable Components
|      |            |
|      |            ├── ui/ # Shadcn Components
|      |
|      ├── lib/utils.js     # Created by shadcn
|      |
|      ├── pages/           # Different Pages for the website 
|      |
|      ├── App.css          # CSS File for App.jsx
|      |
|      ├── App.jsx          # File that will be rendered in main.jsx
|      |
|      ├── index.css        # Base Styles
|      |
|      └── main.jsx         # File that will be rendered in index.html
|
|
├── scripts/                # Scripts to automate the git & github tasks
|
├── .env                    # Not available on github (use .env.example file as a refernce to build the .env on local environment)
│
├── .env.example            # Example to create your own .env
|
├── .gitignore              # List of files to ignore from this directory
|
├── components.json         # Created by shadcn
|
├── eslint.config.js        # Linting Rules (Code Quality)
|
├── index.html              # Base HTML Entry Point
|
├── jsconfig.json           # Javascript config file
|
├── package-lock.json       # Locked Dependencies with their versions (generated/update automatically with `npm install`)
|
├── package.json            # Dependencies
|
├── README.md               # This file (for basic navigation)
|
└── vite.config.js          # Vite Configurations
```

---
## **Steps to run**
> Follow these steps steps to run the frontend on your local device

### **1. Navigate to the Frontend Directory**

Open your terminal and move into the frontend folder:

```bash
cd frontend
```

---

### **2. Create a `.env` File**

Inside the **frontend** directory, create a `.env` file.

Add the environment variables exactly as mentioned in the documentation (e.g., API URL, keys, etc.).

Example:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

> Make sure the variable names match the project requirements.

---

### **3. Start the Backend**

Before running the frontend, ensure the backend is running properly.

Refer to the **backend documentation** for setup instructions.

---

### **4. Install Dependencies**

Run:

```bash
npm install
```

This will install all required Node modules.

---

### **5. Start the Development Server**

Start the frontend:

```bash
npm run dev
```

Your app should now be available on:

```
http://localhost:PORT   # PORT is mentioned in .env
```

---

## **Steps to Contribute**

> Follow the below steps to contribute.

### **1. Fork the Repository**

Click on the **Fork** button on GitHub to create your own copy of the project.

---

### **2. Clone Your Fork**

Clone it to your local machine:

```bash
git clone <your-fork-url>
cd <project-folder>
```

---

### **3. Fetch the Latest Changes**

Before creating your branch, sync your fork with the upstream repository:

```bash
git remote add upstream <original-repo-url>
git pull upstream main
```

---

### **4. Create a New Branch**

Always create a separate branch for your feature or fix:

```bash
git checkout -b feature/<your-feature-name>
```

---

### **5. Make Your Changes**

Edit the code, add files, fix bugs—whatever your contribution is.

---

### **6. Commit and Push**

```bash
git add .
git commit -m "Add: <meaningful commit message>"
git push origin feature/<your-feature-name>
```

---

### **7. Create a Pull Request**

Go to your GitHub fork → click **"Compare & Pull Request"**.

Add a description explaining your changes and submit the PR.

---

### **8. Done!**

Your contribution will be reviewed and merged after approval.

---

## Using Scripts to Automate Tasks

> **Use `.ps1` scripts if you're on Windows, and `.sh` scripts if you're on Linux/macOS.**
> All scripts are located in the `scripts/` folder.

These scripts help you quickly set up, run, and push changes without needing to type long commands.

---

### **Steps to Use the Automation Scripts**

1. **Initialize your project**
   Run the start script to fetch the latest code and sync your repository:

   * Linux/macOS:

     ```bash
     ./scripts/start.sh
     ```
   * Windows:

     ```powershell
     powershell -ExecutionPolicy Bypass -File .\scripts\start.ps1
     ```

2. **Install dependencies & run the frontend**
   Use the setup script to create `.env` (if missing) and install node modules:

   * Linux/macOS:

     ```bash
     ./scripts/setup.sh
     ```
   * Windows:

     ```powershell
     powershell -ExecutionPolicy Bypass -File .\scripts\setup.ps1
     ```

   After this, start the frontend normally:

   ```bash
   npm run dev
   ```

3. **Push your changes to GitHub**
   Use the push script to stage, commit, and push your work:

   * Linux/macOS:

     ```bash
     ./scripts/push.sh
     ```
   * Windows:

     ```powershell
     powershell -ExecutionPolicy Bypass -File .\scripts\push.ps1
     ```

4. **Create a Pull Request**
   After pushing your branch:

   * Go to your GitHub fork
   * Click **“Compare & Pull Request”**
   * Submit your PR to the main repository

---
