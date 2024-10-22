import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlayerList from './components/PlayerList';
import TeamForm from './components/TeamForm';
import TeamDisplay from './components/TeamDisplay';
import { Trophy } from 'lucide-react';

function App() {
  const [players, setPlayers] = useState([]);
  const [team, setTeam] = useState({ name: '', players: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get('http://localhost:5000/players');
        setPlayers(res.data);
      } catch (err) {
        setError('Failed to load players. Please try again later.');
        console.error("error fetching players : ", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  const createTeam = async (teamData) => {
    try {
      const res = await axios.post('http://localhost:5000/teams', teamData);
      setTeam(res.data);
    } catch (error) {
      console.error('Error creating team:', error);
      throw error;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Trophy className="h-8 w-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-800">Fantasy League Manager</h1>
            </div>
            {team.name && (
              <div className="text-sm text-gray-600">
                Current Team: <span className="font-semibold">{team.name}</span>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-64"></div>
                <div className="h-4 bg-gray-200 rounded w-52"></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Players</h2>
                  <PlayerList players={players} />
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <TeamForm players={players} createTeam={createTeam} />
                </div>
                {team.name && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <TeamDisplay team={team} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-600 text-sm">
            Fantasy League Manager © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;