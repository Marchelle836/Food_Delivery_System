import React, { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserPassword,
} from "../services/userServices";
import { User, CreateUserRequest, UpdateUserRequest, UpdatePasswordRequest } from "../types/user";
import UserForm from "../components/UserForms";
import PasswordForm from "../components/PasswordForm";
import "../App.css";

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [changingPasswordUser, setChangingPasswordUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (): Promise<void> => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Gagal mengambil data users:", error);
      alert("Gagal mengambil data users");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData: CreateUserRequest): Promise<void> => {
    try {
      await createUser(userData);
      setShowForm(false);
      fetchUsers();
      alert("User berhasil dibuat");
    } catch (error: any) {
      console.error("Gagal membuat user:", error);
      alert(`Gagal membuat user: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleUpdateUser = async (userData: UpdateUserRequest): Promise<void> => {
    if (!editingUser) return;
    
    try {
      await updateUser(editingUser.id, userData);
      setEditingUser(null);
      fetchUsers();
      alert("User berhasil diupdate");
    } catch (error: any) {
      console.error("Gagal mengupdate user:", error);
      alert(`Gagal mengupdate user: ${error.response?.data?.message || error.message}`);
    }
  };

const handleUpdatePassword = async (userId: number, passwordData: UpdatePasswordRequest): Promise<void> => {
  console.log('🔄 UserList: Starting password update...');
  console.log('📤 Request details:', {
    userId,
    endpoint: `/users/${userId}/password`,
    hasCurrentPassword: !!passwordData.current_password,
    hasNewPassword: !!passwordData.new_password,
    hasConfirmPassword: !!passwordData.confirm_password
  });

  try {
    console.log('🔐 Checking token before request...');
    const token = localStorage.getItem('token');
    console.log('Token exists:', !!token);
    
    const response = await updateUserPassword(userId, passwordData);
    console.log('✅ UserList: Password update successful', response);
    
    setChangingPasswordUser(null);
    alert("Password berhasil diupdate");
  } catch (error: any) {
    console.error('❌ UserList: Password update failed', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    console.error('Error headers:', error.response?.headers);
    
    const errorMessage = error.response?.data?.message || error.message;
    alert(`Gagal mengupdate password: ${errorMessage}`);
  }
};

  const handleDeleteUser = async (id: number): Promise<void> => {
    if (!window.confirm("Yakin ingin menghapus user ini?")) return;

    try {
      await deleteUser(id);
      fetchUsers();
      alert("User berhasil dihapus");
    } catch (error: any) {
      console.error("Gagal menghapus user:", error);
      alert(`Gagal menghapus user: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEdit = (user: User): void => {
    setEditingUser(user);
  };

  const handleChangePassword = (user: User): void => {
    setChangingPasswordUser(user);
  };

  const handleCancel = (): void => {
    setShowForm(false);
    setEditingUser(null);
    setChangingPasswordUser(null);
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>👥 Manajemen User</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
          disabled={showForm || editingUser !== null || changingPasswordUser !== null}
        >
          + Tambah User
        </button>
      </div>

      {/* Form Tambah/Edit User */}
      {(showForm || editingUser) && (
        <div className="form-modal">
          <div className="form-content">
            <h2>{editingUser ? "Edit User" : "Tambah User Baru"}</h2>
            <UserForm
              user={editingUser || undefined}
              onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
              onCancel={handleCancel}
              isEditing={!!editingUser}
            />
          </div>
        </div>
      )}

      {/* Form Ubah Password */}
      {changingPasswordUser && (
        <div className="form-modal">
          <div className="form-content">
            <h2>Ubah Password</h2>
            <p className="user-info">User: <strong>{changingPasswordUser.name}</strong> ({changingPasswordUser.email})</p>
            <PasswordForm
              userId={changingPasswordUser.id}
              onSubmit={handleUpdatePassword}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}

      {/* Tabel Daftar User */}
      <div className="table-container">
        {loading ? (
          <div className="loading">Memuat data...</div>
        ) : (
          <table className="order-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Telepon</th>
                <th>Alamat</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.address}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEdit(user)}
                          className="btn-edit"
                          disabled={showForm || changingPasswordUser !== null}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleChangePassword(user)}
                          className="btn-change-password"
                          disabled={showForm || editingUser !== null}
                        >
                          Ubah Password
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="btn-delete"
                          disabled={showForm || editingUser !== null || changingPasswordUser !== null}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="empty">
                    Belum ada user
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserList;