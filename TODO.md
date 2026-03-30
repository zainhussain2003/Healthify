# Healthify — Task Tracker

`[MVP]` = critical path for Phase 1 launch. Strike through items as completed.

---

## Setup & Infrastructure

- [x] `[MVP]` Initialize React Native project with TypeScript template
- [x] `[MVP]` Initialize Spring Boot 3 project (Java 21, Maven/Gradle, PostgreSQL driver, Spring Security, Spring Data JPA)
- [x] `[MVP]` Set up PostgreSQL database (local dev instance + schema migrations with Flyway)
- [x] `[MVP]` Configure environment variable management (`.env` for local, secrets manager for production)
- [x] `[MVP]` Set up Git repository with `.gitignore` for Java, React Native, and Python
- [x] `[MVP]` Configure Cucumber + JUnit 5 test runner in Spring Boot project
- [ ] Initialize Python FastAPI microservice project structure (Poetry, Pydantic, pytest)
- [x] Set up CI pipeline (GitHub Actions) — build, test (unit + integration + safety traps) on every push/PR

---

## Backend (Spring Boot)

- [x] `[MVP]` Design PostgreSQL schema: `users`, `recipes`, `saved_recipes`, `baking_substitutions`
- [x] `[MVP]` Implement user registration and login (JWT-based authentication)
- [x] `[MVP]` Implement `POST /api/v1/recipes/parse` — accept raw recipe text, return structured recipe (ingredients list + instructions)
- [x] `[MVP]` Implement `POST /api/v1/recipes/healthify` — accept structured recipe + slider intensity, return substituted recipe with "why" explanations
- [x] `[MVP]` Implement `GET/POST /api/v1/recipes/saved` — save and retrieve user's recipes
- [x] `[MVP]` Implement `RecipeScraperPort` interface (stub implementation for MVP — real Jsoup scraper is Phase 2)
- [x] `[MVP]` Implement `SubstitutionValidator` — validates AI output against temperature/method allowlist before returning to client
- [x] `[MVP]` Build hardcoded Baking Mode substitution database (fat, sugar, egg, flour equivalents)
- [x] `[MVP]` Implement `POST /api/v1/recipes/healthify` Baking Mode path — consult only hardcoded DB, never AI
- [x] Write Cucumber `.feature` files for all substitution business rules and safety constraints
- [ ] Implement Jsoup URL scraper behind `RecipeScraperPort` (Phase 2)
- [ ] Implement `POST /api/v1/recipes/scrape` endpoint (Phase 2)

---

## Frontend (React Native)

- [x] `[MVP]` Set up navigation structure (React Navigation — stack + tab navigators)
- [x] `[MVP]` Build recipe text entry screen (large text input, submit button)
- [x] `[MVP]` Build Healthify slider component (Light Tweaks → Ultra Lean, 5 intensity levels)
- [x] `[MVP]` Build substituted recipe display screen (original vs. substituted side-by-side or toggle)
- [x] `[MVP]` Build "Why" tooltip component (tappable chip on each substituted ingredient showing explanation)
- [x] `[MVP]` Build Baking Mode / Cooking Mode toggle (prominent, clear visual distinction)
- [x] `[MVP]` Build user authentication screens (register, login, logout)
- [x] `[MVP]` Build saved recipes screen (list view, tap to load)
- [x] `[MVP]` Wire all screens to Spring Boot API (Axios or Fetch, auth token handling)
- [ ] Build OCR camera scanner screen with editable confirmation step (Phase 2)
- [ ] Build URL input screen with scraping feedback (Phase 2)
- [ ] Build nutritional summary screen with export options (Phase 3)
- [ ] Build substitution feedback UI (accept/reject buttons feeding ML service) (Phase 3)

---

## AI Integration

- [x] `[MVP]` Write and version initial Cooking Mode prompt (save to `backend/src/main/resources/prompts/v1-cooking-mode.txt`)
- [x] `[MVP]` Implement `AISubstitutionPort` interface with OpenAI (or Gemini) adapter
- [x] `[MVP]` Map slider intensity levels to prompt parameters (e.g., Light Tweaks = conservative substitution constraints in prompt)
- [x] `[MVP]` Implement structured output parsing — AI response → typed `SubstitutedRecipe` model
- [x] `[MVP]` Implement `SubstitutionValidator` allowlist for temperatures and cooking methods
- [ ] Handle AI API rate limiting and timeout gracefully (fallback error message to user)
- [x] Build LLM safety trap suite — 20 trap recipes in `backend/src/test/resources/llm-safety/` (runs in CI via GitHub Actions)
- [x] Automated safety suite runner — `LlmSafetyTrapSuiteTest` runs all traps, skips without API key
- [ ] Expand safety trap suite to 100+ recipes (add more edge cases before public release)

