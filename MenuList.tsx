import React, { useEffect, useState } from "react";
import {
  getMenusByRestaurant,
  createMenu,
  updateMenu,
  deleteMenu,
} from "../services/menuService";
import { getRestaurants } from "../services/restaurantService";
import { Menu, CreateMenuRequest, UpdateMenuRequest } from "../types/menu";
import { Restaurant } from "../types/restaurant";
import "../App.css";

const MenuList: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>("");
  const [selectedRestaurantName, setSelectedRestaurantName] = useState<string>("");
  const [form, setForm] = useState<CreateMenuRequest>({ 
    name: "", 
    price: "",
    restaurant_id: "" 
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingRestaurants, setLoadingRestaurants] = useState<boolean>(false);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async (): Promise<void> => {
    setLoadingRestaurants(true);
    try {
      const data = await getRestaurants();
      setRestaurants(data);
    } catch (error) {
      console.error("Gagal mengambil data restoran:", error);
      alert("Gagal mengambil data restoran");
    } finally {
      setLoadingRestaurants(false);
    }
  };

  const fetchMenus = async (restaurantId: string): Promise<void> => {
    if (!restaurantId) {
      setMenus([]);
      return;
    }
    
    setLoading(true);
    try {
      const data = await getMenusByRestaurant(restaurantId);
      setMenus(data);
    } catch (error) {
      console.error("Gagal mengambil menu:", error);
      alert("Gagal mengambil data menu");
      setMenus([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const restaurantId = e.target.value;
    const selectedOption = e.target.options[e.target.selectedIndex];
    const restaurantName = selectedOption.text.split(' - ')[0]; // Ambil nama restoran saja
    
    setSelectedRestaurantId(restaurantId);
    setSelectedRestaurantName(restaurantName);
    setForm(prev => ({ ...prev, restaurant_id: restaurantId }));
    setEditId(null);
    
    // Fetch menus untuk restaurant yang dipilih
    if (restaurantId) {
      fetchMenus(restaurantId);
    } else {
      setMenus([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!form.restaurant_id) {
      alert("Pilih restoran terlebih dahulu");
      return;
    }

    if (!form.name || !form.price) {
      alert("Nama menu dan harga harus diisi");
      return;
    }

    try {
      if (editId) {
        await updateMenu(form.restaurant_id, editId, form as UpdateMenuRequest);
        alert("Menu berhasil diupdate");
      } else {
        await createMenu(form.restaurant_id, form);
        alert("Menu berhasil ditambahkan");
      }
      setForm({ name: "", price: "", restaurant_id: selectedRestaurantId });
      setEditId(null);
      // Refresh data menu setelah simpan
      fetchMenus(selectedRestaurantId);
    } catch (error: any) {
      console.error("Gagal menyimpan menu:", error);
      alert(`Gagal menyimpan menu: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEdit = (m: Menu): void => {
    setEditId(m.id);
    setForm({ 
      name: m.name, 
      price: m.price, 
      restaurant_id: m.restaurant_id.toString() 
    });
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (!window.confirm("Yakin ingin menghapus menu ini?")) return;

    try {
      await deleteMenu(selectedRestaurantId, id);
      alert("Menu berhasil dihapus");
      // Refresh data menu setelah hapus
      fetchMenus(selectedRestaurantId);
    } catch (error: any) {
      console.error("Gagal menghapus menu:", error);
      alert(`Gagal menghapus menu: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleCancelEdit = (): void => {
    setEditId(null);
    setForm({ name: "", price: "", restaurant_id: selectedRestaurantId });
  };

  return (
    <div className="container">
      <h1>🍛 Daftar Menu</h1>

      {/* Dropdown Pilih Restoran */}
      <div className="form-group">
        <label htmlFor="restaurant-select">Pilih Restoran:</label>
        <select
          id="restaurant-select"
          value={selectedRestaurantId}
          onChange={handleRestaurantChange}
          className="form-select"
          disabled={loadingRestaurants}
        >
          <option value="">-- Pilih Restoran --</option>
          {restaurants.map((restaurant) => (
            <option key={restaurant.id} value={restaurant.id}>
              {restaurant.name} - {restaurant.location}
            </option>
          ))}
        </select>
        {loadingRestaurants && <div className="loading-small">Memuat data restoran...</div>}
      </div>

      {/* Info Restoran yang Dipilih */}
      {selectedRestaurantId && (
        <div className="restaurant-info">
          <h2>Menu untuk: {selectedRestaurantName}</h2>
        </div>
      )}

      {/* Form Tambah/Edit Menu */}
      {selectedRestaurantId && (
        <form className="order-form" onSubmit={handleSubmit}>
          <h3>{editId ? "Edit Menu" : "Tambah Menu Baru"}</h3>
          <div className="form-inputs">
            <input
              type="text"
              placeholder="Nama Menu"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Harga"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
              min="0"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editId ? "Update Menu" : "Tambah Menu"}
            </button>
            {editId && (
              <button 
                type="button" 
                onClick={handleCancelEdit}
                className="btn-secondary"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      )}

      {/* Tabel Daftar Menu */}
      {selectedRestaurantId && (
        <div className="table-container">
          {loading ? (
            <div className="loading">Memuat data menu...</div>
          ) : (
            <>
              <h3>Daftar Menu ({menus.length} menu)</h3>
              <table className="order-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nama Menu</th>
                    <th>Harga</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {menus.length > 0 ? (
                    menus.map((m) => (
                      <tr key={m.id}>
                        <td>{m.id}</td>
                        <td>{m.name}</td>
                        <td>Rp {Number(m.price).toLocaleString('id-ID')}</td>
                        <td>
                          <button 
                            onClick={() => handleEdit(m)}
                            className="btn-edit"
                            disabled={editId !== null}
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(m.id)}
                            className="btn-delete"
                            disabled={editId !== null}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="empty">
                        Belum ada menu untuk restoran ini
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}

      {!selectedRestaurantId && !loadingRestaurants && (
        <div className="empty-state">
          <p>Silakan pilih restoran untuk melihat dan mengelola menu</p>
        </div>
      )}
    </div>
  );
};

export default MenuList;