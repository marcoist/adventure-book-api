# Adventure Book API

A REST API for interactive adventure books where readers make choices that affect their journey and health points. Includes a React-based web UI.

## Prerequisites

- **Java 17** or higher
- **Maven 3.6+** (or use the Maven wrapper)
- **Node.js 18+** (for the UI)

## Build & Run

### Build the project
```bash
mvn clean package
```

### Run the application
```bash
mvn spring-boot:run
```

Or run the JAR directly:
```bash
java -jar target/adventure-book-api-1.0.0-SNAPSHOT.jar
```

The application starts on **http://localhost:8080**

### Run the Web UI

```bash
cd adventure-book-ui
npm install
npm run dev
```

The UI starts on **http://localhost:5173** and proxies API requests to `localhost:8080`.

### Run tests
```bash
mvn test
```

## API Documentation

Once running, access the interactive API documentation at:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api-docs

## API Endpoints Overview

### Books (Objectives 1-2, 6)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | List all books (with optional filters) |
| GET | `/api/books?title=...&author=...&category=...&difficulty=...` | Search books |
| GET | `/api/books/{id}` | Get book details |
| PATCH | `/api/books/{id}/categories` | Add/remove categories |
| POST | `/api/books` | Create new book (Objective 6) |

### Players (Objective 5)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/players` | Create new player |
| GET | `/api/players` | List all players |
| GET | `/api/players/{id}` | Get player details |

### Game Sessions (Objectives 3-5)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/players/{playerId}/sessions` | Start new game |
| GET | `/api/players/{playerId}/sessions` | List player's sessions |
| GET | `/api/players/{playerId}/sessions/{sessionId}` | Get session state |
| POST | `/api/players/{playerId}/sessions/{sessionId}/choose?optionIndex=N` | Make a choice |
| PUT | `/api/players/{playerId}/sessions/{sessionId}/pause` | Pause game |
| PUT | `/api/players/{playerId}/sessions/{sessionId}/resume` | Resume game |

## Quick Start Example

```bash
# 1. Create a player
curl -X POST http://localhost:8080/api/players \
  -H "Content-Type: application/json" \
  -d '{"username": "adventurer"}'

# 2. List available books
curl http://localhost:8080/api/books

# 3. Start a game (assuming player ID 1, book ID 1)
curl -X POST http://localhost:8080/api/players/1/sessions \
  -H "Content-Type: application/json" \
  -d '{"bookId": 1}'

# 4. Make a choice (option index 0)
curl -X POST "http://localhost:8080/api/players/1/sessions/1/choose?optionIndex=0"
```

## Book Validation Rules

A book is considered **invalid** if:
1. Has zero or more than one BEGIN section
2. Has no END section (can have multiple endings)
3. Any option references a non-existent section
4. A non-END section has no options

## Game Mechanics

- Players start with **10 health points**
- Choices may have consequences: `LOSE_HEALTH` or `GAIN_HEALTH`
- When health reaches **0**, the player dies (status: `DEAD`)
- Reaching an END section completes the game (status: `COMPLETED`)

## Project Structure

```
src/main/java/com/pictet/adventurebook/
├── controller/          # REST endpoints
├── service/             # Business logic
├── repository/          # Data access (JPA)
├── model/               # Domain entities
├── dto/                 # Data transfer objects
├── validation/          # Book validation (SOLID: OCP)
│   └── rules/           # Individual validation rules
├── exception/           # Custom exceptions
└── config/              # Configuration & data loading
```

## SOLID Principles Applied

### Single Responsibility (SRP)
- Controllers handle HTTP only
- Services contain business logic
- Validators only validate
- Repositories only persist data

### Open/Closed (OCP)
- `BookValidationRule` interface allows adding new validation rules without modifying `BookValidator`
- Add new rules by creating new `@Component` classes implementing `BookValidationRule`

### Dependency Inversion (DIP)
- Services depend on repository interfaces, not implementations
- Spring DI wires the implementations

## Technology Stack

- **Spring Boot 3.2** - Application framework
- **Spring Data JPA** - Database access
- **H2 Database** - In-memory database
- **Lombok** - Boilerplate reduction
- **SpringDoc OpenAPI** - API documentation
- **JUnit 5** - Testing

## H2 Console (for debugging)

Access the H2 database console at: http://localhost:8080/h2-console

- **JDBC URL**: `jdbc:h2:mem:adventurebook`
- **Username**: `sa`
- **Password**: (empty)

## Sample Books

The application loads sample adventure books on startup from `src/main/resources/books/`:
- `the-prisoner.json` - Hard difficulty, escape room theme
- `crystal-caverns.json` - Easy difficulty, fantasy exploration
- `pirates-jade-sea.json` - Medium difficulty, pirate adventure

## Web UI

The `adventure-book-ui/` directory contains a React SPA for playing and managing adventure books.

### Features

- **Player Management** - Create and select players
- **Book Browsing** - Grid view with filtering by title and difficulty
- **Gameplay** - Immersive story display with animated health bar and choice buttons
- **Game States** - Victory/Game Over screens, pause/resume functionality
- **Book Editor** - Visual editor to create new adventure books

### Tech Stack

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- React Router (navigation)
- TanStack Query (API state management)
- Lucide React (icons)

### UI Project Structure

```
adventure-book-ui/
├── src/
│   ├── api/           # API client
│   ├── components/    # React components
│   │   ├── common/    # Reusable UI (Button, Card, Modal, etc.)
│   │   ├── game/      # Gameplay (GameScreen, ChoiceButton, etc.)
│   │   ├── books/     # Book management (BookList, BookEditor, etc.)
│   │   └── player/    # Player management
│   ├── pages/         # Route pages
│   └── types/         # TypeScript interfaces
└── vite.config.ts     # Vite config with API proxy
```
