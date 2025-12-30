import React, { useEffect, useState } from "react";

const AppUpdateList = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const res = await fetch("http://localhost:7000/app-updates");
      const data = await res.json();
      if (data.status) {
        setUpdates(data.updates);
      } else {
        setUpdates([]);
      }
    } catch (err) {
      console.error("Error fetching app updates:", err);
      setUpdates([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="list-container">
      <h2>App Update List</h2>

      {loading ? (
        <p>Loading updates...</p>
      ) : updates.length === 0 ? (
        <p>No app updates found.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Version</th>
              <th>Release Notes</th>
              <th>Force Update</th>
              <th>Android</th>
              <th>iOS</th>
              <th>Created At</th>
            </tr>
          </thead>

          <tbody>
            {updates.map((u, index) => (
              <tr key={u._id}>
                <td>{index + 1}</td>
                <td>{u.version}</td>
                <td style={{ maxWidth: 350 }}>
                  {u.release_notes}
                </td>

                <td>
                  {u.force_update ? (
                    <span style={{ color: "green"}}>
                      ON
                    </span>
                  ) : (
                    <span style={{ color: "red" }}>
                      OFF
                    </span>
                  )}
                </td>

                <td>
                  {u.force_update_android ? "YES" : "NO"}
                </td>

                <td>
                  {u.force_update_ios ? "YES" : "NO"}
                </td>

                <td>
                  {u.createdAt
                    ? new Date(u.createdAt).toLocaleString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AppUpdateList;
