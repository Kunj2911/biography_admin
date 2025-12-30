import React, { useState } from "react";

const AppUpdateAdd = () => {
  const [form, setForm] = useState({
    version: "",
    release_notes: "",
    force_update: false,
    force_update_android: false,
    force_update_ios: false,
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:7000/app-update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data.status) {
      alert("App Update Saved");
      setForm({
        version: "",
        release_notes: "",
        force_update: false,
        force_update_android: false,
        force_update_ios: false,
      });
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="form-container">
      <h2>Add App Update</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="version"
          placeholder="Version (e.g. 1.0.5)"
          value={form.version}
          onChange={handleChange}
          required
        />

        <textarea
          name="release_notes"
          placeholder="Release Notes"
          value={form.release_notes}
          onChange={handleChange}
          required
        />

        {/* 🔴 FORCE UPDATE MASTER */}
        <label className="checkbox">
          <input
            type="checkbox"
            name="force_update"
            checked={form.force_update}
            onChange={handleChange}
          />
          Force Update 
        </label>

        {/* 🔵 ANDROID */}
        <label className="checkbox">
          <input
            type="checkbox"
            name="force_update_android"
            checked={form.force_update_android}
            onChange={handleChange}
            disabled={!form.force_update}
          />
          Force Update Android
        </label>

        {/* 🍎 IOS */}
        <label className="checkbox">
          <input
            type="checkbox"
            name="force_update_ios"
            checked={form.force_update_ios}
            onChange={handleChange}
            disabled={!form.force_update}
          />
          Force Update iOS
        </label>

        <button type="submit">Save App Update</button>
      </form>
    </div>
  );
};

export default AppUpdateAdd;
