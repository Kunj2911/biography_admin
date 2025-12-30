import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MostRead = () => {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMostRead();
  }, []);

  const fetchMostRead = async () => {
    try {
      const res = await fetch("http://localhost:7000/most-read");
      const data = await res.json();

      if (data.status) {
        setPersons(data.most_read);
      }
    } catch (err) {
      console.error("Error fetching most read:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading most read...</p>;

  return (
    <div className="most-read-container">
      <h2>🔥 Most Read Persons</h2>

      {persons.length === 0 ? (
        <p>No data found</p>
      ) : (
        <div className="most-read-list">
          {persons.map((p) => (
            <div key={p._id} className="most-read-card">
              <img
                src={`http://localhost:7000/uploads/${p.persons_image}`}
                alt={p.name}
              />
              <h3>{p.name}</h3>
              <p>{p.category_id?.category_name}</p>
              <p>👁️ Views: {p.views}</p>

              <Link to={`/person/${p._id}`}>View Profile</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MostRead;
