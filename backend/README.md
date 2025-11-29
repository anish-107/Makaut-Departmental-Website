# **Backend**

> TODO : Add a bit of information regarding backend.

---

## **Introduction**
> TODO : Basic Introduction to this directory content

---

## **File Structure**
```plaintext
Backend/
│
├── venv/                   # Not available on github (created with `python -m venv venv` on local machine).
│   
├── res/                    # Any resources if needed
│
├── src/                    # Source Code Folder
|      |
|      ├── ....../          # TODO : Add Later
|      |
|      ├── ........../      # TODO : Add Later
|      |            |
|      |            ├── ../ # TODO : Add Later
|      |
|      ├── .............    # TODO : Add Later
|      |
|      ├── .......          # TODO : Add Later 
|      |
|      ├── .......          # TODO : Add Later
|      |
|      ├── .........        # TODO : Add Later
|      |
|      ├── .........        # TODO : Add Later
|      |
|      └── .........        # TODO : Add Later
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
├── app.py                  # Main file to run the backend
|
├── requirements.txt        # Dependencies
|
└── README.md               # This File (Basic Navigation Guide)
```

---
## **Steps to run**
> Follow these steps steps to run the backend on your local device

### **1. Navigate to the Backend Directory**

Open your terminal and move into the backend folder:

```bash
cd backend
```

---

### **2. Create a `.env` File**

Inside the **backend** directory, create a `.env` file.

Add the environment variables exactly as mentioned in the documentation (e.g., API URL, keys, etc.).

Example:

```
HOST="0.0.0.0"
```

> Make sure the variable names match the project requirements.

---

### **4. Install Dependencies**

Run:

```bash
python -m venv venv # On Windows

python3 -m venv venv # On Linux
```

This will create a virtual environment

> In VS code open `command pallete` and then `select interpreter` and select the python interpreter in `venv/Scripts/python`.
> Restart the terminal, if `venv` does not start automatically, run :

```bash
./venv/Scripts/Activate  # On Windows

source venv/bin/activate # On Linux
```

> If `venv` is activated then prompt will have `(venv)`.

To install dependencies run:
```bash
pip install -r requirements.txt
```

---

### **5. Start the Development Server**

Start the backend:

```bash
python app.py # On Windows

python3 app.py # On Linux
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

