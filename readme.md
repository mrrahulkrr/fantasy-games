# Fantasy Game Feature

A simple fantasy game feature where users can create and manage their fantasy teams.

## Features

- View available players with their positions and points
- Create teams with exactly 11 players
- Position-based team validation (1 GK, 4 DEF, 4 MID, 2 FWD)
- Real-time form validation
- Responsive design
- Error handling and user feedback

## Tech Stack

- Frontend: React, TailwindCSS, React Hot Toast
- Backend: Node.js, Express.js
- Database: MongoDB
- Additional Tools: Express Validator, Mongoose

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fantasy-game
```

2. Install dependencies:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Create a `.env` file in the server directory:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
```

4. Start the development servers:
```bash
# Start backend server (from server directory)
npm run dev

# Start frontend server (from client directory)
npm start
```

## Project Structure

- `/client`: React frontend application
- `/server`: Node.js/Express backend application
- `/server/models`: MongoDB models
- `/server/routes`: API routes
- `/server/middleware`: Custom middleware

## API Endpoints

- `GET /players`: Get all available players
- `POST /teams`: Create a new team
- `GET /teams/:id`: Get team by ID

## Future Improvements

- User authentication
- Team management (edit, delete)
- Player statistics and performance tracking
- League creation and management
- Real-time updates using WebSocket

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.