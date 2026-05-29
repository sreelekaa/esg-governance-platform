import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import AuditLogs from "./pages/AuditLogs";
import AnalystReview from "./pages/AnalystReview";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/audit-logs"
          element={<AuditLogs />}
        />

        <Route
          path="/analyst-review"
          element={<AnalystReview />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;