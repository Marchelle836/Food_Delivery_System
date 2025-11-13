import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = (): void => {
    logout();
    navigate("/login");
  };

  return (
    <div className="container" style={{ textAlign: "center", marginTop: "50px" }}>
      {/* Header dengan user info dan logout */}
      <div className="home-header">
        <div className="user-info">
          <span>Halo, <strong>{user?.name}</strong>!</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <h1>🍽️ Sistem Pemesanan Restoran</h1>
      <p>Pilih menu di bawah untuk melanjutkan:</p>

      <div style={{ marginTop: "40px", display: "flex", justifyContent: "center", gap: "30px", flexWrap: "wrap" }}>
        <button onClick={() => navigate("/restaurants")} className="nav-btn">
          🏢 Restoran
        </button>
        <button onClick={() => navigate("/menus")} className="nav-btn">
          🍛 Menu
        </button>
        <button onClick={() => navigate("/orders")} className="nav-btn">
          📦 Daftar Pesanan
        </button>
        <button onClick={() => navigate("/users")} className="nav-btn">
          👥 Manajemen User
        </button>
      </div>
    </div>
  );
};

export default HomePage;