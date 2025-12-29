import React, { useState, useEffect } from "react";


const Banner = () => {
  const [formData, setFormData] = useState({ type: "person", selected_id: "", is_visiable: true, banner_image: null });
  const [options, setOptions] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        if (formData.type === "none") {
          setOptions([]); setFormData(prev => ({ ...prev, selected_id: "" })); return;
        }

        let url = formData.type === "person" ? "http://localhost:7000/persons" : "http://localhost:7000/categories";
        const res = await fetch(url);
        const data = await res.json();
        setOptions(formData.type === "person" ? data.persons || [] : data.categories || []);
      } catch (err) { console.error("Error fetching options:", err); }
    };
    fetchOptions();
  }, [formData.type]);

  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;
    if (type === "file") setFormData({ ...formData, [name]: files[0] });
    else if (type === "checkbox") setFormData({ ...formData, [name]: checked });
    else setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("type", formData.type);
    if (formData.type !== "none") data.append("selected_id", formData.selected_id);
    data.append("is_visiable", formData.is_visiable);
    if (formData.banner_image) data.append("banner_image", formData.banner_image);

    try {
      const res = await fetch("http://localhost:7000/banners", { method: "POST", body: data });
      if (!res.ok) throw new Error("Failed to create banner");
      const result = await res.json();
      setMessage("✅ Banner created successfully!");
    } catch (err) { console.error(err); setMessage("❌ Error creating banner: " + err.message); }
  };

  return (
    <div className="form-container">
      <h3>Create Banner</h3>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Type:</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="person">Person</option>
            <option value="category">Category</option>
            <option value="none">None</option>
          </select>
        </div>

        {formData.type !== "none" && (
          <div className="form-group">
            <label>{formData.type === "person" ? "Select Person:" : "Select Category:"}</label>
            <select name="selected_id" value={formData.selected_id} onChange={handleChange}>
              <option value="">-- Select --</option>
              {options.map(item => (
                <option key={item._id} value={item._id}>
                  {formData.type === "person" ? item.name : item.category_name || "Unnamed Category"}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Banner Image:</label>
          <input type="file" name="banner_image" accept="image/*" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Visible:</label>
          <input type="checkbox" name="is_visiable" checked={formData.is_visiable} onChange={handleChange} />
        </div>

        <button type="submit" className="submit-btn">Create Banner</button>
      </form>
    </div>
  );
};

export default Banner;
