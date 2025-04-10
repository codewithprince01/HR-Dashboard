import React, { useState } from 'react';
import { DownloadIcon, XIcon } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addCandidate } from '../../features/candidateSlice';

const AddCandidate = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    resume: null,
    declaration: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      resume: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.declaration) {
      setError('Please accept the declaration');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('email', formData.email);
      form.append('phone', formData.phone);
      form.append('position', formData.position);
      form.append('experience', formData.experience);
      if (formData.resume) {
        form.append('resume', formData.resume);
      }
      form.append('declaration', formData.declaration);

      await dispatch(addCandidate(form)).unwrap();
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        position: '',
        experience: '',
        resume: null,
        declaration: false,
      });
      
      onClose();
    } catch (error) {
      console.error('Failed to add candidate:', error);
      setError(error.message || 'Failed to add candidate');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = [
    { id: 'name', placeholder: 'Full Name', required: true },
    { id: 'email', placeholder: 'Email Address', required: true, type: 'email' },
    { id: 'phone', placeholder: 'Phone Number', required: true, type: 'tel' },
    { id: 'position', placeholder: 'Position', required: true },
    { id: 'experience', placeholder: 'Experience', required: true },
    { id: 'resume', placeholder: 'Upload Resume', required: true, isFile: true },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20">
      <div className="w-full max-w-[850px] mx-auto my-8 border border-solid border-[#e4e4e4] shadow-form-pop-up-shadow rounded-[20px] overflow-hidden bg-white">
        <div className="w-full h-[67px] bg-[#4d007c] rounded-[20px_20px_0px_0px] flex items-center justify-between px-5">
          <h2 className="text-white text-center font-semibold">Add New Candidate</h2>
          <XIcon 
            className="w-6 h-6 text-white cursor-pointer" 
            onClick={!isSubmitting ? onClose : undefined}
          />
        </div>
        <div className="p-10 mt-5">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="flex flex-wrap gap-5">
              {formFields.map((field, index) => (
                <div
                  key={field.id}
                  className={`flex w-[calc(50%-10px)] items-center gap-2.5 p-3 bg-white rounded-2xl border border-solid border-[#4d007c] ${
                    index === formFields.length - 1 ? 'col-span-2' : ''
                  }`}
                  style={{ minWidth: '240px' }}
                >
                  {field.isFile ? (
                    <>
                      <label className="flex-1 flex items-center gap-2 cursor-pointer">
                        <span className="text-sm text-[#121212]">
                          {formData.resume?.name || `${field.placeholder}${field.required ? ' *' : ''}`}
                        </span>
                        <input
                          type="file"
                          name={field.id}
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          required={field.required}
                          disabled={isSubmitting}
                        />
                      </label>
                      <DownloadIcon className="w-5 h-5 text-[#4d007c]" />
                    </>
                  ) : (
                    <input
                      type={field.type || 'text'}
                      name={field.id}
                      value={formData[field.id]}
                      onChange={handleChange}
                      placeholder={`${field.placeholder}${field.required ? ' *' : ''}`}
                      className="flex-1 bg-white text-sm text-[#121212] placeholder:text-[#666] outline-none border-none"
                      required={field.required}
                      disabled={isSubmitting}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-start gap-4">
              <input
                type="checkbox"
                id="declaration"
                name="declaration"
                checked={formData.declaration}
                onChange={handleChange}
                className="mt-1 h-4 w-4 text-[#4d007c] focus:ring-[#4d007c] border-gray-300 rounded"
                disabled={isSubmitting}
              />
              <label htmlFor="declaration" className="text-dark-grey text-sm">
                I hereby declare that the above information is true to the best of my knowledge and belief
              </label>
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className={`bg-[#4d007d] text-white px-6 py-2 rounded-md hover:bg-[#3b0060] transition-colors ${
                  !formData.declaration || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={!formData.declaration || isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCandidate;