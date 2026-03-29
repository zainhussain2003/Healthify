# Healthify — Architecture & Session Rules

## 1. Project Vision

Healthify is a mobile application that performs 1-to-1 micro-substitutions on recipe ingredients and intelligently rewrites the cooking instructions to accommodate the chemical and thermal changes of those new ingredients. The moat is frictionless, single-purpose focus: it eliminates the complex prompting required by AI chatbots and the tedious manual entry of macro trackers by adapting the user's existing beloved recipes rather than forcing them to adopt entirely new meals.

---

## 2. Tech Stack

| Layer | Technology | Role |
|---|---|---|
| Mobile | React Native (TypeScript) | iOS + Android UI |
| State | Redux or React Context API | Session, recipe state, ML preference weights |
| Backend | Java 21 + Spring Boot 3 | API routing, data parsing, business logic, security |
| Database | PostgreSQL | User profiles, saved recipes, baking equivalence tables |
| Web Scraping | Jsoup (integrated into Java backend) | Schema.org JSON-LD extraction from food blogs |
| AI Engine | OpenAI API or Gemini API | Dynamic instruction rewriting (Cooking Mode) |
| OCR | Google ML Kit Vision API | On-device image-to-text from cookbooks/recipe cards |
| ML Service | Python 3.11 + FastAPI | Multi-armed bandit personalization microservice |
| Testing | Cucumber + JUnit 5, Appium | BDD backend logic, mobile UI automation |

---

## 3. Architecture Overview

```
React Native App (iOS / Android)
        |
        | REST/JSON  (HTTPS)
        v
Spring Boot API Server  [com.healthify.*]
        |
        |-- PostgreSQL          (user profiles, saved recipes, baking DB)
        |-- Jsoup               (URL scraping — isolated behind RecipeScraperPort interface)
        |-- OpenAI / Gemini     (instruction rewriting for Cooking Mode)
        |-- FastAPI Microservice (ML personalization — called via internal HTTP)

Google ML Kit               (on-device OCR — no server roundtrip)
```

**Key principle:** The Spring Boot server is the single entry point for the mobile app. The FastAPI ML service is an internal implementation detail — the mobile app never calls it directly.

---

## 4. MVP Scope (Phase 1)

### In Scope
- Manual text entry of recipes (the only input method for MVP)
- Healthify slider UI (Light Tweaks → Ultra Lean substitution intensity)
- AI-powered ingredient substitution + cooking instruction rewriting
- "Why" tooltips on each substituted ingredient
- Baking Mode toggle (hardcoded, chemically vetted substitution database — no AI)
- Basic user accounts (register, login, save/load recipes)

### Out of Scope for MVP
- URL scraping (Phase 2)
- OCR camera scanner (Phase 2)
- ML personalization / multi-armed bandit (Phase 3)
- Nutritional export to Apple Health, Google Fit, MyFitnessPal (Phase 3)
- LLM safety trap suite — 100+ test recipes (required before first public release, not MVP)

---

## 5. Coding Conventions

**Java (Spring Boot)**
- Google Java Style Guide
- Package structure: `com.healthify.controller`, `com.healthify.service`, `com.healthify.repository`, `com.healthify.model`, `com.healthify.port` (interfaces for external dependencies)
- All external dependencies (AI API, scraper, ML service) must be behind a `Port` interface to allow easy swapping

**React Native**
- TypeScript required — no plain `.js` files
- Functional components only — no class components
- Component files: PascalCase (`HealthifySlider.tsx`)
- Hooks: camelCase prefixed with `use` (`useRecipeState.ts`)

**Python (FastAPI)**
- PEP 8 style
- Type hints required on all function signatures
- Pydantic models for all request/response schemas

**API Design**
- RESTful, versioned: `/api/v1/...`
- JSON request/response bodies
- HTTP status codes used semantically (200, 201, 400, 401, 404, 500)

**Git**
- Conventional commits: `feat:`, `fix:`, `chore:`, `test:`, `docs:`
- No dead code committed — remove unused imports and commented-out blocks before committing

---

## 6. AI Session Rules

These rules apply to every Claude Code session in this project:

1. **Read this file first** before writing any code or making architectural suggestions
2. **Do not add features** beyond what is explicitly requested in the session
3. **Do not refactor** surrounding code unless it directly blocks the task at hand
4. **Respect MVP scope** — do not implement out-of-scope features even when they seem like natural additions
5. **Baking Mode is safety-critical** — any change to baking substitution logic requires a corresponding Cucumber scenario
6. **LLM prompt changes** must be saved to `backend/src/main/resources/prompts/` with a version comment explaining what changed and why
7. **Never bypass the Port interfaces** — always add new AI/scraper/ML behavior through the defined interface, not directly in service classes
8. **Push to GitHub after every completed step** — after each task is done, commit the changes and push to `main` on `https://github.com/zainhussain2003/Healthify`

---

## 7. Testing Standards

**BDD — Cucumber + JUnit 5 (Java)**
- Every business logic rule must have a `.feature` file with at least one scenario
- Safety-critical rules are mandatory coverage (examples):
  - `Given a recipe uses low-fat dairy, When instructions are rewritten, Then a low-heat warning must be included`
  - `Given a recipe is in Baking Mode, When a fat substitution is made, Then only the hardcoded DB is consulted`
- Feature files live in `backend/src/test/resources/features/`

**Appium (Mobile UI)**
- Automate: camera flow, URL parser input, slider interaction, Baking Mode toggle
- Run full Appium suite before any release build

**LLM Safety Suite**
- 100+ "trap" recipes stored in `backend/src/test/resources/llm-safety/`
- All must pass before any deployment that modifies the AI prompt
- Trap recipes test for: hallucinated temperatures, dangerous method suggestions, structurally broken baking substitutions

**Unit Tests**
- JUnit 5 for all `service` layer Java classes — minimum 80% coverage
- pytest for the FastAPI microservice — all endpoints and bandit logic

---

## 8. Known Risks & Engineering Constraints

1. **Web scraping fragility** — Food blogs update DOM structures constantly and many use anti-bot protections. The Jsoup scraper is isolated behind `RecipeScraperPort` so it can be replaced without touching service logic. Treat it as maintenance-heavy.

2. **LLM hallucinations** — The AI must never suggest unsafe cooking temperatures or dangerous methods. All AI output must be validated against a temperature/method allowlist in `SubstitutionValidator` before being returned to the client. When in doubt, reject and fall back to a safe default.

3. **QA overhead** — Automated tests cannot taste food. Any new substitution category added to the system requires manual real-world testing before shipping. Document results in `docs/taste-test-log.md`.

4. **OCR accuracy** — Kitchen photos have terrible lighting, grease stains, and cursive. The app must force users through an editable confirmation screen after every OCR scan. Auto-processing unreviewed OCR output is prohibited.

5. **ML cold start** — The multi-armed bandit has no data on new users. Default to global popularity-ranked substitutions until a user has logged 10+ accepted/rejected substitution decisions.
