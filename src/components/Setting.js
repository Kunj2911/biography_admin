import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Setting = () => {
  const [formData, setFormData] = useState({
    terms_conditions: "",
    privacy_policy: "",
    contact: "",
    aboutus: "",
  });
  const [isExisting, setIsExisting] = useState(false); // ✅ track if setting already exists

  // ✅ Fetch existing settings when component mounts
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("http://localhost:7000/setting");
        const data = await res.json();
        if (data.status && data.setting) {
          setFormData(data.setting);
          setIsExisting(true); // ✅ already exists → only update allowed
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const handleQuillChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:7000/setting", {
        method: "POST", // backend handles add/update
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.status) {
        setIsExisting(true); // ✅ after first save, always update
        alert(isExisting ? "✅ Settings updated!" : "✅ Settings added!");
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Error while saving settings.");
    }
  };

  return (
    <div className="setting-container">
      <h2>Settings</h2>
      <form onSubmit={handleSubmit} className="setting-form">
        <div className="form-group">
          <label>Terms & Conditions:</label>
          <ReactQuill
            theme="snow"
            value={formData.terms_conditions}
            onChange={(value) => handleQuillChange("terms_conditions", value)}
            style={{ height: "200px", marginBottom: "50px" }}
          />
        </div>

        <div className="form-group">
          <label>Privacy Policy:</label>
          <ReactQuill
            theme="snow"
            value={formData.privacy_policy}
            onChange={(value) => handleQuillChange("privacy_policy", value)}
            style={{ height: "200px", marginBottom: "50px" }}
          />
        </div>

        <div className="form-group">
          <label>Contact:</label>
          <ReactQuill
            theme="snow"
            value={formData.contact}
            onChange={(value) => handleQuillChange("contact", value)}
            style={{ height: "200px", marginBottom: "50px" }}
          />  
        </div>

        <div className="form-group">
          <label>About Us:</label>
          <ReactQuill
            theme="snow"
            value={formData.aboutus}
            onChange={(value) => handleQuillChange("aboutus", value)}
            style={{ height: "200px", marginBottom: "50px" }}
          />
        </div>

        <button type="submit" className="btn-save">
          {isExisting ? "Update Settings" : "Add Settings"}
        </button>
      </form>
    </div>
  );
};

export default Setting;
 