import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useGameStore } from './store/gameStore';
import Opening from './pages/Opening';
import Auth from './pages/Auth';
import CharacterSetup from './pages/CharacterSetup';
import GameHome from './pages/GameHome';
import CaseInvestigation from './pages/CaseInvestigation';
import StoryScene from './pages/StoryScene';

function App() {
  const { isAuthenticated, checkAuth } = useGameStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Opening />} />
        <Route 
          path="/auth" 
          element={isAuthenticated ? <Navigate to="/game" replace /> : <Auth />} 
        />
        <Route 
          path="/setup" 
          element={isAuthenticated ? <CharacterSetup /> : <Navigate to="/auth" replace />} 
        />
        <Route 
          path="/game" 
          element={isAuthenticated ? <GameHome /> : <Navigate to="/auth" replace />} 
        />
        <Route 
          path="/case/:caseId" 
          element={isAuthenticated ? <CaseInvestigation /> : <Navigate to="/auth" replace />} 
        />
        <Route 
          path="/story/:caseId" 
          element={isAuthenticated ? <StoryScene /> : <Navigate to="/auth" replace />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
