import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdatePerson = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category_id: "",
    name: "",
    education: "",
    title: "",
    dob: "",
    dob_place: "",
    date_of_death: "",
    place_of_death: "",
    affiliation: "",
    short_description: "",
    description: "",
  });

  const [categories, setCategories] = useState([]);
  const [persons_image, setPersonsImage] = useState(null);
  const [person_multiple_img, setPersonMultipleImg] = useState([]);
  const [message, setMessage] = useState("");

  /* ---------------- FETCH CATEGORIES ---------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:7000/categories");
        const data = await res.json();
        if (data.status && data.categories) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  /* ---------------- FETCH PERSON (OLD DATA) ---------------- */
  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const res = await fetch(`http://localhost:7000/persons/${id}`);
        const data = await res.json();

        if (data.status && data.person) {
          const p = data.person;

          setFormData({
            category_id: p.category_id?._id || "",
            name: p.name || "",
            education: p.education || "",
            title: p.title || "",
            dob: p.dob ? p.dob.substring(0, 10) : "",
            dob_place: p.dob_place || "",
            date_of_death: p.date_of_death
              ? p.date_of_death.substring(0, 10)
              : "",
            place_of_death: p.place_of_death || "",
            affiliation: p.affiliation || "",
            short_description: p.short_description || "",
            description: p.description || "",
          });
        }
      } catch (err) {
        console.error("Error fetching person:", err);
      }
    };

    fetchPerson();
  }, [id]);

  /* ---------------- HANDLE INPUT CHANGE ---------------- */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ---------------- HANDLE FILE CHANGE ---------------- */
  const handleFileChange = (e) => {
    if (e.target.name === "persons_image") {
      setPersonsImage(e.target.files[0]);
    } else if (e.target.name === "person_multiple_img") {
      setPersonMultipleImg(e.target.files);
    }
  };

  /* ---------------- SUBMIT UPDATE ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== "") {
        fd.append(key, value);
      }
    });

    if (persons_image) {
      fd.append("persons_image", persons_image);
    }

    if (person_multiple_img.length > 0) {
      for (let i = 0; i < person_multiple_img.length; i++) {
        fd.append("person_multiple_img", person_multiple_img[i]);
      }
    }

    try {
      const res = await fetch(`http://localhost:7000/persons/${id}`, {
        method: "PUT",
        body: fd,
      });

      const result = await res.json();

      if (result.status) {
        setMessage("✅ Person updated successfully!");
        setTimeout(() => navigate("/personlist"), 1200);
      } else {
        setMessage("❌ Failed: " + (result.message || "Update failed"));
      }
    } catch (err) {
      console.error("Error updating person:", err);
      setMessage("❌ Error occurred while updating person.");
    }
  };

  return (
    <div className="update-person-container">
      <h2>Update Person</h2>

      <form onSubmit={handleSubmit} className="update-form">
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

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="education"
          placeholder="Education"
          value={formData.education}
          onChange={handleChange}
        />

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
        />

        <input type="date" name="dob" value={formData.dob} onChange={handleChange} />

        <input
          type="text"
          name="dob_place"
          placeholder="Place of Birth"
          value={formData.dob_place}
          onChange={handleChange}
        />

        <input
          type="date"
          name="date_of_death"
          value={formData.date_of_death}
          onChange={handleChange}
        />

        <input
          type="text"
          name="place_of_death"
          placeholder="Place of Death"
          value={formData.place_of_death}
          onChange={handleChange}
        />

        <input
          type="text"
          name="affiliation"
          placeholder="Affiliation"
          value={formData.affiliation}
          onChange={handleChange}
        />

        <input
          type="text"
          name="short_description"
          placeholder="Short Description"
          value={formData.short_description}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <label>Profile Image</label>
        <input type="file" name="persons_image" onChange={handleFileChange} />

        <label>Multiple Images</label>
        <input
          type="file"
          name="person_multiple_img"
          multiple
          onChange={handleFileChange}
        />

        <button type="submit">Update Person</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdatePerson;
