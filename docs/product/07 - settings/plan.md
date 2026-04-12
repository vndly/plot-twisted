# Plan - User Settings & Data Management

Implementation plan for user settings and import/export functionality.

## Phase 1: Infrastructure Layer (Data Portability)

- [x] **Step 1.1 (Test-First)**: Create `tests/infrastructure/storage.service.import-export.test.ts` to verify `exportData` and `importData` logic.
  - covering: FR-07-05-01, FR-07-06-01, FR-07-06-02, FR-07-06-03, FR-07-07-01, FR-07-07-02, FR-07-07-03
- [x] **Step 1.2**: Update `src/domain/settings.schema.ts` to include `ExportDataSchema` and `ImportValidationRules`.
  - [ ] Add Zod `transform` logic for version-to-version schema migrations.
  - covering: FR-07-07-02
- [x] **Step 1.3**: Implement `exportData()` and `importData(data: unknown, strategy: 'merge' | 'overwrite')` in `src/infrastructure/storage.service.ts`.
  - [ ] Ensure `overwrite` strategy automatically triggers a "Safety Export" download before applying destructive changes.
  - [ ] **Sanitization**: Implement sanitization logic (NFR-07-02) for imported data to prevent XSS.
  - covering: FR-07-05-01, FR-07-06-01, FR-07-06-02, FR-07-07b-01, NFR-07-04

## Phase 2: Application Layer (Business Logic)

- [x] **Step 2.1 (Test-First)**: Create `tests/application/use-settings.test.ts` for new settings methods.
  - covering: FR-07-01-01, FR-07-08-01, FR-07-02-01, FR-07-03-01, FR-07-04-01
- [x] **Step 2.2**: Update `src/application/use-settings.ts` to expose `exportLibrary`, `importLibrary`, and reactive state for `layoutMode`, `region`, and `homeSection`.
  - [ ] Implement `watchEffect` for language and region changes to propagate re-fetch signals to other composables (e.g., `useBrowse`, `useCalendar`).
  - covering: FR-07-01, FR-07-02, FR-07-03, FR-07-04, FR-07-08

## Phase 3: Presentation Layer (UI/UX)

- [x] **Step 3.1**: Create settings components in `src/presentation/components/settings/`.
  - [x] `ThemeToggle.vue`: Props: `modelValue: 'light' | 'dark'`. Emits: `update:modelValue`.
  - [x] `LayoutModeToggle.vue`: Props: `modelValue: 'grid' | 'list'`. Emits: `update:modelValue`.
  - [x] `LanguageSelect.vue`: Props: `modelValue: string`, `options: string[]`. Emits: `update:modelValue`.
  - [x] `RegionSelect.vue`: Props: `modelValue: string`, `options: Region[]`. Emits: `update:modelValue`.
  - [x] `HomeSectionSelect.vue`: Props: `modelValue: string`, `options: string[]`. Emits: `update:modelValue`.
  - covering: FR-07-01, FR-07-02, FR-07-03, FR-07-04, FR-07-08
- [x] **Step 3.2**: Update `src/presentation/views/settings-screen.vue` (following `-screen.vue` naming convention) to compose these components into sections.
  - [x] Add `ImportButton` and `ExportButton` with secondary confirmation dialogs for "Overwrite".
  - covering: FR-07-05, FR-07-06, NFR-07-03, NFR-07-04
- [x] **Step 3.3**: Update `src/presentation/i18n/locales/` with new keys for all settings labels and tooltips.
  - covering: FR-07-02

## Verification Phase

- [x] **Build Check**: `npm run build` to ensure no type errors in new components.
- [x] **Automated Tests**: `npm run test` (must pass all infrastructure and application tests).
  - covering: FR-07-01-01, FR-07-08-01, FR-07-02-01, FR-07-05-01, FR-07-06-01, FR-07-06-02, FR-07-06-03, FR-07-07-01, FR-07-07-02, FR-07-07-03, FR-07-07b-01
- [x] **Visual Verification**:
  - [x] Toggle theme and verify instant CSS variable updates (< 100ms).
  - [x] Change language and verify UI translates and active view metadata re-fetches.
  - [x] Change region and verify Release Calendar displays regional premieres (e.g., "Premiere: [Date] (France)").
- [x] **Data Integrity**:
  - [x] Perform "Export", modify local data, then "Import (Merge)" and verify union of results.
  - [x] Perform "Import (Overwrite)", verify "Safety Export" download triggers, and verify old data is replaced.
  - [x] Verify secondary confirmation dialog appears and correctly handles "Cancel" action.

## Rollback Plan

- **Code**: Revert to the previous git commit.
- **Data Safety**: Before any "Overwrite" import, the application triggers a "Safety Export" download. If the user regrets the decision, they can re-import this file using the "Overwrite" strategy to restore their previous state.
