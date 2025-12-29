import React, { useState, useEffect } from "react";

const AddPerson = () => {
  const [formData, setFormData] = useState({
    category_id: "",
    name: "", title: "", education: "", dob: "", dob_place: "",
    date_of_death: "", place_of_death: "", affiliation: "",
    short_description: "", full_details: "", description: "",
    isTrending: "false", isNewArrival: "false",
  });
  const [categories, setCategories] = useState([]);
  const [personsImage, setPersonsImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [personMultipleImg, setPersonMultipleImg] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:7000/categories");
        const data = await res.json();
        if (data.categories) setCategories(data.categories);
      } catch (err) { console.error("Error fetching categories:", err); }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e, type) => {
    if (type === "persons_image") setPersonsImage(e.target.files[0]);
    if (type === "banner_image") setBannerImage(e.target.files[0]);
    if (type === "person_multiple_img") setPersonMultipleImg(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category_id) { alert("Please select a category!"); return; }

    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    if (personsImage) data.append("persons_image", personsImage);
    if (bannerImage) data.append("banner_image", bannerImage);
    for (let i = 0; i < personMultipleImg.length; i++) data.append("person_multiple_img", personMultipleImg[i]);

    try {
      const res = await fetch("http://localhost:7000/person", { method: "POST", body: data });
      const result = await res.json();
      if (result.status) {
        alert("Person added successfully!");
        setFormData({ category_id: "", name: "", title: "", education: "", dob: "", dob_place: "", date_of_death: "", place_of_death: "", affiliation: "", short_description: "", full_details: "", description: "", isTrending: "false", isNewArrival: "false" });
      } else alert("Error: " + result.error);
    } catch (err) { console.error("Error:", err); }
  };

  return (
    <div className="form-container">
      <h2>Add Person</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Category</label>
          <select name="category_id" value={formData.category_id} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.category_name || "Unnamed Category"}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Education</label>
          <input type="text" name="education" value={formData.education} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Date of Birth</label>
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Place of Birth</label>
          <input type="text" name="dob_place" value={formData.dob_place} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Short Description</label>
          <textarea name="short_description" value={formData.short_description} onChange={handleChange}></textarea>
        </div>

        <div className="form-group">
          <label>Full Details</label>
          <textarea name="full_details" value={formData.full_details} onChange={handleChange}></textarea>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
        </div>

        <div className="form-group">
          <label>Trending Person?</label>
          <select name="isTrending" value={formData.isTrending} onChange={handleChange}>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        <div className="form-group">
          <label>New Arrival Person?</label>
          <select name="isNewArrival" value={formData.isNewArrival} onChange={handleChange}>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        <div className="form-group">
          <label>Person Image</label>
          <input type="file" onChange={(e) => handleFileChange(e, "persons_image")} />
        </div>

        <div className="form-group">
          <label>Banner Image</label>
          <input type="file" onChange={(e) => handleFileChange(e, "banner_image")} />
        </div>

        <div className="form-group">
          <label>Multiple Images</label>
          <input type="file" multiple onChange={(e) => handleFileChange(e, "person_multiple_img")} />
        </div>

        <button type="submit" className="submit-btn">Save Person</button>
      </form>
    </div>
  );
};

export default AddPerson;
