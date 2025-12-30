import React, { useState, useEffect } from "react";

const AddPerson = () => {
  const [formData, setFormData] = useState({
    category_id: "",
    name: "",
    education: "",
    dob: "",
    dob_place: "",
    date_of_death: "",
    place_of_death: "",
    short_description: "",
    full_details: "",
    description: "",
    isTrending: "false",
    isNewArrival: "false",
  });

  const [categories, setCategories] = useState([]);
  const [personsImage, setPersonsImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [personMultipleImg, setPersonMultipleImg] = useState([]);

  /* ---------------- FETCH CATEGORIES ---------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:7000/categories");
        const data = await res.json();
        if (data.categories) setCategories(data.categories);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  /* ---------------- HANDLE INPUT ---------------- */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e, type) => {
    if (type === "persons_image") setPersonsImage(e.target.files[0]);
    if (type === "banner_image") setBannerImage(e.target.files[0]);
    if (type === "person_multiple_img")
      setPersonMultipleImg(e.target.files);
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category_id) {
      alert("Please select a category!");
      return;
    }

    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => fd.append(k, v));

    if (personsImage) fd.append("persons_image", personsImage);
    if (bannerImage) fd.append("banner_image", bannerImage);

    for (let i = 0; i < personMultipleImg.length; i++) {
      fd.append("person_multiple_img", personMultipleImg[i]);
    }

    try {
      const res = await fetch("http://localhost:7000/person", {
        method: "POST",
        body: fd,
      });

      const result = await res.json();

      if (result.status) {
        alert("Person added successfully!");
        setFormData({
          category_id: "",
          name: "",
          education: "",
          dob: "",
          dob_place: "",
          date_of_death: "",
          place_of_death: "",
          short_description: "",
          full_details: "",
          description: "",
          isTrending: "false",
          isNewArrival: "false",
        });
      } else {
        alert("Error: " + result.error);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="form-container">
      <h2>Add Person</h2>

      <form onSubmit={handleSubmit}>
        {/* CATEGORY */}
        <label>Category</label>
        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.category_name}
            </option>
          ))}
        </select>

        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
        <input name="education" placeholder="Education" value={formData.education} onChange={handleChange} />

        <label>Date of Birth</label>
        <input type="date" name="dob" value={formData.dob} onChange={handleChange} />

        <input name="dob_place" placeholder="Place of Birth" value={formData.dob_place} onChange={handleChange} />

        <label>Date of Death</label>
        <input type="date" name="date_of_death" value={formData.date_of_death} onChange={handleChange} />

        <input name="place_of_death" placeholder="Place of Death" value={formData.place_of_death} onChange={handleChange} />

        <textarea name="short_description" placeholder="Short Description" value={formData.short_description} onChange={handleChange} />
        <textarea name="full_details" placeholder="Full Details" value={formData.full_details} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />

        <label>Trending?</label>
        <select name="isTrending" value={formData.isTrending} onChange={handleChange}>
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>

        <label>New Arrival?</label>
        <select name="isNewArrival" value={formData.isNewArrival} onChange={handleChange}>
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>

        <label>Person Image</label>
        <input type="file" onChange={(e) => handleFileChange(e, "persons_image")} />

        <label>Banner Image</label>
        <input type="file" onChange={(e) => handleFileChange(e, "banner_image")} />

        <label>Multiple Images</label>
        <input type="file" multiple onChange={(e) => handleFileChange(e, "person_multiple_img")} />

        <button type="submit">Save Person</button>
      </form>
    </div>
  );
};

export default AddPerson;
