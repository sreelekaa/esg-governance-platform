import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

function AuditLogs() {

  const [logs, setLogs] = useState([]);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {

    axios
      .get(
        "http://localhost:8000/api/review/audit-logs/"
      )
      .then((response) => {

        setLogs(response.data);

        setLoading(false);

      })
      .catch((error) => {

        console.error(error);

        setLoading(false);
      });

  }, []);

  if (loading) {

    return (
      <h2 style={{ padding: "30px" }}>
        Loading Audit Logs...
      </h2>
    );
  }

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

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >

        <div>

          <h1
            style={{
              color: "#0f172a",
            }}
          >
            ESG Audit Logs
          </h1>

          <p
            style={{
              color: "#64748b",
            }}
          >
            Governance and approval history
            across ESG workflows.
          </p>

        </div>

        <button
          onClick={() => navigate("/")}
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
          Back to Dashboard
        </button>

      </div>

      {/* AUDIT TABLE */}

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
            borderCollapse:
              "collapse",
          }}
        >

          <thead
            style={{
              backgroundColor:
                "#0f172a",
              color: "white",
            }}
          >

            <tr>

              <th>ID</th>

              <th>Record</th>

              <th>Action</th>

              <th>Performed By</th>

              <th>Timestamp</th>

            </tr>

          </thead>

          <tbody>

            {logs.length > 0 ? (

              logs.map((log) => (

                <tr
                  key={log.id}
                  style={{
                    borderBottom:
                      "1px solid #ddd",
                  }}
                >

                  <td>{log.id}</td>

                  <td>
                    {log.record}
                  </td>

                  <td>

                    <span
                      style={{
                        backgroundColor:
                          "#dbeafe",
                        padding:
                          "6px 12px",
                        borderRadius:
                          "8px",
                        fontWeight:
                          "bold",
                      }}
                    >

                      {log.action}

                    </span>

                  </td>

                  <td>
                    {log.performed_by}
                  </td>

                  <td>

                    {new Date(
                      log.timestamp
                    ).toLocaleString()}

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td colSpan="5">

                  No audit logs found

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AuditLogs;