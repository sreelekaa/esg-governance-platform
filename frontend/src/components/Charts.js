import React from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

function Charts({ records }) {

  // =========================
  // TOTAL EMISSIONS BY SOURCE
  // =========================

  const emissionsData = [

    {
      source: "SAP",

      emissions: records
        .filter((r) => r.source_type === "sap")
        .reduce(
          (sum, r) => sum + r.co2_emission,
          0
        ),
    },

    {
      source: "Utility",

      emissions: records
        .filter(
          (r) => r.source_type === "utility"
        )
        .reduce(
          (sum, r) => sum + r.co2_emission,
          0
        ),
    },

    {
      source: "Travel",

      emissions: records
        .filter(
          (r) => r.source_type === "travel"
        )
        .reduce(
          (sum, r) => sum + r.co2_emission,
          0
        ),
    },
  ];

  // =========================
  // SUSPICIOUS VS NORMAL
  // =========================

  const suspiciousData = [

    {
      name: "Normal",

      value: records.filter(
        (r) => !r.suspicious
      ).length,
    },

    {
      name: "Suspicious",

      value: records.filter(
        (r) => r.suspicious
      ).length,
    },
  ];

  // =========================
  // APPROVAL STATUS
  // =========================

  const approvalData = [

    {
      status: "Approved",

      count: records.filter(
        (r) => r.approved
      ).length,
    },

    {
      status: "Pending",

      count: records.filter(
        (r) => !r.approved
      ).length,
    },

    {
      status: "Failed",

      count: records.filter(
        (r) =>
          r.validation_status === "failed"
      ).length,
    },
  ];

  const COLORS = [
    "#2563eb",
    "#f59e0b",
    "#7c3aed",
  ];

  return (

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(3, 1fr)",

        gap: "20px",

        marginBottom: "30px",
      }}
    >

      {/* ========================= */}
      {/* EMISSIONS BAR CHART */}
      {/* ========================= */}

      <div
        style={{
          background: "white",

          padding: "20px",

          borderRadius: "15px",

          boxShadow:
            "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >

        <h3>
          CO₂ Emissions by Source
        </h3>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <BarChart data={emissionsData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="source" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="emissions"
              fill="#2563eb"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* ========================= */}
      {/* SUSPICIOUS PIE CHART */}
      {/* ========================= */}

      <div
        style={{
          background: "white",

          padding: "20px",

          borderRadius: "15px",

          boxShadow:
            "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >

        <h3>
          Suspicious Records
        </h3>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <PieChart>

            <Pie
              data={suspiciousData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label
            >

              {suspiciousData.map(
                (entry, index) => (

                  <Cell
                    key={`cell-${index}`}
                    fill={
                      COLORS[index % COLORS.length]
                    }
                  />

                )
              )}

            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

      </div>

      {/* ========================= */}
      {/* APPROVAL STATUS CHART */}
      {/* ========================= */}

      <div
        style={{
          background: "white",

          padding: "20px",

          borderRadius: "15px",

          boxShadow:
            "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >

        <h3>
          Approval Workflow
        </h3>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <BarChart data={approvalData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="status" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="count"
              fill="#16a34a"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default Charts;