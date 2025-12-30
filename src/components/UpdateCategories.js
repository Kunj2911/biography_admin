// UpdateCategory.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category_name: "",
    description: "",
  });

  const [icon, setIcon] = useState(null);
  const [image, setImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);

  const [preview, setPreview] = useState({
    icon: "",
    image: "",
    banner_image: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch single category details
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`http://localhost:7000/categories/${id}`);
        const data = await res.json();

        if (data.status && data.category) {
          setFormData({
            category_name: data.category.category_name || "",
            description: data.category.description || "",
          });

          setPreview({
            icon: data.category.icon
              ? `http://localhost:7000/uploads/${data.category.icon}`
              : "",
            image: data.category.image
              ? `http://localhost:7000/uploads/${data.category.image}`
              : "",
            banner_image: data.category.banner_image
              ? `http://localhost:7000/uploads/${data.category.banner_image}`
              : "",
          });
        }
      } catch (err) {
        console.error("Error fetching category:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  // ✅ Handle text input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Handle file input change
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files.length) return;

    if (name === "icon") {
      setIcon(files[0]);
      setPreview({ ...preview, icon: URL.createObjectURL(files[0]) });
    }
    if (name === "image") {
      setImage(files[0]);
      setPreview({ ...preview, image: URL.createObjectURL(files[0]) });
    }
    if (name === "banner_image") {
      setBannerImage(files[0]);
      setPreview({ ...preview, banner_image: URL.createObjectURL(files[0]) });
    }
  };

  // ✅ Handle form submit (PUT update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("category_name", formData.category_name);
    fd.append("description", formData.description);

    if (icon) fd.append("icon", icon);
    if (image) fd.append("image", image);
    if (bannerImage) fd.append("banner_image", bannerImage);

    try {
      const res = await fetch(`http://localhost:7000/categories/${id}`, {
        method: "PUT",
        body: fd,
      });

      const data = await res.json();

      if (data.status) {
        setMessage("✅ Category updated successfully!");
        setTimeout(() => {
          window.location.href = "/categories";
        }, 1500);

      } else {
        setMessage("❌ Failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error updating category:", err);
      setMessage("❌ Error occurred while updating category.");
    }
  };

  if (loading) return <p>Loading category...</p>;

  return (
    <div className="update-category-container">
      <h2>Update Category</h2>
      <form onSubmit={handleSubmit} className="update-form">
        <input
          type="text"
          name="category_name"
          placeholder="Enter Category Name"
          value={formData.category_name}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Enter Description"
          value={formData.description}
          onChange={handleChange}
        />

        <label>Icon:</label>
        {preview.icon && <img src={preview.icon} alt="icon" width="80" />}
        <input type="file" name="icon" accept="image/*" onChange={handleFileChange} />

        <label>Main Image:</label>
        {preview.image && <img src={preview.image} alt="main" width="80" />}
        <input type="file" name="image" accept="image/*" onChange={handleFileChange} />

        <label>Banner Image:</label>
        {preview.banner_image && <img src={preview.banner_image} alt="banner" width="80" />}
        <input type="file" name="banner_image" accept="image/*" onChange={handleFileChange} />

        <button type="submit">Update Category</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdateCategory;
