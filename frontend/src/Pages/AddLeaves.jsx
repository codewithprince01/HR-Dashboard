"use client";

import React, { useState, useEffect } from "react";
import { XIcon, CalendarIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "../features/employeeSlice";
import { addLeave } from "../features/leaveSlice";

const modalOverlayStyle = {
  position: "fixed",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 50,
  backgroundColor: "rgba(0, 0, 0, 0.2)",
};

const modalContainerStyle = {
  width: "100%",
  maxWidth: "850px",
  margin: "1rem auto",
  border: "1px solid #e4e4e4",
  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  borderRadius: "20px",
  overflow: "hidden",
  backgroundColor: "white",
};

const modalHeaderStyle = {
  width: "100%",
  height: "67px",
  backgroundColor: "#4d007c",
  borderRadius: "20px 20px 0px 0px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingLeft: "1.25rem",
  paddingRight: "1.25rem",
};

const modalTitleStyle = {
  color: "white",
  textAlign: "center",
  fontWeight: 600,
};

const closeIconStyle = {
  width: "1.5rem",
  height: "1.5rem",
  color: "white",
  cursor: "pointer",
};

const modalContentStyle = {
  padding: "2.5rem",
  marginTop: "1.25rem",
};

const errorTextStyle = {
  marginBottom: "1rem",
  padding: "0.75rem",
  backgroundColor: "#fef2f2",
  color: "#b91c1c",
  borderRadius: "0.375rem",
};

const formStyle = {};

const formGroupStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "1.25rem",
};

const inputWrapperStyle = {
  display: "flex",
  width: "calc(50% - 0.625rem)",
  alignItems: "center",
  gap: "0.625rem",
  padding: "0.75rem",
  backgroundColor: "white",
  borderRadius: "0.5rem",
  border: "1px solid #4d007c",
  minWidth: "240px",
};

const inputStyle = {
  flex: 1,
  backgroundColor: "white",
  fontSize: "0.875rem",
  color: "#121212",
  "::placeholder": {
    color: "#666",
  },
  outline: "none",
  border: "none",
  width: "100%", // Added for employeeId input
};

const dropdownListStyle = {
  position: "absolute",
  top: "100%",
  left: 0,
  width: "100%",
  backgroundColor: "white",
  border: "1px solid #d1d5db",
  borderRadius: "0.375rem",
  marginTop: "0.25rem",
  zIndex: 10,
  maxHeight: "10rem",
  overflowY: "auto",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
};

const dropdownItemStyle = {
  padding: "0.5rem 1rem",
  cursor: "pointer",
  fontSize: "0.875rem",
  color: "#374151",
  "&:hover": {
    backgroundColor: "#f3f4f6",
  },
};

const iconStyle = {
  width: "1.25rem",
  height: "1.25rem",
  color: "#4d007c",
};

const submitButtonStyle = {
  backgroundColor: "#4d007d",
  color: "white",
  paddingLeft: "1.5rem",
  paddingRight: "1.5rem",
  paddingTop: "0.5rem",
  paddingBottom: "0.5rem",
  borderRadius: "0.375rem",
  transition: "background-color 0.2s ease",
  "&:hover": {
    backgroundColor: "#3b0060",
  },
};

const submitButtonDisabledStyle = {
  opacity: 0.5,
  cursor: "not-allowed",
};

