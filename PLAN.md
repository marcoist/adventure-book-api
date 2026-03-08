# Adventure Book API - Implementation Plan

## Project Overview
A REST API for interactive adventure books where readers make choices that affect their journey and health points.

## Data Model Analysis

### Book Structure (from JSON samples)
```
Book:
  - title: String
  - author: String
  - difficulty: EASY | MEDIUM | HARD
  - categories: List<String> (FICTION, HORROR, ADVENTURE, etc.)
  - sections: List<Section>

Section:
  - id: Integer
  - text: String
  - type: BEGIN | NODE | END
  - options: List<Option> (empty for END sections)

Option:
  - description: String
  - gotoId: Integer
  - consequence: Consequence (optional)

Consequence:
  - type: LOSE_HEALTH | GAIN_HEALTH
  - value: Integer
  - text: String
```

### Player State (for Objectives 4-5)
```
PlayerSession:
  - playerId: UUID
  - bookId: Long
  - currentSectionId: Integer
  - healthPoints: Integer (starts at 10)
  - status: PLAYING | PAUSED | COMPLETED | DEAD
  - createdAt: LocalDateTime
  - updatedAt: LocalDateTime
```

### Book Validation Rules
A book is **invalid** if:
1. Has zero or more than one BEGIN section
2. Has no END section (can have multiple)
3. Any gotoId references a non-existent section
4. A non-END section has no options

---

## Implementation Plan by Objective

### Objective 1: List Books & Search
**Endpoints:**
- `GET /api/books` - List all books
- `GET /api/books?title=...&author=...&category=...&difficulty=...` - Search/filter

**Implementation:**
- Book entity with JPA
- BookRepository with custom query methods
- BookService with search logic
- BookController with REST endpoints
- Load sample JSON books on startup

**Files to create:**
- `model/Book.java` - JPA entity
- `model/Difficulty.java` - Enum
- `repository/BookRepository.java`
- `service/BookService.java`
- `controller/BookController.java`
- `dto/BookSummaryDTO.java` - List response (without sections)

---

### Objective 2: Book Details & Category Management
**Endpoints:**
- `GET /api/books/{id}` - Get book details
- `PATCH /api/books/{id}/categories` - Add/remove categories

**Implementation:**
- Categories as @ElementCollection or separate entity
- DTO for category operations

**Files to create/modify:**
- `dto/BookDetailDTO.java`
- `dto/CategoryUpdateDTO.java`

---

### Objective 3: Read Book & Navigate Sections
**Endpoints:**
- `POST /api/books/{id}/start` - Start reading (returns first section)
- `GET /api/books/{bookId}/sections/{sectionId}` - Get specific section
- `POST /api/books/{bookId}/sections/{sectionId}/choose?optionIndex=N` - Make choice

**Implementation:**
- Section, Option as embedded/related entities
- BookValidator to validate book structure on load
- Navigation logic in service

**Files to create:**
- `model/Section.java`
- `model/Option.java`
- `model/Consequence.java`
- `model/SectionType.java` - Enum
- `model/ConsequenceType.java` - Enum
- `service/BookValidator.java`
- `dto/SectionDTO.java`
- `dto/OptionDTO.java`

---

### Objective 4: Consequences & Health System
**Endpoints:**
- Modify `POST .../choose` to return health changes
- Response includes: new section, consequence applied, current health, isDead

**Implementation:**
- Track health in session/response
- Apply GAIN_HEALTH / LOSE_HEALTH
- Check death condition (health <= 0)

**Files to create/modify:**
- `dto/GameStateDTO.java` - Includes health, status
- `dto/ChoiceResultDTO.java`

---

### Objective 5 (Extra): Player Sessions & Progress
**Endpoints:**
- `POST /api/players` - Create player
- `GET /api/players/{id}/sessions` - List player sessions
- `POST /api/players/{id}/sessions` - Start new game (book + player)
- `GET /api/players/{playerId}/sessions/{sessionId}` - Get session state
- `PUT /api/players/{playerId}/sessions/{sessionId}/pause` - Pause game
- `PUT /api/players/{playerId}/sessions/{sessionId}/resume` - Resume game
- `POST /api/players/{playerId}/sessions/{sessionId}/choose` - Make choice

