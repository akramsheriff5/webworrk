import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ClientDashboard.css";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeStatus, setActiveStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userData, setUserData] = useState(null);

  // Fetch data from backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token from localStorage:", token);

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        console.log("Request headers:", headers);

        const response = await fetch("https://akramsheriff5.pythonanywhere.com//user-data", {
          headers: headers,
        });
        
        console.log("Response status:", response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error response:", errorData);
          throw new Error(errorData.error || "Failed to fetch data");
        }

        const jsonData = await response.json();
        console.log("Fetched data:", jsonData);

        // Set user data
        setUserData(jsonData.data.user);

        const transformedData = jsonData.data.requirements.map((item) => ({
          id: item["Project ID"],
          category: item["Category"],
          title: item["Project Title"],
          desc: item["Project Description"],
          postedDate: item["Posted Date"],
          date: item["Date"],
          time: item["Time"],
          meetLink: item["Google Meet Link"],
          status: item["Approval Status"] === "APPROVED" ? "Join" : item["Approval Status"] || "Pending",
        }));

        console.log("Transformed data:", transformedData);
        
        setData(transformedData);
        setFilteredData(transformedData);
      } catch (err) {
        console.error("Detailed error:", err);
        setError("Failed to load requirements");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Combined filter for both status and search
  useEffect(() => {
    let filtered = [...data];

    // Apply status filter
    if (activeStatus !== "All") {
      filtered = filtered.filter(
        (item) => item.status.toLowerCase() === activeStatus.toLowerCase()
      );
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(query)
        )
      );
    }

    setFilteredData(filtered);
  }, [activeStatus, data, searchQuery]);

  // Handle logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch("https://akramsheriff5.pythonanywhere.com//logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem("token");
        navigate("/");
      } else {
        console.error("Logout failed");
        localStorage.removeItem("token");
        navigate("/");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  // Handle status filter click
  const handleStatusFilter = (status) => {
    setActiveStatus(status);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const openModal = (project) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  const handleStatusClick = (item, e) => {
    e.stopPropagation();
    if (item.status === "Join") {
      setSelectedMeeting(item);
      setShowPopup(true);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedMeeting(null);
  };

  if (loading) {
    return (
      <div className="webworrk-client-all">
        <div className="content">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="webworrk-client-all">
        <div className="content">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="webworrk-client-all">
      {/* Sidebar */}
      <div className="sidebar">
        <div>
          <div className="logo">Webworrk</div>
          <div className="profile">
            <div className="profile-pic">
              {userData?.Name ? userData.Name.charAt(0).toUpperCase() : ''}
            </div>
            <div>
              <div className="profile-name">{userData?.Name || 'Loading...'}</div>
              <div className="profile-role">{userData?.Role || 'Client'}</div>
            </div>
          </div>
          <div className="sidebar-btn active">
            <span className="sidebar-btn-icon">&#128188;</span>
            Overview
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {/* Content */}
      <div className="content">
        <div className="header">
          <div className="header-right">
            <button className="notification-icon">🔔</button>
            <button className="post-requirement">Post Requirement</button>
          </div>
        </div>

        <div className="filters">
          <div className="status-buttons">
            <button
              className={`status-btn ${activeStatus === "All" ? "active" : ""}`}
              onClick={() => handleStatusFilter("All")}
            >
              All
            </button>
            <button
              className={`status-btn ${activeStatus === "Join" ? "active" : ""}`}
              onClick={() => handleStatusFilter("Join")}
            >
              My Meeting
            </button>
          </div>
          <div className="search-sort">
            <input
              type="text"
              className="search-bar"
              placeholder="Search here"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Posted Date</th>
                <th>Project ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} onClick={() => openModal(item)}>
                  <td>{item.postedDate}</td>
                  <td>{item.id}</td>
                  <td>{item.title}</td>
                  <td>
                    <div className="truncate-text" title={item.desc}>
                      {item.desc}
                    </div>
                  </td>
                  <td>{item.date}</td>
                  <td>{item.time}</td>
                  <td>
                    <span
                      className={`status ${item.status.toLowerCase()}`}
                      onClick={(e) => handleStatusClick(item, e)}
                      style={{ cursor: item.status === "Join" ? "pointer" : "default" }}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Requirement Details Modal */}
      {selectedProject && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-btn" onClick={closeModal}>
              &times;
            </button>
            <h3>Requirement Details</h3>
            <p><strong>Posted Date:</strong> {selectedProject.postedDate}</p>
            <p><strong>Project ID:</strong> {selectedProject.id}</p>
            <p><strong>Category:</strong> {selectedProject.category}</p>
            <p><strong>Title:</strong> {selectedProject.title}</p>
            <p><strong>Description:</strong> {selectedProject.desc}</p>
            <p><strong>Date:</strong> {selectedProject.date}</p>
            <p><strong>Time:</strong> {selectedProject.time}</p>
            <p><strong>Status:</strong> {selectedProject.status}</p>
          </div>
        </div>
      )}

      {/* Go Live Popup */}
      {showPopup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Meeting Confirmation</h3>
            <p>Do you want to start this meeting now?</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => {
                  if (selectedMeeting.meetLink) {
                    window.open(selectedMeeting.meetLink, "_blank", "noopener,noreferrer");
                  } else {
                    alert("Meeting link is not available.");
                  }
                  closePopup();
                }}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  background: "#45c752",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Go Live
              </button>
              <button
                onClick={closePopup}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  background: "#ff4d4d",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;