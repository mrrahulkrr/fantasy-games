import React, { useState } from 'react';
import { Users, Trophy, Star, TrendingUp, Shield } from 'lucide-react';

function TeamDisplay({ team }) {
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!team?.name) return null;

  const totalPoints = team.players.reduce((sum, player) => sum + player.points, 0);
  const averagePoints = (totalPoints / team.players.length).toFixed(1);

  const positionGroups = team.players.reduce((acc, player) => {
    if (!acc[player.position]) {
      acc[player.position] = [];
    }
    acc[player.position].push(player);
    return acc;
  }, {});

  const getPositionColor = (position) => {
    const colors = {
      'Batsman': 'bg-yellow-400',
      'Bowler': 'bg-blue-400',
      'All-Rounder': 'bg-green-400',
      'Wicket-Keeper': 'bg-red-400'
    };
    return colors[position] || 'bg-gray-400';
  };

  const StatCard = ({ icon, title, value, color }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          {React.cloneElement(icon, { className: `h-5 w-5 ${color}` })}
          <p className="text-sm font-medium text-gray-600 truncate">{title}</p>
        </div>
        <div className="flex items-baseline space-x-1">
          <span className={`text-2xl font-bold ${color}`}>{value}</span>
          {title === 'Avg Points' && <span className="text-sm text-gray-500">pts</span>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Trophy className="h-6 w-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-800 truncate">{team.name}</h2>
          </div>
          <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium whitespace-nowrap">
            {team.players.length} Players
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Star />}
            title="Total Points"
            value={totalPoints}
            color="text-yellow-500"
          />
          <StatCard
            icon={<TrendingUp />}
            title="Avg Points"
            value={averagePoints}
            color="text-green-500"
          />
          <StatCard
            icon={<Users />}
            title="Squad Size"
            value={team.players.length}
            color="text-blue-500"
          />
          <StatCard
            icon={<Shield />}
            title="Formation"
            value="4-4-2"
            color="text-purple-500"
          />
        </div>

        <div className="border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 font-medium text-sm transition-colors duration-200 border-b-2 ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('positions')}
              className={`px-4 py-2 font-medium text-sm transition-colors duration-200 border-b-2 ${
                activeTab === 'positions'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              By Position
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'overview' ? (
          <div className="space-y-4">
            {team.players
              .sort((a, b) => b.points - a.points)
              .map((player) => (
                <div
                  key={player._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4 min-w-0">
                    <div className={`w-1.5 h-12 rounded-full ${getPositionColor(player.position)}`} />
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{player.name}</h4>
                      <p className="text-sm text-gray-500">{player.position}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-semibold text-gray-900">{player.points}</span>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(positionGroups).map(([position, players]) => (
              <div key={position} className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-1.5 h-6 rounded-full ${getPositionColor(position)}`} />
                  <h3 className="text-lg font-semibold text-gray-800">{position}s</h3>
                </div>
                <div className="space-y-2 pl-6">
                  {players.map(player => (
                    <div
                      key={player._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <span className="font-medium text-gray-900 truncate">{player.name}</span>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <span className="text-sm font-semibold text-gray-900">{player.points}</span>
                        <span className="text-sm text-gray-500">pts</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamDisplay;