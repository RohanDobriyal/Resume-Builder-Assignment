from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json
import together
from docx import Document
import PyPDF2
import io

# Initialize FastAPI app
app = FastAPI(title="Resume Editor API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Together AI client
together_client = together.Together(api_key="37713ca7a40a02d22bdcba836ef5ae45b4fd8426083098d7d9630a3c54bfa2cc")

# In-memory storage
stored_resume: Dict[str, Any] = {}

# Pydantic models
class ExperienceItem(BaseModel):
    company: str
    role: str
    startDate: str
    endDate: str
    description: str

class EducationItem(BaseModel):
    school: str
    degree: str
    startDate: str
    endDate: str

class ResumeData(BaseModel):
    name: str
    summary: str
    experience: List[ExperienceItem]
    education: List[EducationItem]
    skills: List[str]

class AIEnhanceRequest(BaseModel):
    section: str
    content: str

def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text from PDF file"""
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        return f"Error extracting PDF: {str(e)}"

def extract_text_from_docx(file_content: bytes) -> str:
    """Extract text from DOCX file"""
    try:
        doc = Document(io.BytesIO(file_content))
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text
    except Exception as e:
        return f"Error extracting DOCX: {str(e)}"

@app.get("/")
async def root():
    return {"message": "Resume Editor API is running"}

@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    """Upload and parse resume file"""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    # Check file type
    if not (file.filename.endswith('.pdf') or file.filename.endswith('.docx')):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")
    
    try:
        content = await file.read()
        
        # Extract text based on file type
        if file.filename.endswith('.pdf'):
            extracted_text = extract_text_from_pdf(content)
        else:
            extracted_text = extract_text_from_docx(content)
        
        # For now, return a dummy parsed resume
        # In production, you would use NLP to parse the extracted text
        dummy_resume = {
            "name": "John Doe",
            "summary": "Experienced software developer with expertise in full-stack development.",
            "experience": [
                {
                    "company": "Tech Corp",
                    "role": "Senior Developer",
                    "startDate": "2020-01",
                    "endDate": "2024-01",
                    "description": "Led development of web applications using React and Node.js"
                }
            ],
            "education": [
                {
                    "school": "University of Technology",
                    "degree": "Bachelor of Computer Science",
                    "startDate": "2016-09",
                    "endDate": "2020-05"
                }
            ],
            "skills": ["JavaScript", "React", "Node.js", "Python", "SQL"]
        }
        
        return {"success": True, "resume": dummy_resume, "extracted_text": extracted_text[:500] + "..."}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.post("/ai-enhance")
async def ai_enhance(request: AIEnhanceRequest):
    """Enhance content using Together AI"""
    try:
        # Create a prompt based on the section and content
        prompts = {
            "summary": f"Enhance this professional summary to be more compelling and achievement-focused: {request.content}",
            "experience": f"Improve this work experience description to highlight achievements and impact: {request.content}",
            "education": f"Enhance this education description to be more professional: {request.content}",
            "skills": f"Organize and enhance this skills list, grouping related skills together: {request.content}",
            "default": f"Improve and enhance this resume content: {request.content}"
        }
        
        prompt = prompts.get(request.section, prompts["default"])
        
        # Call Together AI API
        response = together_client.completions.create(
            model="meta-llama/Llama-2-7b-chat-hf",
            prompt=f"<s>[INST] {prompt} [/INST]",
            max_tokens=300,
            temperature=0.7,
            top_p=0.9,
        )
        
        enhanced_content = response.choices[0].text.strip()
        
        return {"enhanced_content": enhanced_content}
        
    except Exception as e:
        # Fallback to simple enhancement if API fails
        fallback_content = f"Enhanced: {request.content}"
        return {"enhanced_content": fallback_content}

@app.post("/save-resume")
async def save_resume(resume: ResumeData):
    """Save resume data to memory"""
    global stored_resume
    try:
        stored_resume = resume.model_dump()
        return {"success": True, "message": "Resume saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving resume: {str(e)}")

@app.get("/load-resume")
async def load_resume():
    """Load saved resume data"""
    if not stored_resume:
        # Return empty template if no resume is stored
        return {
            "name": "",
            "summary": "",
            "experience": [],
            "education": [],
            "skills": []
        }
    return stored_resume

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)