**Implementation:**
- Player entity
- GameSession entity with full state
- SessionRepository

**Files to create:**
- `model/Player.java`
- `model/GameSession.java`
- `model/SessionStatus.java` - Enum
- `repository/PlayerRepository.java`
- `repository/GameSessionRepository.java`
- `service/GameService.java`
- `controller/PlayerController.java`
- `controller/GameController.java`

---

### Objective 6 (Extra): Add New Books
**Endpoints:**
- `POST /api/books` - Create new book (with validation)
- `PUT /api/books/{id}` - Update book

**Implementation:**
- Book creation with validation
- JSON parsing for book upload

**Files to create:**
- `dto/BookCreateDTO.java`

---

## Project Structure

```
src/main/java/com/adventurebook/
├── AdventureBookApplication.java
├── config/
│   └── DataLoader.java              # Load sample books on startup
├── controller/
│   ├── BookController.java
│   ├── PlayerController.java        # Objective 5
│   └── GameController.java          # Objective 5
├── dto/
│   ├── BookSummaryDTO.java
│   ├── BookDetailDTO.java
│   ├── SectionDTO.java
│   ├── OptionDTO.java
│   ├── GameStateDTO.java
│   ├── ChoiceResultDTO.java
│   ├── CategoryUpdateDTO.java
│   └── BookCreateDTO.java           # Objective 6
├── exception/
│   ├── BookNotFoundException.java
│   ├── InvalidBookException.java
│   ├── InvalidChoiceException.java
│   └── GlobalExceptionHandler.java
├── model/
│   ├── Book.java
│   ├── Section.java
│   ├── Option.java
│   ├── Consequence.java
│   ├── Difficulty.java
│   ├── SectionType.java
│   ├── ConsequenceType.java
│   ├── Player.java                  # Objective 5
│   ├── GameSession.java             # Objective 5
│   └── SessionStatus.java           # Objective 5
├── repository/
│   ├── BookRepository.java
│   ├── PlayerRepository.java        # Objective 5
│   └── GameSessionRepository.java   # Objective 5
├── service/
│   ├── BookService.java
│   ├── BookValidator.java
│   └── GameService.java             # Objectives 4-5
└── util/
    └── BookJsonParser.java          # Parse sample JSON files

src/main/resources/
├── application.properties
└── books/                           # Copy sample books here
    ├── the-prisoner.json
    ├── crystal-caverns.json
    └── pirates-jade-sea.json

src/test/java/com/adventurebook/
├── controller/
│   └── BookControllerTest.java
├── service/
│   ├── BookServiceTest.java
│   └── BookValidatorTest.java
└── integration/
    └── BookApiIntegrationTest.java
```

---

## Technology Stack

- **Java 17+** (LTS version)
- **Spring Boot 3.x**
- **Spring Data JPA** - Database access
- **H2 Database** - In-memory for simplicity
- **Spring Validation** - Input validation
- **Lombok** - Reduce boilerplate
- **Jackson** - JSON parsing
- **SpringDoc OpenAPI** - API documentation (optional but impressive)

---

## Execution Order (Recommended)

### Phase 1: Foundation (Objectives 1-2)
1. Initialize Spring Boot project with Maven
2. Create entities: Book, Section, Option, Consequence, enums
3. Create BookRepository and BookService
4. Create BookController with list/search endpoints
5. Implement DataLoader to load sample JSON books
6. Add category management endpoints
7. Write tests

### Phase 2: Gameplay (Objectives 3-4)
1. Add BookValidator for validation rules
2. Create navigation endpoints (start, get section, choose)
3. Implement health/consequence system
4. Create GameStateDTO with full state response
5. Write tests

