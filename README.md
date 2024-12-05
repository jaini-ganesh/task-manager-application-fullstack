# Task Management Application

A full-stack **Task Management Application** built using **Django (REST API)** for the backend and **React.js** for the frontend. This app allows users to manage their tasks efficiently with features like task creation, editing, deleting, filtering, sorting, and pagination.

---

## Features

- **Authentication**: Session-based authentication to ensure secure access.
- **Task Management**:
  - Add, edit, and delete tasks.
  - Assign priorities (`Low`, `Medium`, `High`) and due dates.
  - Mark tasks as completed or incomplete.
- **Filtering and Sorting**:
  - Filter tasks by status (completed/incomplete).
  - Sort tasks by priority or due date.
- **Pagination**: Paginated task list for improved performance.
- **Dynamic UI**:
  - Interactive and responsive design.
  - Page numbers for easy navigation.

---

## Tech Stack

### Frontend
- **React.js**: UI framework.
- **Axios**: For making API requests.
- **CSS**: For styling.

### Backend
- **Django**: Web framework.
- **Django REST Framework (DRF)**: For creating REST APIs.
- **PostgreSQL**: Database.
- **django-cors-headers**: To enable CORS for API communication.

---

## Installation

### Prerequisites
- **Python**: Version 3.8+
- **Node.js**: Version 14+
- **PostgreSQL**: Installed and configured.

### Backend Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/jaini-ganesh/task-manager-application-fullstack
   cd task-management-app

2. **Create a Virtual Environment:**:
   ```bash
   python -m venv venv
   venv\Scripts\activate

3. **Install Backend Dependencies:**:
   ```bash
   pip install -r requirements.txt

4. **Configure the Database:**:
    - Update the database settings in settings.py with your PostgreSQL credentials.
    ```bash
    python manage.py makemigrations
    python manage.py migrate

5. **Run the Backend Server:**:
   ```bash
   python manage.py runserver

### Frontend Setup 

1. **Navigate to the Frontend Directory:**:
   ```bash
   cd frontend

2. **Install Frontend Dependencies:**:
   ```bash
   npm install

3. **Start the React Development Server:**:
   ```bash
   npm start

### Usage

1. **Run Backend and Frontend:**
    - Start the backend server: python manage.py runserver.
    - Start the frontend server: npm start.

2. **Access the Application:**
    - Open your browser and navigate to:
    ```bash
    http://localhost:3000

3. **Login or Register:**
    - Use the login functionality to authenticate and start managing tasks.

## API Endpoints

The API endpoints are managed by Django REST Framework.

| Endpoint                  | Method | Description               |
|---------------------------|--------|---------------------------|
| `/api/tasks/`             | GET    | List all tasks (paginated)|
| `/api/tasks/`             | POST   | Create a new task         |
| `/api/tasks/<id>/`        | PATCH  | Update a task             |
| `/api/tasks/<id>/`        | DELETE | Delete a task             |


