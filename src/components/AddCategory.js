import React, { useEffect, useState } from "react";

const AddCategory = () => {
  const [formData, setFormData] = useState({
    category_name: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [icon, setIcon] = useState(null);
  const [categoryPhoto, setCategoryPhoto] = useState(null);
  const [multipleImgArray, setMultipleImgArray] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:7000/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e, type) => {
    if (type === "image") setImage(e.target.files[0]);
    if (type === "banner_image") setBannerImage(e.target.files[0]);
    if (type === "icon") setIcon(e.target.files[0]);
    if (type === "category_photo") setCategoryPhoto(e.target.files[0]);
    if (type === "multiple_img_array") setMultipleImgArray([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("category_name", formData.category_name);
    data.append("description", formData.description);
    if (image) data.append("image", image);
    if (bannerImage) data.append("banner_image", bannerImage);
    if (icon) data.append("icon", icon);
    if (categoryPhoto) data.append("category_photo", categoryPhoto);
    multipleImgArray.forEach((file) => data.append("multiple_img_array", file));

    try {
      const res = await fetch("http://localhost:7000/categories", { method: "POST", body: data });
      const result = await res.json();
      if (result.status) {
        setCategories([...categories, result.category]);
        setFormData({ category_name: "", description: "" });
        setImage(null); setBannerImage(null); setIcon(null); setCategoryPhoto(null); setMultipleImgArray([]);
      } else {
        console.error("Upload failed:", result.error);
      }
    } catch (err) { console.error("Error uploading category:", err); }
  };

  return (
    <div className="form-container">
      <h1>Add Category</h1>
      <form className="category-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Category Name:</label>
          <input type="text" name="category_name" value={formData.category_name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Image:</label>
          <input type="file" onChange={(e) => handleFileChange(e, "image")} />
        </div>

        <div className="form-group">
          <label>Banner Image:</label>
          <input type="file" onChange={(e) => handleFileChange(e, "banner_image")} />
        </div>

        <div className="form-group">
          <label>Icon:</label>
          <input type="file" onChange={(e) => handleFileChange(e, "icon")} />
        </div>

        <div className="form-group">
          <label>Category Photo:</label>
          <input type="file" onChange={(e) => handleFileChange(e, "category_photo")} />
        </div>

        <div className="form-group">
          <label>Multiple Images:</label>
          <input type="file" multiple onChange={(e) => handleFileChange(e, "multiple_img_array")} />
        </div>

        <button className="submit-btn" type="submit">Add Category</button>
      </form>
    </div>
  );
};

export default AddCategory;