### Phase 3: Multiplayer (Objective 5 - if time permits)
1. Add Player and GameSession entities
2. Create session management endpoints
3. Implement save/pause/resume functionality
4. Write tests

### Phase 4: Book Creation (Objective 6 - if time permits)
1. Add book creation endpoint with validation
2. Write tests

---

## Key Design Decisions

1. **H2 In-Memory DB**: Simple setup, no external dependencies
2. **DTOs**: Separate from entities for API responses
3. **Stateless gameplay** (Obj 3-4): Return state in response, client maintains
4. **Stateful sessions** (Obj 5): Server-side persistence
5. **Validation on load**: Validate books when loaded/created, not on every read

---

## SOLID Principles Applied

This section explains how each SOLID principle is demonstrated in the codebase. Use this to prepare for interview questions.

### S - Single Responsibility Principle
> "A class should have only one reason to change."

**How we apply it:**

| Class | Single Responsibility |
|-------|----------------------|
| `BookController` | Only handles HTTP request/response mapping |
| `BookService` | Only contains book business logic |
| `BookRepository` | Only handles data persistence |
| `BookValidator` | Only validates book structure |
| `BookJsonParser` | Only parses JSON to domain objects |
| `GameService` | Only manages gameplay logic (health, navigation) |

**Example - Bad (violates SRP):**
```java
// DON'T DO THIS - Controller doing too much
@RestController
public class BookController {
    @GetMapping("/books/{id}")
    public Book getBook(@PathVariable Long id) {
        // Controller shouldn't contain business logic
        Book book = repository.findById(id);
        if (book == null) throw new NotFoundException();

        // Controller shouldn't validate
        if (book.getSections().stream().filter(s -> s.getType() == BEGIN).count() != 1) {
            throw new InvalidBookException();
        }
        return book;
    }
}
```

**Example - Good (follows SRP):**
```java
// Controller only maps HTTP
@RestController
@RequiredArgsConstructor
public class BookController {
    private final BookService bookService;

    @GetMapping("/books/{id}")
    public ResponseEntity<BookDetailDTO> getBook(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }
}

// Service handles business logic
@Service
@RequiredArgsConstructor
public class BookService {
    private final BookRepository repository;
    private final BookValidator validator;

    public BookDetailDTO getBookById(Long id) {
        Book book = repository.findById(id)
            .orElseThrow(() -> new BookNotFoundException(id));
        return BookDetailDTO.from(book);
    }
}

// Validator only validates
@Component
public class BookValidator {
    public ValidationResult validate(Book book) {
        // Only validation logic here
    }
}
```

---

### O - Open/Closed Principle
> "Software entities should be open for extension, but closed for modification."

**How we apply it:**

1. **Consequence Handlers** - Add new consequence types without modifying existing code:

```java
// Interface for consequence handling
public interface ConsequenceHandler {
    ConsequenceType getType();
    GameState apply(GameState state, Consequence consequence);
}

// Existing implementation - NEVER needs to change
@Component
public class LoseHealthHandler implements ConsequenceHandler {
    @Override
    public ConsequenceType getType() { return ConsequenceType.LOSE_HEALTH; }

    @Override
    public GameState apply(GameState state, Consequence consequence) {
        int newHealth = state.getHealthPoints() - consequence.getValue();
        return state.withHealthPoints(Math.max(0, newHealth));
    }
}

// EXTEND by adding new handler - no modification to existing code
@Component
public class GainHealthHandler implements ConsequenceHandler {
    @Override
    public ConsequenceType getType() { return ConsequenceType.GAIN_HEALTH; }

    @Override
    public GameState apply(GameState state, Consequence consequence) {
        int newHealth = state.getHealthPoints() + consequence.getValue();
        return state.withHealthPoints(Math.min(10, newHealth)); // Cap at 10
    }
}

// Future: Add GAIN_ITEM, LOSE_ITEM, TELEPORT, etc. without changing existing code!
```