---

## OCR & Camera

- [ ] Integrate Google ML Kit Vision API into React Native app (Phase 2)
- [ ] Build camera capture flow — take photo or pick from library (Phase 2)
- [ ] Build OCR result editing screen — display extracted text, allow user corrections before processing (Phase 2)
- [ ] Handle common OCR failure cases: bad lighting, cursive, grease stains (Phase 2)
- [ ] Appium test suite for full camera → OCR → edit → submit flow (Phase 2)

---

## URL Scraping

- [ ] Implement Jsoup-based scraper targeting Schema.org `Recipe` JSON-LD (Phase 2)
- [ ] Handle scraping failures gracefully — fall back to raw HTML extraction, then manual entry prompt (Phase 2)
- [ ] Build blocklist/rotation strategy for sites with anti-bot protections (Phase 2)
- [ ] Write integration tests for scraper against a set of pinned HTML snapshots (Phase 2)
- [ ] Implement `POST /api/v1/recipes/scrape` endpoint wired to Jsoup scraper (Phase 2)

---

## ML Personalization

- [ ] Design multi-armed bandit data model — arms = substitution options, reward = user accept/reject signal (Phase 3)
- [ ] Implement FastAPI endpoint: `POST /ml/v1/substitution-feedback` (record accept/reject) (Phase 3)
- [ ] Implement FastAPI endpoint: `GET /ml/v1/substitution-recommendations` (ranked substitution options for a user) (Phase 3)
- [ ] Implement cold-start fallback — default to global popularity rankings until 10+ user decisions recorded (Phase 3)
- [ ] Integrate Spring Boot backend with FastAPI ML service via internal HTTP (Phase 3)
- [ ] Write pytest tests for bandit algorithm logic (Phase 3)
- [ ] Build A/B test framework to evaluate bandit variants (Phase 3)

---

## Nutritional Export & Integrations

- [ ] Integrate nutritional database API (e.g., USDA FoodData Central or Edamam) for macro calculation (Phase 3)
- [ ] Implement macro calculation service — compute calories, protein, fat, carbs for substituted recipe (Phase 3)
- [ ] Build Apple Health export (HealthKit integration via React Native) (Phase 3)
- [ ] Build Google Fit export (Google Fit REST API) (Phase 3)
- [ ] Build MyFitnessPal export (MFP API or share-sheet workaround) (Phase 3)
- [ ] Build nutritional summary UI screen with before/after comparison (Phase 3)

---

## Testing & QA

- [x] `[MVP]` Write Cucumber scenarios for all Cooking Mode substitution rules
- [x] `[MVP]` Write Cucumber scenarios for all Baking Mode safety rules (no AI path, correct DB lookups)
- [x] `[MVP]` Write JUnit 5 unit tests for `SubstitutionService`, `BakingSubstitutionService`, `SubstitutionValidator`
- [x] `[MVP]` Write JUnit 5 unit tests for recipe parsing logic
- [ ] Set up Appium test project (Phase 2 — required before OCR/camera features ship)
- [ ] Write Appium tests for slider interaction and Baking Mode toggle (Phase 2)
- [ ] Write Appium tests for full OCR camera flow (Phase 2)
- [x] Build and run LLM safety trap suite (20 traps now, expand to 100+ before public release)
- [ ] Write pytest tests for FastAPI ML microservice (Phase 3)
- [ ] Performance test: simulate 100 concurrent `/healthify` requests, verify <2s p95 latency

---

## Deployment

- [ ] Containerize Spring Boot app with Docker
- [ ] Containerize FastAPI ML service with Docker
- [ ] Write `docker-compose.yml` for local full-stack development
- [ ] Set up cloud hosting for backend (e.g., AWS ECS, Railway, or Render)
- [ ] Set up managed PostgreSQL (e.g., AWS RDS or Supabase)
- [ ] Configure production environment variables and secrets
- [ ] Set up staging environment for pre-release testing
- [ ] Submit React Native app to Apple App Store (TestFlight first)
- [ ] Submit React Native app to Google Play Store (internal testing track first)
- [ ] Set up error monitoring (e.g., Sentry for both mobile and backend)
- [ ] Set up uptime monitoring for backend API
