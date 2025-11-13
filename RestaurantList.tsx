import React, { useEffect, useState } from "react";
import {
  getRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from "../services/restaurantService";
import { Restaurant, CreateRestaurantRequest, UpdateRestaurantRequest } from "../types/restaurant";

const RestaurantList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [form, setForm] = useState<CreateRestaurantRequest>({ 
    name: "", 
    location: "" 
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async (): Promise<void> => {
    try {
      const data = await getRestaurants();
      setRestaurants(data);
    } catch (error) {
      console.error("Gagal mengambil data restoran:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      if (editId) {
        await updateRestaurant(editId, form as UpdateRestaurantRequest);
      } else {
        await createRestaurant(form);
      }
      setForm({ name: "", location: "" });
      setEditId(null);
      fetchRestaurants();
    } catch (error) {
      console.error("Gagal menyimpan restoran:", error);
    }
  };

  const handleEdit = (r: Restaurant): void => {
    setEditId(r.id);
    setForm({ name: r.name, location: r.location });
  };

  const handleDelete = async (id: number): Promise<void> => {
    try {
      await deleteRestaurant(id);
      fetchRestaurants();
    } catch (error) {
      console.error("Gagal menghapus restoran:", error);
    }
  };

  return (
    <div>
      <h2>Daftar Restoran</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nama Restoran"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Lokasi"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          required
        />
        <button type="submit">{editId ? "Update" : "Tambah"}</button>
      </form>

      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Lokasi</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.name}</td>
              <td>{r.location}</td>
              <td>
                <button onClick={() => handleEdit(r)}>Edit</button>
                <button onClick={() => handleDelete(r.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RestaurantList;