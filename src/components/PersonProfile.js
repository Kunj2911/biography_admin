import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PersonProfile = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 UNIQUE VIEW LOGIC (ONE VIEW PER DEVICE)
  useEffect(() => {
    const viewedPersons =
      JSON.parse(localStorage.getItem("viewedPersons")) || [];

    if (!viewedPersons.includes(id)) {
      fetch(`http://localhost:7000/persons/${id}/view`, {
        method: "POST",
      });

      viewedPersons.push(id);
      localStorage.setItem("viewedPersons", JSON.stringify(viewedPersons));
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

      <p><strong>Category:</strong> {person.category_id?.category_name}</p>
      <p><strong>Title:</strong> {person.title}</p>
      <p><strong>Education:</strong> {person.education}</p>
      <p><strong>Views:</strong> {person.views}</p>
      <p><strong>Description:</strong> {person.description}</p>
    </div>
  );
};

export default PersonProfile;
