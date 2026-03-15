import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Events from './pages/Events';
import Team from './pages/Team';
import Resources from './pages/Resources';
import Practice from './pages/Practice';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import ProblemList from './pages/ProblemList';
import GameMode from './pages/GameMode';

export default function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<Events />} />
                <Route path="/team" element={<Team />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/practice" element={<Practice />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/game" element={<ProblemList />} />
                <Route path="/game/:problemId" element={<GameMode />} />
            </Routes>
        </>
    );
}
