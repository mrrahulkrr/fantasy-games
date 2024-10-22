const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const { ApiError } = require('../middleware/errorHandler');
const { teamValidationRules, validateRequest } = require('../middleware/validation');

// Create team with validation
router.post('/', teamValidationRules, validateRequest, async (req, res, next) => {
  try {
    // Check for duplicate team name
    const existingTeam = await Team.findOne({ name: req.body.name });
    if (existingTeam) {
      throw new ApiError(400, 'Team name already exists');
    }

    // Validate player positions
    const Player = require('../models/Player');
    const players = await Player.find({ _id: { $in: req.body.players } });
    
    if (players.length !== 11) {
      throw new ApiError(400, 'A cricket team must have exactly 11 players');
    }

    // Cricket team composition requirements
    const positions = {
      'Batsman': { min: 3, max: 5, name: 'Batsman' },
      'Bowler': { min: 3, max: 4, name: 'Bowler' },
      'All-Rounder': { min: 1, max: 3, name: 'All-Rounder' },
    };

    // Count selected positions
    const selectedPositions = players.reduce((acc, player) => {
      acc[player.position] = (acc[player.position] || 0) + 1;
      return acc;
    }, {});

    // Validate team composition
    for (const [position, requirements] of Object.entries(positions)) {
      const count = selectedPositions[position] || 0;
      
      if (count < requirements.min) {
        throw new ApiError(
          400, 
          `Team must have at least ${requirements.min} ${requirements.name}${requirements.min > 1 ? 's' : ''}`
        );
      }
      
      if (count > requirements.max) {
        throw new ApiError(
          400, 
          `Team cannot have more than ${requirements.max} ${requirements.name}${requirements.max > 1 ? 's' : ''}`
        );
      }
    }

    // Additional cricket-specific validations
    // const wicketKeepers = selectedPositions['Wicket-Keeper'] || 0;
    // if (wicketKeepers !== 1) {
    //   throw new ApiError(400, 'Team must have exactly 1 Wicket-Keeper');
    // }

    // Ensure minimum bowling options (combination of Bowlers and All-Rounders)
    const bowlingOptions = (selectedPositions['Bowler'] || 0) + (selectedPositions['All-Rounder'] || 0);
    if (bowlingOptions < 5) {
      throw new ApiError(400, 'Team must have at least 5 bowling options (Bowlers + All-Rounders)');
    }

    // Create new team
    const team = new Team({
      name: req.body.name,
      players: req.body.players,
      captain: req.body.captain, // Optional: Add captain field if needed
      viceCaptain: req.body.viceCaptain // Optional: Add vice-captain field if needed
    });

    const newTeam = await team.save();

    // Populate players before sending the response
    await newTeam.populate('players');
    res.status(201).json(newTeam);
  } catch (err) {
    next(err);
  }
});

// Get a team by ID with populated players
router.get('/:id', async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id).populate('players');
    if (!team) {
      throw new ApiError(404, 'Team not found');
    }
    res.json(team);
  } catch (err) {
    next(err);
  }
});

// Get team statistics
router.get('/:id/statistics', async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id).populate('players');
    if (!team) {
      throw new ApiError(404, 'Team not found');
    }

    // Calculate team statistics
    const statistics = {
      totalBatsmen: team.players.filter(p => p.position === 'Batsman').length,
      totalBowlers: team.players.filter(p => p.position === 'Bowler').length,
      totalAllRounders: team.players.filter(p => p.position === 'All-Rounder').length,
      wicketKeeper: team.players.filter(p => p.position === 'Wicket-Keeper').length,
      averagePoints: team.players.reduce((acc, player) => acc + player.points, 0) / team.players.length,
      playersByTeam: team.players.reduce((acc, player) => {
        acc[player.team] = (acc[player.team] || 0) + 1;
        return acc;
      }, {})
    };

    res.json(statistics);
  } catch (err) {
    next(err);
  }
});

module.exports = router;