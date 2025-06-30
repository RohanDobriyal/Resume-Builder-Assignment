import React from 'react';
import { Plus, Trash2, Sparkles, User, FileText, Briefcase, GraduationCap, Wrench } from 'lucide-react';
import { ResumeData, ExperienceItem, EducationItem } from '../types/resume';

interface ResumeFormProps {
  resume: ResumeData;
  onResumeChange: (resume: ResumeData) => void;
}

export const ResumeForm: React.FC<ResumeFormProps> = ({ resume, onResumeChange }) => {
  const handleEnhance = async (section: string, content: string, callback: (enhanced: string) => void) => {
    try {
      const response = await fetch('http://localhost:8000/ai-enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ section, content }),
      });

      if (!response.ok) {
        throw new Error('Enhancement failed');
      }

      const result = await response.json();
      if (result.enhanced_content) {
        callback(result.enhanced_content);
      }
    } catch (error) {
      console.error('Enhancement error:', error);
      alert('Error enhancing content. Please try again.');
    }
  };

  const updateField = (field: keyof ResumeData, value: any) => {
    onResumeChange({ ...resume, [field]: value });
  };

  const addExperience = () => {
    const newExp: ExperienceItem = {
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    updateField('experience', [...resume.experience, newExp]);
  };

  const updateExperience = (index: number, field: keyof ExperienceItem, value: string) => {
    const updated = resume.experience.map((exp, i) =>
      i === index ? { ...exp, [field]: value } : exp
    );
    updateField('experience', updated);
  };

  const removeExperience = (index: number) => {
    updateField('experience', resume.experience.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    const newEdu: EducationItem = {
      school: '',
      degree: '',
      startDate: '',
      endDate: '',
    };
    updateField('education', [...resume.education, newEdu]);
  };

  const updateEducation = (index: number, field: keyof EducationItem, value: string) => {
    const updated = resume.education.map((edu, i) =>
      i === index ? { ...edu, [field]: value } : edu
    );
    updateField('education', updated);
  };

  const removeEducation = (index: number) => {
    updateField('education', resume.education.filter((_, i) => i !== index));
  };

  const addSkill = () => {
    updateField('skills', [...resume.skills, '']);
  };

  const updateSkill = (index: number, value: string) => {
    const updated = resume.skills.map((skill, i) => (i === index ? value : skill));
    updateField('skills', updated);
  };

  const removeSkill = (index: number) => {
    updateField('skills', resume.skills.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-4">
          <User className="text-blue-600" size={20} />
          <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={resume.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FileText className="text-blue-600" size={20} />
            <h2 className="text-xl font-semibold text-gray-800">Professional Summary</h2>
          </div>
          <button
            onClick={() =>
              handleEnhance('summary', resume.summary, (enhanced) =>
                updateField('summary', enhanced)
              )
            }
            className="flex items-center space-x-1 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
          >
            <Sparkles size={16} />
            <span>Enhance with AI</span>
          </button>
        </div>
        <textarea
          value={resume.summary}
          onChange={(e) => updateField('summary', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          placeholder="Write a compelling professional summary..."
        />
      </div>

      {/* Experience */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Briefcase className="text-blue-600" size={20} />
            <h2 className="text-xl font-semibold text-gray-800">Work Experience</h2>
          </div>
          <button
            onClick={addExperience}
            className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
          >
            <Plus size={16} />
            <span>Add Experience</span>
          </button>
        </div>
        <div className="space-y-6">
          {resume.experience.map((exp, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-800">Experience #{index + 1}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      handleEnhance('experience', exp.description, (enhanced) =>
                        updateExperience(index, 'description', enhanced)
                      )
                    }
                    className="flex items-center space-x-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
                  >
                    <Sparkles size={12} />
                    <span>Enhance</span>
                  </button>
                  <button
                    onClick={() => removeExperience(index)}
                    className="flex items-center space-x-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    type="text"
                    value={exp.role}
                    onChange={(e) => updateExperience(index, 'role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Job title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(index, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe your responsibilities and achievements..."
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <GraduationCap className="text-blue-600" size={20} />
            <h2 className="text-xl font-semibold text-gray-800">Education</h2>
          </div>
          <button
            onClick={addEducation}
            className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
          >
            <Plus size={16} />
            <span>Add Education</span>
          </button>
        </div>
        <div className="space-y-6">
          {resume.education.map((edu, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-800">Education #{index + 1}</h3>
                <button
                  onClick={() => removeEducation(index)}
                  className="flex items-center space-x-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) => updateEducation(index, 'school', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Institution name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Degree/Certification"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="month"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="month"
                    value={edu.endDate}
                    onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Wrench className="text-blue-600" size={20} />
            <h2 className="text-xl font-semibold text-gray-800">Skills</h2>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() =>
                handleEnhance('skills', resume.skills.join(', '), (enhanced) =>
                  updateField('skills', enhanced.split(',').map(s => s.trim()).filter(s => s))
                )
              }
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
            >
              <Sparkles size={16} />
              <span>Enhance</span>
            </button>
            <button
              onClick={addSkill}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
            >
              <Plus size={16} />
              <span>Add Skill</span>
            </button>
          </div>
        </div>
        <div className="space-y-3">
          {resume.skills.map((skill, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={skill}
                onChange={(e) => updateSkill(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter a skill"
              />
              <button
                onClick={() => removeSkill(index)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};