import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PersonProfile = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 UNIQUE VIEW LOGIC (ONE VIEW PER DEVICE)
  useEffect(() => {
    if (!id) return;

    const key = "viewedPersons";
    const viewedPersons = JSON.parse(localStorage.getItem(key)) || [];

    if (!viewedPersons.includes(id)) {
      fetch(`http://localhost:7000/persons/${id}/view`, { method: "POST" })
        .catch(() => {});
      localStorage.setItem(key, JSON.stringify([...viewedPersons, id]));
    }
  }, [id]);

  // Fetch person details
  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const res = await fetch(`http://localhost:7000/persons/${id}`);
        const data = await res.json();

        if (data.status) {
          setPerson(data.person);
        }
      } catch (err) {
        console.error("Error fetching person:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerson();
  }, [id]);

  if (loading) return <p>Loading profile...</p>;
  if (!person) return <p>Person not found</p>;

  return (
    <div className="person-profile">
      <h2>{person.name}</h2>

      {person.persons_image && (
        <img
          src={`http://localhost:7000/uploads/${person.persons_image}`}
          alt={person.name}
          width="200"
        />
      )}

      <p><strong>Category:</strong> {person.category_id?.category_name || "N/A"}</p>

      <p><strong>Date of Birth:</strong>{" "}
        {person.dob ? new Date(person.dob).toLocaleDateString() : "N/A"}
      </p>

      <p><strong>Date of Death:</strong>{" "}
        {person.date_of_death 
          ? new Date(person.date_of_death).toLocaleDateString()
          : "Alive"}
      </p>

      <p><strong>Views:</strong> {person.views || 0}</p>

      <p><strong>Trending:</strong> {person.isTrending ? "Yes " : "No"}</p>

      <p><strong>New Arrival:</strong> {person.isNewArrival ? "Yes " : "No"}</p>

      <p><strong>Description:</strong></p>
      <p>{person.description}</p>
    </div>
  );
};

export default PersonProfile;
