import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdatePerson = () => {
  const { id } = useParams(); // person id
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

  // ✅ Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:7000/categories");
        const data = await res.json();
        if (data.categories) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // ✅ Fetch person details
  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const res = await fetch(`http://localhost:7000/persons/${id}`);
        const data = await res.json();

        if (data && data.person) {
          setFormData({
            category_id: data.person.category_id || "",
            name: data.person.name || "",
            education: data.person.education || "",
            title: data.person.title || "",
            dob: data.person.dob ? data.person.dob.split("T")[0] : "",
            dob_place: data.person.dob_place || "",
            date_of_death: data.person.date_of_death
              ? data.person.date_of_death.split("T")[0]
              : "",
            place_of_death: data.person.place_of_death || "",
            affiliation: data.person.affiliation || "",
            short_description: data.person.short_description || "",
            description: data.person.description || "",
          });
        }
      } catch (err) {
        console.error("Error fetching person:", err);
      }
    };

    fetchPerson();
  }, [id]);

  // ✅ handle input text change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ handle file change
  const handleFileChange = (e) => {
    if (e.target.name === "persons_image") {
      setPersonsImage(e.target.files[0]);
    } else if (e.target.name === "person_multiple_img") {
      setPersonMultipleImg(e.target.files);
    }
  };

  // ✅ handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    });

    if (persons_image) {
      data.append("persons_image", persons_image);
    }
    if (person_multiple_img.length > 0) {
      for (let i = 0; i < person_multiple_img.length; i++) {
        data.append("person_multiple_img", person_multiple_img[i]);
      }
    }

    try {
      const res = await fetch(`http://localhost:7000/persons/${id}`, {
        method: "PUT",
        body: data,
      });

      const result = await res.json();
      if (result.status) {
        setMessage("✅ Person updated successfully!");
        setTimeout(() => navigate("/persons"), 1500);
      } else {
        setMessage("❌ Failed: " + result.message);
      }
    } catch (error) {
      console.error("Error updating person:", error);
      setMessage("❌ Error occurred while updating person.");
    }
  };

  return (
    <div className="update-person-container">
      <h2>Update Person</h2>
      <form onSubmit={handleSubmit} className="update-form">
        {/* ✅ Category Dropdown */}
        <label>Category</label>
        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id || cat.id} value={cat._id || cat.id}>
              {cat.category_name || "Unnamed Category"}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="education"
          placeholder="Enter Education"
          value={formData.education}
          onChange={handleChange}
        />

        <input
          type="text"
          name="title"
          placeholder="Enter Title"
          value={formData.title}
          onChange={handleChange}
        />

        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
        />

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

        <label>Profile Image:</label>
        <input type="file" name="persons_image" onChange={handleFileChange} />

        <label>Multiple Images:</label>
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
