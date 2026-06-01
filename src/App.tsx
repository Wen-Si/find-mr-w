import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Opening from "@/pages/Opening";
import GameHome from "@/pages/GameHome";
import CaseInvestigation from "@/pages/CaseInvestigation";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Opening />} />
        <Route path="/game" element={<GameHome />} />
        <Route path="/case/:caseId" element={<CaseInvestigation />} />
      </Routes>
    </Router>
  );
}
