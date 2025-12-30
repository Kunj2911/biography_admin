import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, [location.key]); // 👈 REFRESH ON NAVIGATION


  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:7000/categories");
      const data = await res.json();

      console.log("Fetched categories:", data);

      if (data?.status === true && Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };


  // Delete Category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`http://localhost:7000/categories/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.status) {
        alert("Category deleted successfully!");
        setCategories(categories.filter((cat) => (cat._id || cat.id) !== id));
      } else {
        alert("Failed to delete category: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("Error deleting category");
    }
  };

  return (
    <div className="category-list-container">
      {loading ? (
        <p>Loading categories...</p>
      ) : categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <table className="category-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Icon</th>
              <th>Main Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => {
              const id = c._id || c.id; // ✅ safe ID
              return (
                <tr key={id}>
                  <td>{c.category_name || c.name || "N/A"}</td>
                  <td>
                    {c.icon ? (
                      <img
                        src={`http://localhost:7000/uploads/${c.icon}`}
                        alt="icon"
                        width="50"
                      />
                    ) : (
                      "No Icon"
                    )}
                  </td>
                  <td>
                    {c.image ? (
                      <img
                        src={`http://localhost:7000/uploads/${c.image}`}
                        alt="cat"
                        width="50"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(id)}
                    >
                      Delete
                    </button>
                    <button className="update-btn">
                      <Link to={`/update-category/${id}`}>Update</Link>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Category;