const AddLeaves = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { employees, status, error } = useSelector((state) => state.employees);
  const [formData, setFormData] = useState({
    employeeId: "",
    designation: "",
    leaveDate: "",
    documents: null,
    reason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (status === "idle") {
      console.log("Fetching employees on initial mount...");
      dispatch(fetchEmployees());
    }
  }, [dispatch, status]);


  useEffect(() => {
    if (isOpen) {
      setFormData({
        employeeId: "",
        designation: "",
        leaveDate: "",
        documents: null,
        reason: "",
      });
      setLocalError(null);
      setSuggestions([]);
      setIsDropdownOpen(false);
      setSearchInput("");
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "employeeId") {
      setSearchInput(value);
      console.log("Typing:", value);
      const filtered = employees.filter((emp) =>
        emp.name.toLowerCase().includes(value.toLowerCase())
      );
      console.log("Filtered suggestions:", filtered);
      setSuggestions(filtered);
      setIsDropdownOpen(value.length > 0);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: files ? files[0] : value,
      }));
    }
  };

  const handleSelectEmployee = (employee) => {
    console.log("Selected employee:", employee);
    setFormData((prev) => ({
      ...prev,
      employeeId: employee._id,
      designation: employee.position,
    }));
    setSearchInput(employee.name);
    setSuggestions([]);
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setIsSubmitting(true);
    console.log("Form data on submit:", formData);

    try {
      const form = new FormData();
      form.append("employeeId", formData.employeeId.toString());
      form.append("designation", formData.designation);
      form.append("leaveDate", formData.leaveDate);
      if (formData.documents) form.append("documents", formData.documents);
      form.append("reason", formData.reason);

      console.log("FormData keys:", Array.from(form.keys()));
      const response = await dispatch(addLeave({ data: form })).unwrap();
      console.log("Add leave response:", response);

      onClose();
    } catch (err) {
      console.error("Failed to add leave:", err);
      setLocalError(err.message || "Failed to add leave");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = [
    {
      id: "employeeId",
      placeholder: "Enter Employee Name",
      required: true,
      type: "text",
    },
    { id: "designation", placeholder: "Designation", required: true },
    { id: "leaveDate", placeholder: "Leave Date", required: true, type: "date" },
    { id: "documents", placeholder: "Documents", type: "file", required: false },
    { id: "reason", placeholder: "Reason", required: true },
  ];

  if (!isOpen) return null;

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContainerStyle}>
        <div style={modalHeaderStyle}>
          <h2 style={modalTitleStyle}>Add New Leave</h2>
          <XIcon
            style={closeIconStyle}
            onClick={!isSubmitting ? onClose : undefined}
          />
        </div>
        <div style={modalContentStyle}>
          {(error || localError) && (
            <div style={errorTextStyle}>
              {error || localError}
            </div>
          )}
          <form onSubmit={handleSubmit} style={formStyle}>
            <div style={formGroupStyle}>
              {formFields.map((field) => (
                <div
                  key={field.id}
                  style={inputWrapperStyle}
                  onClick={() => field.id === "employeeId" && setIsDropdownOpen(true)}
                >
                  {field.id === "employeeId" ? (
                    <div style={{ position: "relative", width: "100%" }}>
                      <input
                        type={field.type || "text"}
                        name={field.id}
                        value={searchInput}
                        onChange={handleChange}
                        placeholder={`${field.placeholder}${field.required ? " *" : ""}`}
                        style={inputStyle}
                        required={field.required}
                        disabled={isSubmitting}
                      />
                      {isDropdownOpen && suggestions.length > 0 && (
                        <ul style={dropdownListStyle}>
                          {suggestions.map((emp) => (
                            <li
                              key={emp._id}
                              style={dropdownItemStyle}
                              onClick={() => handleSelectEmployee(emp)}
                            >
                              {emp.name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <input
                      type={field.type || "text"}
                      name={field.id}
                      value={field.type === "file" ? undefined : formData[field.id]}
                      onChange={handleChange}
                      placeholder={`${field.placeholder}${field.required ? " *" : ""}`}
                      style={inputStyle}
                      required={field.required}
                      disabled={isSubmitting}
                      accept={field.type === "file" ? ".pdf,.doc,.docx" : undefined}
                      {...(field.type === "file" && { multiple: false })}
                    />
                  )}
                  {field.type === "date" && (
                    <CalendarIcon style={iconStyle} />
                  )}
                  {field.type === "file" && (
                    <svg
                      style={iconStyle}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "1.5rem" }}>
              <button
                type="submit"
                style={{
                  ...submitButtonStyle,
                  ...(isSubmitting || !formData.employeeId ? submitButtonDisabledStyle : {}),
                }}
                disabled={isSubmitting || !formData.employeeId}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLeaves;