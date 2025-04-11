import React, { useState, useEffect } from 'react';
import { XIcon } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { updateEmployee } from '../features/employeeSlice';

// Define CSS styles as JavaScript objects
const modalOverlayStyle = {
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 50,
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
};

const modalContainerStyle = {
  width: '100%',
  maxWidth: '850px',
  margin: '1rem auto',
  border: '1px solid #e4e4e4',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  borderRadius: '20px',
  overflow: 'hidden',
  backgroundColor: 'white',
};

const modalHeaderStyle = {
  width: '100%',
  height: '67px',
  backgroundColor: '#4d007c',
  borderRadius: '20px 20px 0px 0px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingLeft: '1.25rem',
  paddingRight: '1.25rem',
};

const modalTitleStyle = {
  color: 'white',
  textAlign: 'center',
  fontWeight: 600,
};

const closeIconStyle = {
  width: '1.5rem',
  height: '1.5rem',
  color: 'white',
  cursor: 'pointer',
};

const modalContentStyle = {
  padding: '2.5rem',
  marginTop: '1.25rem',
};

const errorTextStyle = {
  marginBottom: '1rem',
  padding: '0.75rem',
  backgroundColor: '#fef2f2',
  color: '#b91c1c',
  borderRadius: '0.375rem',
};

const formStyle = {};

const formGroupStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1.25rem',
};

const inputWrapperStyle = {
  display: 'flex',
  width: 'calc(50% - 0.625rem)',
  alignItems: 'center',
  gap: '0.625rem',
  padding: '0.75rem',
  backgroundColor: 'white',
  borderRadius: '0.5rem',
  border: '1px solid #4d007c',
  minWidth: '240px',
};

const inputStyle = {
  flex: 1,
  backgroundColor: 'white',
  fontSize: '0.875rem',
  color: '#121212',
  '::placeholder': {
    color: '#666',
  },
  outline: 'none',
  border: 'none',
};

const selectStyle = {
  flex: 1,
  backgroundColor: 'white',
  fontSize: '0.875rem',
  color: '#121212',
  '::placeholder': {
    color: '#666',
  },
  outline: 'none',
  border: 'none',
};

const submitButtonStyle = {
  backgroundColor: '#4d007d',
  color: 'white',
  paddingLeft: '1.5rem',
  paddingRight: '1.5rem',
  paddingTop: '0.5rem',
  paddingBottom: '0.5rem',
  borderRadius: '0.375rem',
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: '#3b0060',
  },
};

const submitButtonDisabledStyle = {
  opacity: 0.5,
  cursor: 'not-allowed',
};

const EditEmployee = ({ isOpen, onClose, employee }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    dateOfJoining: '',
    department: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    if (employee && isOpen) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        position: employee.position || '',
        dateOfJoining: employee.dateOfJoining ? new Date(employee.dateOfJoining).toISOString().split('T')[0] : '',
        department: employee.department || '',
      });
    }
  }, [employee, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    setIsSubmitting(true);

    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('email', formData.email);
      form.append('phone', formData.phone);
      form.append('position', formData.position);
      form.append('dateOfJoining', formData.dateOfJoining);
      form.append('department', formData.department);

      await dispatch(updateEmployee({ id: employee._id, data: form })).unwrap();

      onClose();
    } catch (error) {
      console.error('Failed to update employee:', error);
      setError(error.message || 'Failed to update employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = [
    { id: 'name', placeholder: 'Full Name', required: true },
    { id: 'email', placeholder: 'Email Address', required: true, type: 'email' },
    { id: 'phone', placeholder: 'Phone Number', required: true, type: 'tel' },
    {
      id: 'position',
      placeholder: 'Position',
      required: true,
      options: [
        { value: 'All', label: 'Position' },
        { value: 'Intern', label: 'Intern' },
        { value: 'Full Time', label: 'Full Time' },
        { value: 'Junior', label: 'Junior' },
        { value: 'Senior', label: 'Senior' },
        { value: 'Team Lead', label: 'Team Lead' },
      ],
    },
    { id: 'dateOfJoining', placeholder: 'Date of Joining', required: true, type: 'date' },
    { id: 'department', placeholder: 'Department', required: false },
  ];

  if (!isOpen) return null;

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContainerStyle}>
        <div style={modalHeaderStyle}>
          <h2 style={modalTitleStyle}>Edit Employee</h2>
          <XIcon
            style={closeIconStyle}
            onClick={!isSubmitting ? onClose : undefined}
          />
        </div>
        <div style={modalContentStyle}>
          {error && (
            <div style={errorTextStyle}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} style={formStyle}>
            <div style={formGroupStyle}>
              {formFields.map((field) => (
                <div
                  key={field.id}
                  style={inputWrapperStyle}
                >
                  {field.options ? (
                    <select
                      name={field.id}
                      value={formData[field.id]}
                      onChange={handleChange}
                      style={selectStyle}
                      required={field.required}
                      disabled={isSubmitting}
                    >
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type || 'text'}
                      name={field.id}
                      value={formData[field.id]}
                      onChange={handleChange}
                      placeholder={`${field.placeholder}${field.required ? ' *' : ''}`}
                      style={inputStyle}
                      required={field.required}
                      disabled={isSubmitting}
                    />
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
              <button
                type="submit"
                style={{
                  ...submitButtonStyle,
                  ...(isSubmitting ? submitButtonDisabledStyle : {}),
                }}
                disabled={isSubmitting}
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

export default EditEmployee;