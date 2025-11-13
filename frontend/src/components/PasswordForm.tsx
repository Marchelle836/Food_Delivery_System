import React, { useState } from "react";
import { UpdatePasswordRequest } from "../types/user";

interface PasswordFormProps {
  userId: number;
  onSubmit: (userId: number, passwordData: UpdatePasswordRequest) => void;
  onCancel: () => void;
}

const PasswordForm: React.FC<PasswordFormProps> = ({ userId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<UpdatePasswordRequest>({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.current_password) {
      newErrors.current_password = "Password saat ini harus diisi";
    }

    if (!formData.new_password) {
      newErrors.new_password = "Password baru harus diisi";
    } else if (formData.new_password.length < 6) {
      newErrors.new_password = "Password minimal 6 karakter";
    }

    if (!formData.confirm_password) {
      newErrors.confirm_password = "Konfirmasi password harus diisi";
    } else if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = "Konfirmasi password tidak cocok";
    }

    if (formData.current_password === formData.new_password) {
      newErrors.new_password = "Password baru harus berbeda dengan password saat ini";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔄 PasswordForm: Starting validation...');
    
    if (validateForm()) {
      console.log('✅ PasswordForm: Validation passed, submitting...');
      console.log('📤 Password data to submit:', {
        userId,
        current_password: '***', // jangan log password sebenarnya
        new_password_length: formData.new_password.length,
        confirm_password_length: formData.confirm_password.length
      });
      
      try {
        await onSubmit(userId, formData);
        console.log('✅ PasswordForm: Submit successful');
      } catch (error: any) {
        console.error('❌ PasswordForm: Submit failed', error);
        console.error('Error details:', error.response?.data);
      }
    } else {
      console.log('❌ PasswordForm: Validation failed', errors);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="password-form">
      <div className="form-group">
        <label htmlFor="current_password">Password Saat Ini:</label>
        <input
          type="password"
          id="current_password"
          name="current_password"
          value={formData.current_password}
          onChange={handleChange}
          className={errors.current_password ? "error" : ""}
        />
        {errors.current_password && (
          <span className="error-text">{errors.current_password}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="new_password">Password Baru:</label>
        <input
          type="password"
          id="new_password"
          name="new_password"
          value={formData.new_password}
          onChange={handleChange}
          className={errors.new_password ? "error" : ""}
        />
        {errors.new_password && (
          <span className="error-text">{errors.new_password}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="confirm_password">Konfirmasi Password Baru:</label>
        <input
          type="password"
          id="confirm_password"
          name="confirm_password"
          value={formData.confirm_password}
          onChange={handleChange}
          className={errors.confirm_password ? "error" : ""}
        />
        {errors.confirm_password && (
          <span className="error-text">{errors.confirm_password}</span>
        )}
      </div>

      <div className="password-requirements">
        <p><strong>Persyaratan Password:</strong></p>
        <ul>
          <li>Minimal 6 karakter</li>
          <li>Harus berbeda dengan password saat ini</li>
        </ul>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          Update Password
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Batal
        </button>
      </div>
    </form>
  );
};

export default PasswordForm;