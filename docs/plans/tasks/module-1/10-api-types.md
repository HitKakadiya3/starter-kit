# Task 10 — Question & submit API types `src/lib/apiTypes.ts`

**Phase:** 3 · Quiz funnel rewrites
**Work plan task id:** 3.1
**Size:** Small (1 file)
**Dependencies:** none

## Purpose / why this task exists

Two later tasks (`12-usequiz-rewrite.md` and `15-email-capture-real-submit.md`) consume shapes from the backend. Defining them once, narrowly, prevents each page from inventing its own types and diverging.

## PRD anchor

- `docs/prd/module-1-load-questions.md` §6.3 QuizPage (question shape), §6.5 EmailCapturePage (submit request + response).
- Backend contract: `docs/Frontend API List.postman_collection.json` — `GET /questions`, `POST /questions/submit`.

## AC coverage

Foundation only. These types are consumed by tasks closing AC 1, 6, 7, 8, 10, 13.

## Scope

**Add:**
- `d:/Projects/TestIQ/typestest/src/lib/apiTypes.ts`

**Do NOT add** a test file — this task is type declarations only; verification is by `tsc`.

## Step-by-step implementation

1. Inspect the Postman collection at `docs/Frontend API List.postman_collection.json` for the actual `GET /questions` and `POST /questions/submit` response shapes. Note any optional fields.
2. Create `typestest/src/lib/apiTypes.ts`:

   ```ts
   /**
    * Narrow shapes for Module 1. Other modules may extend.
    */

   export interface ApiQuestionOption {
     id: string;
     text: string;
     weight: number;
     // Keep open — backend may send more fields we don't care about.
     [k: string]: unknown;
   }

   export interface ApiQuestion {
     id: string;
     question_type_id: number;
     text: string;
     options: ApiQuestionOption[];
     [k: string]: unknown;
   }

   export interface QuizAnswer {
     id: string;       // question id
     answer: string;   // option id (PRD Assumption A1)
   }

   export interface PricingInfo {
     // Shape not fully known in Module 1. Keep loose; Module 2 tightens.
     [k: string]: unknown;
   }

   export interface QuizSubmitRequestBody {
     email: string;
     variant_type: '';
     quiz_data: QuizAnswer[];
     start_time: number;
     end_time: number;
     prc_id: string;
     pricing_discount: { mdid: string };
     user_device_info: {
       user_device: string;
       user_os: string;
       user_browser: string;
     };
     landing_url_detail: {
       landing_url: string;
       landing_time: number | null;
     };
     geo_data: { city: string; region: string };
   }

   export interface QuizSubmitResponse {
     quiz_result_id: number;
     encrypted_quiz_result_id: string;
     email?: string;
     pricing_info?: PricingInfo;
     redirect_page?: string;
     [k: string]: unknown;
   }
   ```

3. Do NOT export anything else. No runtime code in this file.

## Verification commands

Run from `d:/Projects/TestIQ/typestest/`:

- `npx tsc --noEmit` — passes.
- `npm run lint` — clean.
- `npm run build` — succeeds.

## Done-when

- `apiTypes.ts` exists and exports `ApiQuestion`, `ApiQuestionOption`, `QuizAnswer`, `PricingInfo`, `QuizSubmitRequestBody`, `QuizSubmitResponse`.
- No `any` in the file.
- `npx tsc --noEmit` clean.

## Notes / ambiguities

- `[k: string]: unknown` index signatures are intentional — the backend returns many more fields (timestamps, flags, etc.) that Module 1 does not need to model. Keeping types narrow-but-open avoids over-constraining.
- `PricingInfo` is a placeholder for Module 2 to tighten. Do not widen or narrow it here.
- `QuizAnswer.answer: string` is the **option id**, per PRD §9 Assumption A1. If Module 1 smoke testing proves the backend wants a numeric position instead, that's a one-line change in `useQuiz` (Task 12), not a type change here.
