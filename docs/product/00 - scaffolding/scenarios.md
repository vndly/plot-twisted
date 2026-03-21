# Verification Scenarios: Project Scaffolding

### Requirement: Dev server

The dev server SHALL start and render the app shell.

#### Scenario: App loads in development

GIVEN all dependencies are installed
WHEN I run `npm run dev`
THEN Vite starts a local dev server
AND the browser shows a blank dark screen with background color `#0f1923`

#### Scenario: Hot module replacement works

GIVEN the dev server is running
WHEN I edit `src/App.vue` and save
THEN the browser reflects the change without a full page reload

---

### Requirement: Production build

The project SHALL produce a valid production build.

#### Scenario: Build completes successfully

GIVEN all dependencies are installed
WHEN I run `npm run build`
THEN the build completes with zero errors and zero warnings
AND the output is written to the `dist/` directory

---

### Requirement: Code quality tooling

Linting and formatting SHALL pass on all scaffolded files.

#### Scenario: Linting passes

GIVEN the project is scaffolded
WHEN I run `npm run lint`
THEN ESLint reports zero errors

#### Scenario: Formatting passes

GIVEN the project is scaffolded
WHEN I run `npm run format:check`
THEN Prettier reports zero formatting issues

---

### Requirement: Type safety

TypeScript SHALL compile with zero errors under strict mode.

#### Scenario: Type-check passes

GIVEN the project is scaffolded
WHEN I run `npm run type-check`
THEN `vue-tsc` reports zero TypeScript errors

#### Scenario: Implicit any is rejected

GIVEN a file contains an untyped variable (implicit `any`)
WHEN I run `npm run type-check`
THEN TypeScript reports an error for that variable

---

### Requirement: Path alias

The `@/` alias SHALL resolve to `src/`.

#### Scenario: Import using path alias

GIVEN a file imports from `@/domain/constants`
WHEN I run `npm run build`
THEN the import resolves to `src/domain/constants` and the build succeeds

---

### Requirement: Tailwind CSS theme

Custom theme variables SHALL render correct colors.

#### Scenario: Theme colors are applied

GIVEN `src/assets/main.css` defines `--color-bg-primary: #0f1923`
WHEN a component uses the class `bg-bg-primary`
THEN the element renders with background color `#0f1923`

---

### Requirement: Firebase hosting

The hosting configuration SHALL support SPA routing.

#### Scenario: SPA rewrite is configured

GIVEN `firebase.json` exists with a rewrite rule
WHEN a user navigates directly to `/library` on the deployed app
THEN Firebase serves `index.html` instead of returning a 404
