import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminPanel.css";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeStatus, setActiveStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [userData, setUserData] = useState(null);

  // Fetch data from backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch('https://akramsheriff5.pythonanywhere.com//data', {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const jsonData = await response.json();

        // Set user data from token
        const tokenParts = token.split('.');
        const tokenPayload = JSON.parse(atob(tokenParts[1]));
        const email = tokenPayload.email;

        // Find admin user data
        const adminUser = jsonData.data.users.find(user => user.Email === email);
        setUserData(adminUser);

        const transformedData = jsonData.data.requirements.map(item => ({
          postedDate: item["Posted Date"],
          id: item["Project ID"],
          title: item["Project Title"],
          desc: item["Project Description"],
          date: item["Date"],
          time: item["Time"],
          status: item["Approval Status"] || "Pending"
        }));

        setData(transformedData);
        setFilteredData(transformedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load requirements");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (activeStatus === "All") {
      setFilteredData(data);
    } else {
      const filtered = data.filter(item => item.status.toLowerCase() === activeStatus.toLowerCase());
      setFilteredData(filtered);
    }
  }, [activeStatus, data]);

  const handleStatusFilter = (status) => {
    setActiveStatus(status);
  };

  const handleApprove = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('https://akramsheriff5.pythonanywhere.com//approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ projectId })
      });

      const result = await response.json();

      if (result.success) {
        const updatedData = data.map(item => 
          item.id === projectId ? { ...item, status: "APPROVED" } : item
        );
        setData(updatedData);
        alert("Requirement approved successfully!");
        closeModal();
      } else {
        alert(result.error || "Failed to approve requirement");
      }
    } catch (err) {
      console.error("Error approving requirement:", err);
      alert("Failed to approve requirement");
    }
  };

  const handleReject = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('https://akramsheriff5.pythonanywhere.com//reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ projectId })
      });

      const result = await response.json();

      if (result.success) {
        const updatedData = data.map(item => 
          item.id === projectId ? { ...item, status: "REJECTED" } : item
        );
        setData(updatedData);
        alert("Requirement rejected successfully!");
        closeModal();
      } else {
        alert(result.error || "Failed to reject requirement");
      }
    } catch (err) {
      console.error("Error rejecting requirement:", err);
      alert("Failed to reject requirement");
    }
  };

  const openModal = (project) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  const handleStatusClick = (item, e) => {
    e.stopPropagation();
  };

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
              <div className="profile-role">{userData?.WhoYouAre || 'Admin'}</div>
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
              className={`status-btn ${activeStatus === "PENDING" ? "active" : ""}`}
              onClick={() => handleStatusFilter("PENDING")}
            >
              Pending
            </button>
            <button 
              className={`meeting-btn ${activeStatus === "APPROVED" ? "active" : ""}`}
              onClick={() => handleStatusFilter("APPROVED")}
            >
              Approved
            </button>
            <button 
              className={`status-btn ${activeStatus === "REJECTED" ? "active" : ""}`}
              onClick={() => handleStatusFilter("REJECTED")}
            >
              Rejected
            </button>
          </div>
          <div className="search-sort">
            <input type="text" className="search-bar" placeholder="Search here" />
            <div className="date-range">
              <input type="date" placeholder="Start Date" />
              <input type="date" placeholder="End Date" />
            </div>
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

      {/* Requirement Details Modal with Action Buttons */}
      {selectedProject && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-btn" onClick={closeModal}>&times;</button>
            <h3>Requirement Details</h3>
            <p><strong>Posted Date:</strong> {selectedProject.postedDate}</p>
            <p><strong>ID:</strong> {selectedProject.id}</p>
            <p><strong>Title:</strong> {selectedProject.title}</p>
            <p><strong>Description:</strong> {selectedProject.desc}</p>
            <p><strong>Date:</strong> {selectedProject.date}</p>
            <p><strong>Time:</strong> {selectedProject.time}</p>
            <p><strong>Status:</strong> {selectedProject.status}</p>
            
            {/* Action Buttons in Modal */}
            {selectedProject.status === "Pending" && (
              <div className="modal-actions">
                <button 
                  onClick={() => handleApprove(selectedProject.id)}
                  className="approve-btn"
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleReject(selectedProject.id)}
                  className="reject-btn"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;