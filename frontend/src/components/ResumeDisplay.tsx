import React from 'react';
import { User, Briefcase, GraduationCap, Code, Award, X } from 'lucide-react';
import { ResumeData } from '../types';

interface ResumeDisplayProps {
  resume: ResumeData;
  onRemove: () => void;
}

const ResumeDisplay: React.FC<ResumeDisplayProps> = ({ resume, onRemove }) => {
  const { parsed_data } = resume;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span>Resume Information</span>
        </h3>
        <button
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 transition-colors"
          title="Remove resume"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        {(parsed_data.name || parsed_data.email || parsed_data.phone) && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Contact Information</span>
            </h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              {parsed_data.name && (
                <p><strong>Name:</strong> {parsed_data.name}</p>
              )}
              {parsed_data.email && (
                <p><strong>Email:</strong> {parsed_data.email}</p>
              )}
              {parsed_data.phone && (
                <p><strong>Phone:</strong> {parsed_data.phone}</p>
              )}
            </div>
          </div>
        )}

        {/* Summary */}
        {parsed_data.summary && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span>Professional Summary</span>
            </h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">{parsed_data.summary}</p>
            </div>
          </div>
        )}

        {/* Experience */}
        {parsed_data.experience && parsed_data.experience.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
              <Briefcase className="w-4 h-4" />
              <span>Work Experience</span>
            </h4>
            <div className="space-y-3">
              {parsed_data.experience.map((exp, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-gray-800">{exp.position}</h5>
                    <span className="text-sm text-gray-600">{exp.duration}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{exp.company}</p>
                  {exp.description && (
                    <p className="text-gray-700 text-sm">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {parsed_data.education && parsed_data.education.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
              <GraduationCap className="w-4 h-4" />
              <span>Education</span>
            </h4>
            <div className="space-y-3">
              {parsed_data.education.map((edu, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-gray-800">{edu.degree}</h5>
                    <span className="text-sm text-gray-600">{edu.year}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{edu.institution}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {parsed_data.skills && parsed_data.skills.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
              <Code className="w-4 h-4" />
              <span>Skills</span>
            </h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex flex-wrap gap-2">
                {parsed_data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Projects */}
        {parsed_data.projects && parsed_data.projects.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span>Projects</span>
            </h4>
            <div className="space-y-3">
              {parsed_data.projects.map((project, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-800 mb-2">{project.name}</h5>
                  {project.description && (
                    <p className="text-gray-700 text-sm mb-2">{project.description}</p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="bg-secondary-100 text-secondary-800 px-2 py-1 rounded text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-800 text-sm">
          <strong>✨ Personalized Questions:</strong> The AI will now generate interview questions 
          tailored to your experience, skills, and background. This will make your practice 
          sessions more relevant and effective!
        </p>
      </div>
    </div>
  );
};

export default ResumeDisplay;
