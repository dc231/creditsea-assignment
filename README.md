# CreditSea Full-Stack Engineer Assignment

This project is a complete MERN stack solution built for CreditSea, designed to automate the processing of Experian soft credit pull XML files. The application provides a seamless workflow: a user uploads an XML file via a RESTful API, the backend extracts and persists the credit data into MongoDB, and a dynamic React interface renders a detailed, multi-section report. 

---

## Features

* **XML File Upload:** A user-friendly interface to upload Experian XML credit reports.
* **Robust Backend Processing:** An Express.js server handles file validation, parsing, and data extraction.
* **Data Persistence:** Extracted data is structured and stored in a MongoDB database.
* **Dynamic Frontend Reporting:** A clean React UI (built with Vite) that displays a list of all processed reports.
* **Comprehensive Detail View:** Clicking on a report shows a detailed breakdown including:
    * Basic personal details (Name, PAN, Mobile, Credit Score).
    * A full report summary (account totals, balances, etc.).
    * A detailed list of all credit accounts, including full addresses and clear identification of credit cards.
* **RESTful API:** A well-defined API for handling uploads and data retrieval.

---

## Tech Stack

* **Backend**: Node.js, Express.js
* **Frontend**: React (Vite), React Router
* **Database**: MongoDB (with Mongoose)
* **File Handling**: Multer (for uploads), xml2js (for parsing)

---

## Project Structure

The project is organized into two main directories:

-   `/backend`: Contains the Express.js server, API routes, controllers, and database models.
-   `/frontend`: Contains the React application built with Vite, including all components and pages.

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

* Node.js (v18 or later)
* npm
* A MongoDB Atlas account or a local MongoDB instance.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/dc231/creditsea-assignment.git](https://github.com/dc231/creditsea-assignment.git)
    cd creditsea-assignment
    ```

2.  **Setup the Backend:**
    ```bash
    # Navigate to the backend directory
    cd backend

    # Install dependencies
    npm install

    # Create a .env file in the /backend directory
    # and add your variables
    touch .env
    ```
    Your `backend/.env` file should look like this:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    ```

3.  **Setup the Frontend:**
    ```bash
    # Navigate to the frontend directory from the root
    cd frontend

    # Install dependencies
    npm install
    ```

### Running the Application

You will need two separate terminals to run both the backend and frontend servers concurrently.

1.  **Run the Backend Server** (from the `/backend` directory):
    ```bash
    npm run dev
    ```
    The server should now be running on `http://localhost:5000`.

2.  **Run the Frontend Application** (from the `/frontend` directory):
    ```bash
    npm run dev
    ```
    The React app should now be running and will open automatically in your browser at `http://localhost:5173` (or another available port).

---

## API Endpoints

The following RESTful API endpoints were created:

* `POST /api/upload`: Accepts a multipart/form-data request with an XML file (`reportFile`) to be processed.
* `GET /api/reports`: Retrieves a list of all processed reports (containing `name`, `pan`, and `createdAt`).
* `GET /api/reports/:pan`: Retrieves the full details of a single report identified by its PAN.