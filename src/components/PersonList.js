import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PersonList = () => {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPersons();
  }, []);

  const fetchPersons = async () => {
    try {
      const res = await fetch("http://localhost:7000/persons");
      const data = await res.json();

      if (data && data.persons && data.persons.length > 0) {
        setPersons(data.persons);
      } else {
        setPersons([]);
      }
    } catch (err) {
      console.error("Error fetching persons:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔴 Delete Function
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this person?")) return;

    try {
      const res = await fetch(`http://localhost:7000/persons/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.status) {
        alert("Person deleted successfully!");
        setPersons(persons.filter((person) => person._id !== id)); // remove from UI
      } else {
        alert("Failed to delete person: " + data.message);
      }
    } catch (err) {
      console.error("Error deleting person:", err);
      alert("Error deleting person");
    }
  };

  return (
    <div className="person-list-container">
      <h2>Person List</h2>
      {loading ? (
        <p>Loading persons...</p>
      ) : persons.length === 0 ? (
        <p>No persons found.</p>
      ) : (
        <div className="person-card-list">
          {persons.map((person) => (
            <div key={person._id} className="person-card">
              <div className="person-header">
                {person.persons_image ? (
                  <img
                    src={`http://localhost:7000/uploads/${person.persons_image}`}
                    alt={person.name}
                    className="person-img"
                  />
                ) : (
                  <div className="no-img">N/A</div>
                )}
                <h3>{person.name}</h3>
                <p className="category">
                  {person.category_id?.category_name || "N/A"}
                </p>
              </div>

              <div className="person-details">
                <p><strong>Title:</strong> {person.title || "N/A"}</p>
                <p><strong>Education:</strong> {person.education || "N/A"}</p>
                <p><strong>DOB:</strong> {person.dob ? new Date(person.dob).toLocaleDateString() : "N/A"}</p>
                <p><strong>Place of Birth:</strong> {person.dob_place || "N/A"}</p>
                <p><strong>Date of Death:</strong> {person.date_of_death ? new Date(person.date_of_death).toLocaleDateString() : "N/A"}</p>
                <p><strong>Place of Death:</strong> {person.place_of_death || "N/A"}</p>
                <p><strong>Affiliation:</strong> {person.affiliation || "N/A"}</p>
                <p><strong>Short Description:</strong> {person.short_description || "N/A"}</p>
                <p><strong>Description:</strong> {person.description || "N/A"}</p>
                <p><strong>Views:</strong> {person.views || 0}</p>
                <p><strong>Trending:</strong> {person.isTrending ? "Yes" : "No"}</p>
                <p><strong>New Arrival:</strong> {person.isNewArrival ? "Yes" : "No"}</p>
                <p><strong>Created At:</strong> {person.createdAt ? new Date(person.createdAt).toLocaleString() : "N/A"}</p>
                <p><strong>Updated At:</strong> {person.updatedAt ? new Date(person.updatedAt).toLocaleString() : "N/A"}</p>
              </div>
              

              {/* 🔴 Delete Button */}
              <button
                className="delete-btn"
                onClick={() => handleDelete(person._id)}
              >
                Delete
              </button>
              <button className="update-btn">
                <Link to={`/update/${person._id}`}>Update Person</Link>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PersonList;
