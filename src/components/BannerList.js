import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BannerList = () => {
  const [banners, setBanners] = useState([]);
  const [persons, setPersons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fetch banners
  const fetchBanners = async () => {
    try {
      const res = await fetch("http://localhost:7000/banners");
      if (!res.ok) throw new Error("Failed to fetch banners");
      const data = await res.json();
      setBanners(data.banners || []);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error fetching banners: " + err.message);
    }
  };

  // Fetch persons and categories
  const fetchMetaData = async () => {
    try {
      const [personsRes, categoriesRes] = await Promise.all([
        fetch("http://localhost:7000/persons"),
        fetch("http://localhost:7000/categories"),
      ]);

      const personsData = await personsRes.json();
      const categoriesData = await categoriesRes.json();

      setPersons(personsData.persons || []);
      setCategories(categoriesData.categories || []);
    } catch (err) {
      console.error("Error fetching metadata:", err);
    }
  };

  useEffect(() => {
    fetchBanners();
    fetchMetaData();
  }, []);

  // Get readable name for selected_id
  const getSelectedName = (banner) => {
    if (banner.type === "person") {
      const person = persons.find(
        (p) => p._id === banner.selected_id || p.id === banner.selected_id
      );
      return person ? person.name : banner.selected_id;
    } else if (banner.type === "category") {
      const category = categories.find(
        (c) => c._id === banner.selected_id || c.id === banner.selected_id
      );
      return category ? category.category_name : banner.selected_id;
    }
    return banner.selected_id;
  };

  // Delete banner by ID
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;

    try {
      const res = await fetch(`http://localhost:7000/banners/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete banner");

      setMessage("✅ Banner deleted successfully!");
      fetchBanners();
    } catch (err) {
      console.error(err);
      setMessage("❌ Error deleting banner: " + err.message);
    }
  };

  // Navigate to update form
  const handleUpdate = (id) => {
    navigate(`/update-banner/${id}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>All Banners</h1>
      {message && <p>{message}</p>}

      {banners.length === 0 ? (
        <p>No banners found.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Selected</th>
              <th>Visible</th>
              <th>Banner Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner) => (
              <tr key={banner._id}>
                <td>{banner._id}</td>
                <td>{banner.type}</td>
                <td>{getSelectedName(banner)}</td>
                <td>{banner.is_visiable ? "Yes" : "No"}</td>
                <td>
                  {banner.banner_image && (
                    <img
                      src={`http://localhost:7000/uploads/${banner.banner_image}`}
                      alt="banner"
                      width="80"
                    />
                  )}
                </td>
                <td>
                  <button onClick={() => handleUpdate(banner._id)}>Update</button>
                  <button
                    style={{ marginLeft: "10px", color: "red" }}
                    onClick={() => handleDelete(banner._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BannerList;
