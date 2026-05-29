import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Charts from "../components/Charts";


function Dashboard() {

  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [auditLogs, setAuditLogs] = useState([]);
  const [filter, setFilter] = useState("all");
  const API_BASE ="https://esg-governance-platform.onrender.com";
  const navigate = useNavigate();
  // FETCH RECORDS
  useEffect(() => {

    axios.get(`${API_BASE}/api/review/records/`)
      .then((response) => {

        setRecords(response.data);

        setFilteredRecords(response.data);

        setLoading(false);
      })
      .catch((error) => {

        console.error(error);

        setLoading(false);
      });

  }, []);

  // FILTERS + SEARCH
  useEffect(() => {

    let updated = [...records];

    // SEARCH
    if (search !== "") {

      updated = updated.filter((record) =>
        (record.facility && record.facility
          .toLowerCase()
          .includes(search.toLowerCase())) ||

        (record.source_type && record.source_type
          .toLowerCase()
          .includes(search.toLowerCase())) ||

        (record.activity_type && record.activity_type
          .toLowerCase()
          .includes(search.toLowerCase()))
      );
    }

    // FILTERS
    if (filter === "suspicious") {

      updated = updated.filter(
        (r) => r.suspicious
      );
    }

    if (filter === "approved") {

      updated = updated.filter(
        (r) => r.approved
      );
    }

    if (filter === "failed") {

      updated = updated.filter(
        (r) =>
          r.validation_status === "failed"
      );
    }

    if (filter === "sap") {

      updated = updated.filter(
        (r) => r.source_type === "sap"
      );
    }

    if (filter === "utility") {

      updated = updated.filter(
        (r) => r.source_type === "utility"
      );
    }

    if (filter === "travel") {

      updated = updated.filter(
        (r) => r.source_type === "travel"
      );
    }

    setFilteredRecords(updated);

  }, [search, filter, records]);

  // APPROVE RECORD
  const approveRecord = async (id) => {

    try {

      await axios.post( `${API_BASE}/api/review/approve/${id}/`);

      setRecords(

        records.map((record) =>

          record.id === id

            ? {
              ...record,
              approved: true,
              locked: true,
            }

            : record
        )
      );

    } catch (error) {

      console.error(error);
    }
  };

  // LOADING
  if (loading) {

    return (
      <h2 style={{ padding: "30px" }}>
        Loading ESG Dashboard...
      </h2>
    );
  }
  const uploadSAPFile = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    try {

      await axios.post(`${API_BASE}/api/upload/sap/`,formData);
      alert("SAP file uploaded successfully");

      window.location.reload();

    } catch (error) {

      console.error(error);

      alert("SAP upload failed");
    }
  };

  const uploadUtilityFile = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    try {

     await axios.post(`${API_BASE}/api/upload/utility/`,formData);

      alert("Utility file uploaded successfully");

      window.location.reload();

    } catch (error) {

      console.error(error);

      alert("Utility upload failed");
    }
  };

  const syncTravelAPI = async () => {

    try {

     await axios.post(`${API_BASE}/api/travel/sync/`);

      alert("Travel API synced successfully");

      window.location.reload();

    } catch (error) {

      console.error(error);

      alert("Travel sync failed");
    }
  };
  // DASHBOARD COUNTS
  const suspiciousCount = records.filter(
    (r) => r.suspicious
  ).length;

  const approvedCount = records.filter(
    (r) => r.approved
  ).length;

  const failedCount = records.filter(
    (r) =>
      r.validation_status === "failed"
  ).length;

  const totalCO2 = records.reduce(

    (sum, r) => sum + Number(r.co2_emission || 0),

    0
  );

  return (

    <div
      style={{
        padding: "30px",
        backgroundColor: "#f4f6f9",
        minHeight: "100vh",
        fontFamily: "Arial",
      }}
    >

      {/* HEADER */}

      <h1 style={{ color: "#0f172a" }}>
        ESG Review Dashboard
      </h1>

      <p style={{ color: "#64748b" }}>
        ESG ingestion, validation,
        suspicious detection,
        approval workflow,
        and audit locking.
      </p>

      {/* SEARCH */}

      <input
        type="text"
        placeholder="Search facility / source / activity..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        style={{
          width: "350px",
          padding: "12px",
          borderRadius: "10px",
          border: "1px solid #ccc",
          marginTop: "20px",
          marginBottom: "20px",
          fontSize: "15px",
        }}
      />

      {/* UPLOAD ACTIONS */}

      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >

        {/* SAP */}

        <label
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            padding: "12px 20px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >

          Upload SAP CSV

          <input
            type="file"
            hidden
            onChange={uploadSAPFile}
          />

        </label>

        {/* UTILITY */}

        <label
          style={{
            backgroundColor: "#f59e0b",
            color: "white",
            padding: "12px 20px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >

          Upload Utility CSV

          <input
            type="file"
            hidden
            onChange={uploadUtilityFile}
          />

        </label>

        {/* TRAVEL */}

        <button
          onClick={syncTravelAPI}
          style={{
            backgroundColor: "#7c3aed",
            color: "white",
            padding: "12px 20px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >

          Sync Travel API

        </button>

      </div>
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "20px",
        }}
      >

        <button
          onClick={() =>
            navigate("/audit-logs")
          }
          style={{
            backgroundColor: "#0f172a",
            color: "white",
            padding: "12px 20px",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          View Audit Logs
        </button>

        <button
          onClick={() =>
            navigate("/analyst-review")
          }
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            padding: "12px 20px",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Analyst Review
        </button>

      </div>
      {/* DASHBOARD CARDS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(5, 1fr)",
          gap: "20px",
          marginBottom: "30px",
        }}
      >

        <Card
          title="Total Records"
          value={records.length}
          color="#2563eb"
        />

        <Card
          title="Suspicious"
          value={suspiciousCount}
          color="#f59e0b"
        />

        <Card
          title="Approved"
          value={approvedCount}
          color="#16a34a"
        />

        <Card
          title="Failed"
          value={failedCount}
          color="#dc2626"
        />
        <Card
          title="Total CO₂"
          value={`${totalCO2.toFixed(2)} kg`}
          color="#7c3aed"
        />
      </div>

      {/* ADD HERE */}
      <Charts records={records} />
      {/* FILTER BUTTONS */}

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >

        <FilterButton
          text="All"
          active={filter === "all"}
          onClick={() => setFilter("all")}
        />

        <FilterButton
          text="SAP"
          active={filter === "sap"}
          onClick={() => setFilter("sap")}
        />

        <FilterButton
          text="Utility"
          active={filter === "utility"}
          onClick={() => setFilter("utility")}
        />

        <FilterButton
          text="Travel"
          active={filter === "travel"}
          onClick={() => setFilter("travel")}
        />

        <FilterButton
          text="Suspicious"
          active={filter === "suspicious"}
          onClick={() =>
            setFilter("suspicious")
          }
        />

        <FilterButton
          text="Approved"
          active={filter === "approved"}
          onClick={() =>
            setFilter("approved")
          }
        />

        <FilterButton
          text="Failed"
          active={filter === "failed"}
          onClick={() =>
            setFilter("failed")
          }
        />

      </div>

      {/* TABLE */}

      <div
        style={{
          background: "white",
          borderRadius: "15px",
          padding: "20px",
          boxShadow:
            "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >

        <table
          width="100%"
          cellPadding="15"
          style={{
            borderCollapse: "collapse",
          }}
        >

          {/* TABLE HEADER */}

          <thead
            style={{
              backgroundColor: "#0f172a",
              color: "white",
            }}
          >

            <tr>

              <th>ID</th>

              <th>Source</th>

              <th>Facility</th>

              <th>Status</th>

              <th>CO₂</th>

              <th>Suspicious</th>

              <th>Review Comment</th>

              <th>Approved</th>

              <th>Action</th>

            </tr>

          </thead>

          {/* TABLE BODY */}

          <tbody>

            {filteredRecords.map((record) => (

              <tr
                key={record.id}
                style={{
                  borderBottom:
                    "1px solid #ddd",

                  backgroundColor:
                    record.validation_status ===
                      "failed"
                      ? "#fee2e2"
                      : record.suspicious
                        ? "#fef3c7"
                        : "white",
                }}
              >

                {/* ID */}

                <td>{record.id}</td>

                {/* SOURCE */}

                <td>

                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: "8px",
                      color: "white",
                      fontWeight: "bold",

                      backgroundColor:
                        record.source_type ===
                          "sap"
                          ? "#2563eb"
                          : record.source_type ===
                            "utility"
                            ? "#f59e0b"
                            : "#7c3aed",
                    }}
                  >

                    {record.source_type.toUpperCase()}

                  </span>

                </td>

                {/* FACILITY */}

                <td>{record.facility}</td>

                {/* STATUS */}

                <td>

                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: "8px",
                      color: "white",
                      fontWeight: "bold",

                      backgroundColor:
                        record.validation_status ===
                          "valid"
                          ? "#16a34a"
                          : record.validation_status ===
                            "failed"
                            ? "#dc2626"
                            : "#64748b",
                    }}
                  >

                    {record.validation_status.toUpperCase()}

                  </span>

                </td>

                {/* CO2 */}

                <td>

                  <strong>

                    {record.co2_emission}

                  </strong>

                </td>

                {/* SUSPICIOUS */}

                <td>

                  {record.suspicious ? (

                    <span
                      style={{
                        color: "#b45309",
                        fontWeight: "bold",
                      }}
                    >
                      ⚠ YES
                    </span>

                  ) : (

                    <span
                      style={{
                        color: "#16a34a",
                        fontWeight: "bold",
                      }}
                    >
                      NO
                    </span>

                  )}

                </td>

                {/* REVIEW COMMENT */}

                <td>

                  <textarea

                    value={record.review_comment || ""}

                    onChange={(e) => {

                      const updated = records.map((r) =>

                        r.id === record.id

                          ? {
                            ...r,
                            review_comment: e.target.value,
                          }

                          : r
                      );

                      setRecords(updated);
                    }}

                    style={{
                      width: "200px",
                      minHeight: "60px",
                      borderRadius: "8px",
                      padding: "8px",
                      border: "1px solid #ccc",
                    }}
                  />

                </td>

                {/* APPROVED */}

                <td>

                  {record.approved ? (

                    <span
                      style={{
                        color: "#16a34a",
                        fontWeight: "bold",
                      }}
                    >
                      LOCKED
                    </span>

                  ) : (

                    <span
                      style={{
                        color: "#dc2626",
                        fontWeight: "bold",
                      }}
                    >
                      PENDING
                    </span>

                  )}

                </td>

                {/* ACTION */}

                <td>

                  {!record.approved ? (

                    <button
                      onClick={() =>
                        approveRecord(record.id)
                      }
                      style={{
                        backgroundColor:
                          "#16a34a",

                        color: "white",

                        border: "none",

                        padding: "10px 16px",

                        borderRadius: "10px",

                        cursor: "pointer",

                        fontWeight: "bold",
                      }}
                    >
                      Approve
                    </button>

                  ) : (

                    <button
                      disabled
                      style={{
                        backgroundColor:
                          "#cbd5e1",

                        color: "#475569",

                        border: "none",

                        padding: "10px 16px",

                        borderRadius: "10px",

                        fontWeight: "bold",
                      }}
                    >
                      Locked
                    </button>

                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );

}

function Card({ title, value, color }) {
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
        border: "1px solid #f1f5f9",
        borderTop: `4px solid ${color}`,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.04)";
      }}
    >
      <span
        style={{
          color: "#64748b",
          fontSize: "14px",
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {title}
      </span>
      <span
        style={{
          color: "#0f172a",
          fontSize: "30px",
          fontWeight: "800",
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function FilterButton({ text, onClick, active }) {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: active ? "#2563eb" : "white",
        color: active ? "white" : "#475569",
        border: "1px solid",
        borderColor: active ? "#2563eb" : "#e2e8f0",
        padding: "10px 20px",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "14px",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: active ? "0 4px 12px rgba(37, 99, 235, 0.2)" : "none",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = "#f8fafc";
          e.currentTarget.style.borderColor = "#cbd5e1";
          e.currentTarget.style.color = "#0f172a";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = "white";
          e.currentTarget.style.borderColor = "#e2e8f0";
          e.currentTarget.style.color = "#475569";
        }
      }}
    >
      {text}
    </button>
  );
}

export default Dashboard;