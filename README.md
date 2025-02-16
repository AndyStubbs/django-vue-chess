# Django-Vue Chess App

## Overview
The **Django-Vue Chess App** is a web-based chess website. The website integrates Django for 
backend management and Vue.js for a dynamic, interactive frontend. Users can engage in chess 
games against AI bots. It's not complete but does have a working chess game and includes
a sandbox of UI components I built for practice. Also has login/registration and session 
authentication via JWT and a REST API.

### AI Bots
- **Randy**: A beginner-friendly bot that makes completely random moves, ideal for kids or absolute 
beginners.
- **Sandy**: A more challenging asynchronous bot based on Zhang Zeyu's chess engine, modified for 
seamless integration into this app.

### Current Limitations
- **Time Mode**: While the timer functions, there are no consequences for running out of time.
- **Easy AI**: Both AI's are pretty easy and could be improved.
- **User Authentication**: Login is functional, but multiplayer games and matchmaking is not yet
 implemented.

### Highlights
The application showcases custom Vue.js components for an engaging chess-playing experience:
- **Chessboard & Game Pieces**: Drag-and-drop functionality with animations, move highlighting, and 
seamless handling of edge cases like invalid moves.
- **Custom UI Components**:
  - **CustomInput**: A custom input component that makes it easy to implement input groups for text
and passwords.
  - **CustomButton**: A custom button component applies different styles of buttons including icon
buttons, text buttons, and different styled buttons.
  - **CustomModal**: For displaying key information and managing settings.
  - **CustomToast**: Elegant, non-intrusive messaging system for feedback and updates.
  - **ToggleGroup**: A component that allows a unique way of toggling options that looks nicer than
a radio group and uses buttons to toggle options. 

## Features
- **User Authentication**: Secure login and registration using Django.
- **Game Modes**:
  - Play against various AI bots.
- **Real-Time Gameplay**: Chessboard with drag-and-drop piece movement.
- **Dark Mode**: Toggle between light and dark themes.

## Technologies Used
- **Frontend**: Vue.js with Vite for development and Pinia for state management.
- **Backend**: Django with Django REST Framework (DRF).
- **Database**: SQLLite
- **Chess Engine**: Chess.js for game logic and a modified version of Zhang Zeyu's chess engine.
- **Other Tools**:
  - Axios for HTTP requests.
  - JWT for handling sessions in REST Framework.

## Installation
### Prerequisites
- Python 3.8+
- Node.js 16+
- SQLLite
