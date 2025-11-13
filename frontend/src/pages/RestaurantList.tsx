import React, { useEffect, useState } from "react";
import {
  getRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from "../services/restaurantService";
import { Restaurant, CreateRestaurantRequest, UpdateRestaurantRequest } from "../types/restaurant";
import "../App.css";

const RestaurantList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [newRestaurant, setNewRestaurant] = useState<CreateRestaurantRequest>({
    name: "",
    address: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async (): Promise<void> => {
    try {
      const data = await getRestaurants();
      setRestaurants(data);
    } catch (err) {
      console.error("Gagal ambil data restoran:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      if (editId) {
        await updateRestaurant(editId, newRestaurant as UpdateRestaurantRequest);
      } else {
        await createRestaurant(newRestaurant);
      }
      setNewRestaurant({ name: "", address: "" });
      setEditId(null);
      fetchRestaurants();
    } catch (err) {
      console.error("Gagal simpan restoran:", err);
    }
  };

  const handleEdit = (r: Restaurant): void => {
    setEditId(r.id);
    setNewRestaurant({ name: r.name, address: r.address });
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (window.confirm("Yakin ingin hapus restoran ini?")) {
      try {
        await deleteRestaurant(id);
        fetchRestaurants();
      } catch (err) {
        console.error("Gagal hapus restoran:", err);
      }
    }
  };

  return (
    <div className="container">
      <h1>🏢 Daftar Restoran</h1>

      {/* Form Tambah/Edit Restoran */}
      <form className="order-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nama Restoran"
          value={newRestaurant.name}
          onChange={(e) =>
            setNewRestaurant({ ...newRestaurant, name: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Lokasi"
          value={newRestaurant.address}
          onChange={(e) =>
            setNewRestaurant({ ...newRestaurant, address: e.target.value })
          }
          required
        />
        <button type="submit">
          {editId ? "Simpan Perubahan" : "Tambah Restoran"}
        </button>
      </form>

      {/* Tabel Daftar Restoran */}
      <table className="order-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Lokasi</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.length > 0 ? (
            restaurants.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.name}</td>
                <td>{r.address}</td>
                <td>
                  <button onClick={() => handleEdit(r)}>Edit</button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(r.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="empty">
                Belum ada restoran
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RestaurantList;