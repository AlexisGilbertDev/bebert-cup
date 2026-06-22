# CLAUDE.md — Football Challenge App

## Project overview

A multiplayer football challenge PWA. Players identify themselves with a pseudo (no authentication). Challenges are pre-filled (skill-based or match-based). A player submits a result manually (numeric score or success/failure depending on the challenge type). A global leaderboard ranks players.

**Stack:** React + TypeScript (client) · Express + TypeScript (server) · Vitest · No database (in-memory)

---

## Monorepo structure

```
/
├── client/       # React PWA (TypeScript, Vite)
├── server/       # Express API (TypeScript, Clean Architecture)
├── CLAUDE.md
└── package.json  # root scripts only
```

---

## Domain language (Ubiquitous Language)

| Term | Definition |
|---|---|
| `Player` | A person identified by a unique pseudo. No account, no auth. |
| `Challenge` | A pre-filled football challenge (skill or match type). |
| `ChallengeType` | `skill` — individual technique (e.g. keep-ups) · `match` — confrontation result |
| `Result` | A player's submission for a challenge. Score (numeric) for skill challenges, outcome (success/failure) for match challenges. |
| `Leaderboard` | Global ranking of players based on their results. |
| `Score` | A numeric value submitted for a skill challenge. |
| `Outcome` | `success` or `failure`, submitted for a match challenge. |

---

## Naming conventions

- **Files:** `kebab-case` — `challenge-repository.port.ts`, `submit-result.use-case.ts`
- **Classes:** `PascalCase` — `SubmitResultUseCase`, `InMemoryChallengeRepository`
- **All names in English** — classes, methods, variables, test descriptions (`it`, `describe`)
- **No abbreviations in parameters:** `container` not `c`, `error` not `e`, `request` not `req`, `response` not `res`
- **No `any`** — enforced via `tsconfig` (`"strict": true`, `"noImplicitAny": true`)

---

## Clean Architecture — Server

```
server/src/
├── config/
│   └── env.ts                        # Only file allowed to read process.env
├── domain/                           # No dependencies — pure business logic
│   ├── entities/
│   │   ├── player.entity.ts
│   │   ├── challenge.entity.ts
│   │   └── result.entity.ts
│   ├── value-objects/
│   │   ├── challenge-type.value-object.ts   # 'skill' | 'match'
│   │   ├── score.value-object.ts
│   │   └── outcome.value-object.ts          # 'success' | 'failure'
│   └── ports/                        # Interfaces implemented in infrastructure
│       ├── challenge-repository.port.ts
│       ├── result-repository.port.ts
│       └── player-repository.port.ts
├── application/                      # Orchestrates domain — no infra imports
│   └── use-cases/
│       ├── get-challenges.use-case.ts
│       ├── submit-result.use-case.ts
│       └── get-leaderboard.use-case.ts
├── infrastructure/
│   ├── http/
│   │   ├── server.ts                 # buildApp(deps) — Express factory, no listen()
│   │   ├── router.ts                 # Mounts all routers
│   │   ├── challenge.router.ts
│   │   ├── result.router.ts
│   │   └── leaderboard.router.ts
│   └── repositories/
│       ├── in-memory-challenge.repository.ts
│       ├── in-memory-result.repository.ts
│       └── in-memory-player.repository.ts
└── main.ts                           # Wires deps, calls buildApp(), calls listen()
```

### Dependency rule
```
domain ← application ← infrastructure
```
- `domain/` imports nothing from the project.
- `application/` imports only from `domain/`.
- `infrastructure/` imports from `application/` and `domain/`.
- `main.ts` is the only place that wires everything together.
- `application/` never imports from `infrastructure/`.

---

## Client structure

```
client/src/
├── pages/          # One file per route
├── components/     # Reusable UI components
├── hooks/          # use-api.ts and feature hooks
└── index.css
```

No clean architecture on the client — keep it simple. Business logic stays in the server.

---

## Testing

**Framework:** Vitest + supertest

| Type | File pattern | Command | What is tested |
|---|---|---|---|
| Unit | `*.test.ts` | `npm run test:unit` | Use case in isolation, in-memory fakes |
| Integration | `*.integration.test.ts` | `npm run test:integration` | HTTP routes via supertest, in-memory fakes |

### Rules
- **No `jest.mock()`** — instantiate in-memory fakes that implement the ports.
- **Unit tests:** use case called directly, no Express involved.
- **Integration tests:** `supertest(buildApp(fakeDeps))` — tests routes, parsing, middlewares, HTTP status codes.
- Every use case has at least one unit test.
- Every router has at least one integration test.

### In-memory fake pattern
```ts
// infrastructure/repositories/in-memory-challenge.repository.ts
export class InMemoryChallengeRepository implements ChallengeRepositoryPort {
  private challenges: Challenge[] = [];
  // ...
}
```

---

## Configuration

- `process.env` is read **only** in `server/src/config/env.ts`.
- Every other file imports from `env.ts`:
```ts
import { env } from '../../config/env';
```

---

## Express factory pattern

`buildApp()` accepts injected dependencies so tests can pass fakes:

```ts
// infrastructure/http/server.ts
export function buildApp(dependencies: AppDependencies): express.Application {
  const application = express();
  application.use(express.json());
  application.use('/api', buildRouter(dependencies));
  return application;
}
```

```ts
// main.ts
const dependencies = {
  challengeRepository: new InMemoryChallengeRepository(),
  resultRepository:    new InMemoryResultRepository(),
  playerRepository:    new InMemoryPlayerRepository(),
};
const application = buildApp(dependencies);
application.listen(env.PORT);
```

---

## Git conventions

### Commit prefixes

| Prefix | Usage |
|---|---|
| `feat: init <feature>` | First implementation of a feature (from scratch) |
| `feat: add <element>` | Adding an element to an existing feature |
| `fix: <description>` | Bug fix |
| `refactor: <description>` | Refactoring without behaviour change |
| `chore: <description>` | Technical task (deps, config, CI) |

### Branch naming

| Prefix | Usage |
|---|---|
| `feat/init-<kebab-name>` | First implementation of a feature |
| `feat/add-<kebab-name>` | Adding an element to an existing feature |
| `fix/<kebab-name>` | Bug fix |
| `refactor/<kebab-name>` | Refactoring without behaviour change |
| `chore/<kebab-name>` | Technical task (deps, config, CI) |

### Branch creation

```bash
git checkout master && git pull origin master && git checkout -b <prefix>/<name>
```

---

## Development workflow

1. **Need described** → `git pull master`, create branch immediately.
2. **Ambiguous need** → ask all necessary questions before planning.
3. **Plan** → present a structured plan (files by layer, tests to write, impacts); wait for user validation.
4. **Implementation** → follow the plan autonomously.
5. **Review** → run 2 parallel review agents via `/code-review`.
6. **PR** → create PR from branch → master; user validates and merges.

### Plan template

```
## Plan — `<branch-name>`

### Files to create / modify
#### domain/
#### application/
#### infrastructure/

### Tests to write
| Type | File | What is tested |
|---|---|---|

### Impacts on other features
```

---

## API routes (target)

| Method | Route | Use case | Description |
|---|---|---|---|
| `GET` | `/api/challenges` | `GetChallengesUseCase` | List all challenges |
| `POST` | `/api/results` | `SubmitResultUseCase` | Submit a result for a challenge |
| `GET` | `/api/leaderboard` | `GetLeaderboardUseCase` | Get global leaderboard |
| `GET` | `/api/health` | — | Health check |

---

## TypeScript config (key flags)

```json
{
  "strict": true,
  "noImplicitAny": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true
}
```