2. **Validation Rules** - Add new validation rules without modifying validator:

```java
public interface BookValidationRule {
    Optional<String> validate(Book book);
}

@Component
public class SingleBeginningRule implements BookValidationRule {
    @Override
    public Optional<String> validate(Book book) {
        long beginCount = book.getSections().stream()
            .filter(s -> s.getType() == SectionType.BEGIN).count();
        if (beginCount != 1) {
            return Optional.of("Book must have exactly one BEGIN section");
        }
        return Optional.empty();
    }
}

@Component
public class HasEndingRule implements BookValidationRule { /* ... */ }

@Component
public class ValidReferencesRule implements BookValidationRule { /* ... */ }

// Validator uses all rules - add new rules without touching this class
@Component
@RequiredArgsConstructor
public class BookValidator {
    private final List<BookValidationRule> rules; // Spring injects all implementations

    public ValidationResult validate(Book book) {
        List<String> errors = rules.stream()
            .map(rule -> rule.validate(book))
            .filter(Optional::isPresent)
            .map(Optional::get)
            .toList();
        return new ValidationResult(errors.isEmpty(), errors);
    }
}
```

---

### L - Liskov Substitution Principle
> "Subtypes must be substitutable for their base types."

**How we apply it:**

1. **Section types behave consistently:**

```java
// All section types can be processed the same way
public abstract class Section {
    public abstract SectionType getType();
    public abstract String getText();
    public abstract List<Option> getOptions();

    // Default behavior that subtypes can rely on
    public boolean isEnding() {
        return getType() == SectionType.END;
    }
}

// Any Section subtype works wherever Section is expected
public class GameService {
    public GameState processSection(Section section, GameState state) {
        // Works with BeginSection, NodeSection, EndSection
        // No instanceof checks needed - all behave as Section
        if (section.isEnding()) {
            return state.withStatus(SessionStatus.COMPLETED);
        }
        return state.withCurrentSection(section);
    }
}
```

2. **Repository pattern:**

```java
// All repositories follow same contract
public interface CrudRepository<T, ID> {
    Optional<T> findById(ID id);
    T save(T entity);
    void delete(T entity);
}

// BookRepository, PlayerRepository, GameSessionRepository
// all substitutable where CrudRepository is expected
```

---

### I - Interface Segregation Principle
> "Many specific interfaces are better than one general interface."

**How we apply it:**

1. **Separate interfaces for different operations:**

```java
// DON'T DO THIS - Fat interface
public interface BookOperations {
    List<Book> findAll();
    Book findById(Long id);
    Book save(Book book);
    void delete(Long id);
    ValidationResult validate(Book book);
    GameState startGame(Long bookId);
    GameState makeChoice(Long bookId, int optionIndex, GameState state);
}

// DO THIS - Segregated interfaces
public interface BookQueryService {
    List<BookSummaryDTO> findAll(BookSearchCriteria criteria);
    BookDetailDTO findById(Long id);
}

public interface BookCommandService {
    BookDetailDTO save(BookCreateDTO book);
    void delete(Long id);
    BookDetailDTO updateCategories(Long id, CategoryUpdateDTO update);
}

public interface BookValidationService {
    ValidationResult validate(Book book);
}

public interface GamePlayService {
    GameState startGame(Long bookId);
    GameState makeChoice(Long bookId, int optionIndex, GameState state);
}
```

2. **DTOs only expose what's needed:**

```java
// BookSummaryDTO - for list view (no sections)
public record BookSummaryDTO(
    Long id,
    String title,
    String author,
    Difficulty difficulty,
    List<String> categories
) {}

// BookDetailDTO - for detail view (includes validation status)
public record BookDetailDTO(
    Long id,
    String title,
    String author,
    Difficulty difficulty,
    List<String> categories,
    boolean valid,
    int sectionCount
) {}

// SectionDTO - for gameplay (only relevant fields)
public record SectionDTO(
    Integer id,
    String text,
    SectionType type,
    List<OptionDTO> options
) {}
```

