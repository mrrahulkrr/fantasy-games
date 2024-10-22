// client/src/components/TeamForm.js
import React, { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

function TeamForm({ players, createTeam }) {
  const [teamName, setTeamName] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!teamName.trim()) {
      newErrors.teamName = 'Team name is required';
    } else if (teamName.length < 3) {
      newErrors.teamName = 'Team name must be at least 3 characters';
    }

    const positions = {
      'Batsman': { min: 3, max: 5 },
      'Bowler': { min: 3, max: 4 },
      'All-Rounder': { min: 1, max: 3 }
    };

    const selectedPositions = selectedPlayers.reduce((acc, playerId) => {
      const player = players.find(p => p._id === playerId);
      acc[player.position] = (acc[player.position] || 0) + 1;
      return acc;
    }, {});

    for (const [position, requirements] of Object.entries(positions)) {
      const count = selectedPositions[position] || 0;
      if (count < requirements.min) {
        newErrors.players = `Team must have at least ${requirements.min} ${position}(s)`;
        break;
      }
      if (count > requirements.max) {
        newErrors.players = `Team can't have more than ${requirements.max} ${position}(s)`;
        break;
      }
    }
    // Ensure total team size is 11
  const totalPlayers = selectedPlayers.length;
  if (totalPlayers !== 11) {
    newErrors.players = `Team must have exactly 11 players (currently has ${totalPlayers})`;
  }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [teamName, selectedPlayers, players]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await createTeam({ name: teamName, players: selectedPlayers });
      toast.success('Team created successfully!');
      setTeamName('');
      setSelectedPlayers([]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerSelection = (playerId) => {
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter(id => id !== playerId));
    } else if (selectedPlayers.length < 11) {
      setSelectedPlayers([...selectedPlayers, playerId]);
    } else {
      toast.error('You can only select up to 11 players');
    }
  };

  const getPositionCounts = useCallback(() => {
    return selectedPlayers.reduce((acc, playerId) => {
      const player = players.find(p => p._id === playerId);
      acc[player.position] = (acc[player.position] || 0) + 1;
      return acc;
    }, {});
  }, [selectedPlayers, players]);

  const positionCounts = getPositionCounts();

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">Create Your Team</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="teamName">
          Team Name
        </label>
        <input
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
            errors.teamName ? 'border-red-500' : ''
          }`}
          id="teamName"
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Enter team name"
        />
        {errors.teamName && (
          <p className="text-red-500 text-xs italic">{errors.teamName}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Select Players ({selectedPlayers.length}/11)
        </label>
        
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div className="text-sm">
            <p>Goalkeepers: {positionCounts['Goalkeeper'] || 0}/1</p>
            <p>Defenders: {positionCounts['Defender'] || 0}/4</p>
          </div>
          <div className="text-sm">
            <p>Midfielders: {positionCounts['Midfielder'] || 0}/4</p>
            <p>Forwards: {positionCounts['Forward'] || 0}/2</p>
          </div>
        </div>

        {errors.players && (
          <p className="text-red-500 text-xs italic mb-2">{errors.players}</p>
        )}

        <div className="max-h-96 overflow-y-auto">
          {players.map((player) => (
            <div key={player._id} className="mb-2 flex items-center">
              <label className="inline-flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded w-full">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600"
                  checked={selectedPlayers.includes(player._id)}
                  onChange={() => handlePlayerSelection(player._id)}
                />
                <span className="ml-2 flex-1">{player.name}</span>
                <span className="text-sm text-gray-600">{player.position}</span>
                <span className="ml-2 text-sm text-gray-600">Points: {player.points}</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <button
        className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        type="submit"
        disabled={loading}
      >
        {loading ? 'Creating Team...' : 'Create Team'}
      </button>
    </form>
  );
}

export default TeamForm;