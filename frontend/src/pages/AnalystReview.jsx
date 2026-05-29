import React, {
    useEffect,
    useState,
} from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

function AnalystReview() {

    const [records, setRecords] = useState([]);

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {

        axios
            .get(
                "http://localhost:8000/api/review/records/"
            )
            .then((response) => {

                // SHOW ONLY FAILED OR SUSPICIOUS

                const filtered =
                    response.data.filter(

                        (record) =>

                            record.suspicious === true ||

                            record.validation_status ===
                            "failed"
                    );

                setRecords(filtered);

                setLoading(false);

            })
            .catch((error) => {

                console.error(error);

                setLoading(false);
            });

    }, []);

    // UPDATE REVIEW STATUS

    const updateReviewStatus = (
        id,
        status
    ) => {

        setRecords(

            records.map((record) =>

                record.id === id
                    ? {
                        ...record,
                        review_status: status,
                    }
                    : record
            )
        );
    };

    if (loading) {

        return (
            <h2 style={{ padding: "30px" }}>
                Loading Analyst Review...
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
                        Analyst Review Center
                    </h1>

                    <p
                        style={{
                            color: "#64748b",
                        }}
                    >
                        ESG investigation workflow
                        for suspicious and failed
                        records.
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

            {/* REVIEW TABLE */}

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

                            <th>Source</th>

                            <th>Facility</th>

                            <th>Status</th>

                            <th>Suspicious</th>

                            <th>Priority</th>

                            <th>Review Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {records.length > 0 ? (

                            records.map((record) => (

                                <tr
                                    key={record.id}
                                    style={{
                                        borderBottom:
                                            "1px solid #ddd",
                                    }}
                                >

                                    <td>{record.id}</td>

                                    <td>
                                        {record.source_type}
                                    </td>

                                    <td>
                                        {record.facility}
                                    </td>

                                    <td>

                                        <span
                                            style={{
                                                backgroundColor:
                                                    record.validation_status ===
                                                        "failed"
                                                        ? "#fee2e2"
                                                        : "#dcfce7",

                                                color:
                                                    record.validation_status ===
                                                        "failed"
                                                        ? "#dc2626"
                                                        : "#16a34a",

                                                padding:
                                                    "6px 12px",

                                                borderRadius:
                                                    "8px",

                                                fontWeight:
                                                    "bold",
                                            }}
                                        >

                                            {
                                                record.validation_status
                                            }

                                        </span>

                                    </td>

                                    <td>

                                        {record.suspicious
                                            ? "YES"
                                            : "NO"}

                                    </td>

                                    {/* PRIORITY */}

                                    <td>

                                        {record.suspicious ? (

                                            <span
                                                style={{
                                                    backgroundColor:
                                                        "#fee2e2",
                                                    color: "#dc2626",
                                                    padding:
                                                        "6px 12px",
                                                    borderRadius:
                                                        "8px",
                                                    fontWeight:
                                                        "bold",
                                                }}
                                            >
                                                HIGH
                                            </span>

                                        ) : (

                                            <span
                                                style={{
                                                    backgroundColor:
                                                        "#fef3c7",
                                                    color: "#d97706",
                                                    padding:
                                                        "6px 12px",
                                                    borderRadius:
                                                        "8px",
                                                    fontWeight:
                                                        "bold",
                                                }}
                                            >
                                                MEDIUM
                                            </span>

                                        )}

                                    </td>

                                    {/* REVIEW ACTIONS */}

                                    <td>

                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "10px",
                                            }}
                                        >

                                            <button
                                                onClick={() =>
                                                    updateReviewStatus(
                                                        record.id,
                                                        "Investigating"
                                                    )
                                                }
                                                style={{
                                                    backgroundColor:
                                                        "#f59e0b",
                                                    color: "white",
                                                    border: "none",
                                                    padding:
                                                        "8px 12px",
                                                    borderRadius:
                                                        "8px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Investigating
                                            </button>

                                            <button
                                                onClick={() =>
                                                    updateReviewStatus(
                                                        record.id,
                                                        "Escalated"
                                                    )
                                                }
                                                style={{
                                                    backgroundColor:
                                                        "#dc2626",
                                                    color: "white",
                                                    border: "none",
                                                    padding:
                                                        "8px 12px",
                                                    borderRadius:
                                                        "8px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Escalate
                                            </button>

                                            <button
                                                onClick={() =>
                                                    updateReviewStatus(
                                                        record.id,
                                                        "Resolved"
                                                    )
                                                }
                                                style={{
                                                    backgroundColor:
                                                        "#16a34a",
                                                    color: "white",
                                                    border: "none",
                                                    padding:
                                                        "8px 12px",
                                                    borderRadius:
                                                        "8px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Resolve
                                            </button>

                                        </div>

                                        {/* REVIEW STATUS */}

                                        {record.review_status && (

                                            <div
                                                style={{
                                                    marginTop: "8px",
                                                    fontWeight:
                                                        "bold",
                                                    color: "#2563eb",
                                                }}
                                            >

                                                Status:
                                                {" "}
                                                {
                                                    record.review_status
                                                }

                                            </div>

                                        )}

                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td colSpan="7">

                                    No suspicious or failed
                                    records found

                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default AnalystReview;