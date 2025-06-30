# Resume Builder Assignment

A web-based resume editor that lets users upload, edit, and enhance their resumes with a mock AI backend, save and retrieve resume data via a FastAPI backend, and download the final resume as JSON.

## Prerequisites

- **Node.js** v14 or later  
- **npm** (comes with Node.js)  
- **Python** 3.8 or later  
- **pip** (comes with Python)

## Repository Structure



Resume-Builder-Assignment/

![image](https://github.com/user-attachments/assets/42c38b2e-b075-4b2c-9b86-a0398379c10f)


```

> Note: If you moved all frontend files into a `frontend/` folder, update the paths accordingly.

## Environment Variables

Create a `.env` file in the `backend/` folder with the following (if using a real AI service):

```

TOGETHER\_API\_KEY=your\_api\_key\_here

````

If you are only mocking the AI enhancement, you can skip this step.

## Backend Setup

1. Open a terminal and navigate to the `backend/` folder:
   ```bash
   cd Resume-Builder-Assignment/backend
````

2. Create a Python virtual environment:

   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:

   * **Windows**:

     ```bash
     venv\Scripts\activate
     ```
   * **macOS / Linux**:

     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

5. Start the FastAPI server:

   ```bash
   uvicorn main:app --reload --port 8000
   ```

   The API will be available at `http://localhost:8000`.

## Frontend Setup

1. Open a new terminal window and navigate to the project root:

   ```bash
   cd Resume-Builder-Assignment
   ```

2. Install frontend dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   The app will open at `http://localhost:5173` by default.

## Running the Application

1. Ensure the backend is running at `http://localhost:8000`.
2. Ensure the frontend is running at `http://localhost:5173`.
3. Open your browser and go to `http://localhost:5173`.
4. Use the interface to:

   * Upload a PDF or DOCX (mock parsing).
   * Edit resume fields (name, summary, experience, education, skills).
   * Click “Enhance with AI” on any section to receive a mocked enhancement.
   * Save the resume to the backend.
   * Reload or click “Load” to retrieve saved data.
   * Click “Download” to download the resume as `resume.json`.

## Features

* **Upload Resume**
  Accepts `.pdf` and `.docx` files and returns a dummy resume object.

* **Edit Resume**
  Editable fields for:

  * Name
  * Summary
  * Experience (add/remove entries)
  * Education (add/remove entries)
  * Skills (add/remove entries)

* **Mock AI Enhancement**
  “Enhance with AI” button for each section that calls the backend and displays enhanced content.

* **Save & Load**

  * `POST /save-resume` to store resume JSON in memory.
  * `GET /load-resume` to retrieve stored resume JSON.

* **Download JSON**
  Download the current resume as a formatted JSON file.

## API Reference

* **POST `/upload-resume`**
  Uploads a file and returns a dummy resume JSON.
  **Response**:

  ```json
  {
    "resume": { /* dummy fields */ },
    "extracted_text": "..."
  }
  ```

* **POST `/ai-enhance`**
  Enhances a section.
  **Request Body**:

  ```json
  {
    "section": "summary",
    "content": "Experienced developer..."
  }
  ```

  **Response**:

  ```json
  {
    "enhanced_content": "Enhanced: Experienced developer..."
  }
  ```

* **POST `/save-resume`**
  Saves the full resume JSON in memory.
  **Request Body**: Full resume object.
  **Response**: Status message.

* **GET `/load-resume`**
  Returns the saved resume JSON (or a template if none).


