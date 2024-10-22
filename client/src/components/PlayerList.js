import React, { useState } from 'react';
import { Search, Filter, UserCircle } from 'lucide-react';

function PlayerList({ players }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState('');

  const positions = ['Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper'];

  const filteredPlayers = players
    .filter(player => 
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterPosition === '' || player.position === filterPosition)
    )
    .sort((a, b) => b.points - a.points);

  const getPositionColor = (position) => {
    const colors = {
      'Batsman': 'bg-blue-100 text-blue-800',
      'Bowler': 'bg-red-100 text-red-800',
      'All-Rounder': 'bg-purple-100 text-purple-800',
      'Wicket-Keeper': 'bg-yellow-100 text-yellow-800'
    };
    return colors[position] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search players..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <button
            onClick={() => setFilterPosition('')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filterPosition === '' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {positions.map(position => (
            <button
              key={position}
              onClick={() => setFilterPosition(position)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filterPosition === position
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {position}s
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filteredPlayers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No players found matching your criteria</p>
          </div>
        ) : (
          filteredPlayers.map((player) => (
            <div
              key={player._id}
              className="flex items-center p-4 bg-white border border-gray-100 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="mr-4">
                <UserCircle className="h-10 w-10 text-gray-400" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{player.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPositionColor(player.position)}`}>
                      {player.position}
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium text-gray-600">
                      {player.team}
                    </span>
                  </div>
                </div>
                
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Rating: {player.points}
                  </span>
                  <div className="flex items-center">
                    <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(player.points / 100) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PlayerList;