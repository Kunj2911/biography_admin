import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UpdateBanner = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    type: "person",
    selected_id: "",
    is_visiable: true,
    banner_image: null,
  });

  const [options, setOptions] = useState([]); // persons or categories
  const [currentImage, setCurrentImage] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch existing banner
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await fetch(`http://localhost:7000/banners/${id}`);
        if (!res.ok) throw new Error("Failed to fetch banner");

        const data = await res.json();
        const banner = data.banner || data;

        setFormData({
          type: banner.type || "person",
          selected_id: banner.selected_id || "",
          is_visiable: banner.is_visiable ?? true,
          banner_image: null,
        });

        setCurrentImage(banner.banner_image || null);
      } catch (err) {
        setMessage("❌ Error fetching banner: " + err.message);
      }
    };

    fetchBanner();
  }, [id]);

  // Fetch persons/categories whenever type changes
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        let url =
          formData.type === "person"
            ? "http://localhost:7000/persons"
            : "http://localhost:7000/categories";

        const res = await fetch(url);
        const data = await res.json();

        if (formData.type === "person") {
          setOptions(data.persons || []);
        } else {
          setOptions(data.categories || []);
        }
      } catch (err) {
        console.error("Error fetching options:", err);
      }
    };

    fetchOptions();
  }, [formData.type]);

  // Handle input change
  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit updated banner
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("type", formData.type);
    data.append("selected_id", formData.selected_id);
    data.append("is_visiable", formData.is_visiable);
    if (formData.banner_image) {
      data.append("banner_image", formData.banner_image);
    }

    try {
      const res = await fetch(`http://localhost:7000/banners/${id}`, {
        method: "PUT",
        body: data,
      });

      if (!res.ok) throw new Error("Failed to update banner");

      const result = await res.json();
      console.log(result);
      setMessage("✅ Banner updated successfully!");
    } catch (err) {
      setMessage("❌ Error updating banner: " + err.message);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px" }}>
      <h3>Update Banner</h3>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        {/* Type */}
        <label>
          Type:
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="person">Person</option>
            <option value="category">Category</option>
          </select>
        </label>
        <br />

        {/* Selected ID dropdown */}
        <label>
          {formData.type === "person" ? "Select Person:" : "Select Category:"}
          <select
            name="selected_id"
            value={formData.selected_id}
            onChange={handleChange}
          >
            <option value="">-- Select --</option>
            {options.map((item) => (
              <option
                key={formData.type === "person" ? item._id : item._id}
                value={formData.type === "person" ? item._id : item._id}
              >
                {formData.type === "person"
                  ? item.name
                  : item.category_name || "Unnamed Category"}
              </option>
            ))}
          </select>
        </label>
        <br />

        {/* Banner Image */}
        <label>
          Current Banner:
          {currentImage && (
            <div>
              <img
                src={`http://localhost:7000/uploads/${currentImage}`}
                alt="Current Banner"
                width="120"
                style={{ display: "block", margin: "10px 0" }}
              />
            </div>
          )}
          <input
            type="file"
            name="banner_image"
            accept="image/*"
            onChange={handleChange}
          />
        </label>
        <br />

        {/* Visible */}
        <label>
          Visible:
          <input
            type="checkbox"
            name="is_visiable"
            checked={formData.is_visiable}
            onChange={handleChange}
          />
        </label>
        <br />

        <button type="submit">Update Banner</button>
      </form>
    </div>
  );
};

export default UpdateBanner;
