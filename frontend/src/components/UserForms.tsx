import React from "react";
import { User, CreateUserRequest, UpdateUserRequest } from "../types/user";

interface UserFormProps {
  user?: User;
  onSubmit: (user: CreateUserRequest | UpdateUserRequest) => void;
  onCancel: () => void;
  isEditing: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel, isEditing }) => {
  const [formData, setFormData] = React.useState<CreateUserRequest>({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    password: "", // Default empty for edit
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Untuk edit, kirim tanpa password
    if (isEditing) {
      const { password, ...updateData } = formData;
      onSubmit(updateData as UpdateUserRequest);
    } else {
      // Untuk create, pastikan password diisi
      if (!formData.password) {
        alert("Password harus diisi untuk user baru");
        return;
      }
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <div className="form-group">
        <label htmlFor="name">Nama:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Telepon:</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="address">Alamat:</label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={3}
          required
        />
      </div>

      {/* Password field hanya untuk create user baru */}
      {!isEditing && (
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required={!isEditing}
            placeholder="Masukkan password untuk user baru"
            minLength={6}
          />
          <small className="form-help">Minimal 6 karakter</small>
        </div>
      )}

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {isEditing ? "Update User" : "Tambah User"}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Batal
        </button>
      </div>
    </form>
  );
};

export default UserForm;