---

### D - Dependency Inversion Principle
> "Depend on abstractions, not concretions."

**How we apply it:**

1. **Services depend on interfaces, not implementations:**

```java
// High-level module (Service) depends on abstraction (Repository interface)
@Service
public class BookService {
    // Depends on interface, not JpaBookRepository
    private final BookRepository bookRepository;

    // Constructor injection - Spring provides implementation
    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }
}

// Repository is an interface
public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByTitleContainingIgnoreCase(String title);
    List<Book> findByAuthorContainingIgnoreCase(String author);
}
```

2. **Controllers depend on service interfaces:**

```java
// Controller depends on abstraction
@RestController
@RequiredArgsConstructor
public class BookController {
    private final BookService bookService; // Interface/abstraction

    // Not: private final BookServiceImpl bookService; // Concrete class
}
```

3. **Easy to test with mocks:**

```java
@ExtendWith(MockitoExtension.class)
class BookServiceTest {
    @Mock
    private BookRepository bookRepository; // Mock the abstraction

    @Mock
    private BookValidator bookValidator;

    @InjectMocks
    private BookService bookService; // Inject mocks

    @Test
    void shouldReturnBookWhenFound() {
        // Arrange
        Book book = new Book();
        book.setId(1L);
        book.setTitle("Test Book");
        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));

        // Act
        BookDetailDTO result = bookService.getBookById(1L);

        // Assert
        assertEquals("Test Book", result.title());
    }
}
```

---

## SOLID Quick Reference Card (for interview)

| Principle | One-liner | Example in Project |
|-----------|-----------|-------------------|
| **S**ingle Responsibility | One class, one job | `BookValidator` only validates, `BookService` only business logic |
| **O**pen/Closed | Extend, don't modify | Add new `ConsequenceHandler` without changing existing handlers |
| **L**iskov Substitution | Subtypes are interchangeable | Any `Section` subtype works in `GameService.processSection()` |
| **I**nterface Segregation | Small, focused interfaces | `BookQueryService` vs `BookCommandService` vs `GamePlayService` |
| **D**ependency Inversion | Depend on abstractions | `BookService` depends on `BookRepository` interface, not impl |

---

## Interview Talking Points

1. **Why SOLID matters:**
   - Maintainability: Changes are isolated
   - Testability: Easy to mock dependencies
   - Flexibility: Add features without breaking existing code

2. **Trade-offs:**
   - More classes/interfaces = more complexity upfront
   - For small projects, full SOLID can be overkill
   - Balance pragmatism with principles

3. **How Spring helps:**
   - Dependency Injection makes DIP natural
   - `@Component` scanning auto-wires implementations
   - Interface-based proxies for AOP

---

## Sample API Responses

### GET /api/books
```json
[
  {
    "id": 1,
    "title": "The Prisoner",
    "author": "Daniel El Fuego",
    "difficulty": "HARD",
    "categories": ["ADVENTURE", "HORROR"]
  }
]
```

### GET /api/books/1
```json
{
  "id": 1,
  "title": "The Prisoner",
  "author": "Daniel El Fuego",
  "difficulty": "HARD",
  "categories": ["ADVENTURE"],
  "valid": true,
  "sectionCount": 6
}
```

### POST /api/books/1/start
```json
{
  "section": {
    "id": 1,
    "text": "You wake up in what seems to be...",
    "type": "BEGIN",
    "options": [
      {"index": 0, "description": "You try to open the door"},
      {"index": 1, "description": "You look under the bed"}
    ]
  },
  "healthPoints": 10,
  "status": "PLAYING"
}
```

### POST /api/books/1/sections/1/choose?optionIndex=1
```json
{
  "section": {
    "id": 20,
    "text": "You don't see anything, it's too dark.",
    "type": "NODE",
    "options": [...]
  },
  "consequenceApplied": null,
  "healthPoints": 10,
  "status": "PLAYING"
}
```
