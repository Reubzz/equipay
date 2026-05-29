# EquiPay Product Todo

## Product Rules
- Mobile users are the primary audience.
- Every screen must be designed mobile-first, then expanded for desktop.
- The split flow should feel fast, forgiving, and explainable.
- The app remains frontend-only for this phase, but the data model should be backend-ready.

## Priority 1: Mobile-First UI System

### User Story
As a mobile user, I want every screen to be easy to read and operate with one hand so I can split bills quickly without struggling on a small screen.

### Solution
Redesign the layout system so the mobile experience is the default design target. Use stacked cards, large touch targets, sticky primary actions, short sections, and compact step-by-step progress. Desktop should enhance the same flow, not define it.

### Implementation Steps
1. Redefine spacing, typography, and breakpoints starting at the smallest screen size.
2. Replace wide two-column layouts with stacked sections on mobile.
3. Make buttons, inputs, and selection chips large enough for thumb interaction.
4. Add sticky or always-visible next/back actions where needed.
5. Reduce visual noise by collapsing secondary details until they are needed.
6. Test every wizard step on common phone widths first, then adapt for desktop.

### Final Outcome
The app becomes comfortable to use on a phone first, with a cleaner and faster interaction model. This solves the biggest usage constraint because most users can complete the split without zooming, hunting for controls, or dealing with cramped desktop-first layouts.

## Priority 2: Quantity-Aware Bill Model

### User Story
As a user entering a restaurant bill, I want to represent repeated quantities and partial sharing without creating duplicate line items for every unit.

### Solution
Replace the current flat item structure with a quantity-aware model that can store one line item, its total quantity, and per-unit or per-subgroup assignment metadata.

### Implementation Steps
1. Redesign the item data shape to include quantity and structured split metadata.
2. Support one item with multiple unit allocations instead of forcing repeated manual entries.
3. Allow each unit or portion to have its own people assignment.
4. Update calculations so totals are derived from the structured breakdown.
5. Update the review screen so the source of every amount is visible.

### Final Outcome
Users no longer need to duplicate items just to split quantity-based purchases. This removes the core pain point of planning the bill twice and makes the app usable for real restaurant scenarios with variable item sharing.

## Priority 3: Fast Bill Entry and Import

### User Story
As a user with a long bill, I want a faster way to enter items so I do not have to type every line manually.

### Solution
Add bulk paste/import support first, then layer optional OCR or receipt parsing later. The goal is to shorten the manual entry path before adding more advanced automation.

### Implementation Steps
1. Add a paste-friendly input mode for bulk item entry.
2. Support quick multi-line import of item name, amount, and quantity data.
3. Add inline row editing so imported values can be corrected quickly.
4. Add file upload and OCR as a later enhancement, not the first dependency.
5. Keep manual entry available as a fallback for edge cases.

### Final Outcome
Users can get a long bill into the app much faster, with less typing and less planning. This solves the “painfully long manual entry” problem and makes the app viable for real restaurant bills instead of only small, simple ones.

## Priority 4: Duplicate Person Validation

### User Story
As a user adding participants, I want the app to prevent duplicate names so I do not accidentally create two entries for the same person.

### Solution
Add uniqueness checks and normalized validation for people names and optional emails. Prevent duplicate entries before they are stored in state.

### Implementation Steps
1. Normalize names before comparison by trimming and standardizing case.
2. Check new people against existing people and the payer identity.
3. Show a clear validation message when a duplicate is detected.
4. Disable the add action until the entry is valid.
5. Ensure deletes and edits update the validation state correctly.

### Final Outcome
Participant lists stay clean and trustworthy. This solves the duplicated-person problem and prevents split confusion later in the flow when assigning items or calculating balances.

## Priority 5: Better Item Split Workspace

### User Story
As a user assigning many items to many people, I want the split screen to be faster to navigate and easier to compare multiple entries.

### Solution
Redesign the item split UI into a denser, mobile-friendly workspace with clearer navigation, better selection feedback, and faster movement between items.

### Implementation Steps
1. Replace the current single selected-item panel with a more scannable layout.
2. Add better item grouping and visual separation for repeated units.
3. Make selected states more obvious with strong contrast and touch-friendly chips.
4. Add navigation helpers for moving to the next item without losing context.
5. Keep the screen usable on a phone by avoiding wide side-by-side layout traps.

### Final Outcome
The assignment stage becomes less tedious and less error-prone. This solves the pain of clicking through many entries and makes large bills manageable on mobile.

## Priority 6: Explainable Review and Detail View

### User Story
As a user reviewing the split, I want to see exactly how each item contributes to each person’s total so I can trust the result before sharing it.

### Solution
Turn the Review and Confirm screen into an explainable summary with an expandable table-like breakdown. The “View” action should open a detailed grid that maps items, shares, and totals.

### Implementation Steps
1. Replace the placeholder View button with an actual breakdown interaction.
2. Show an item-by-item table of assignments and contribution amounts.
3. Display person totals alongside the logic used to compute them.
4. Separate payer settlement from participant obligation views.
5. Keep the detail view readable on mobile by using collapsible rows or an expandable drawer.

### Final Outcome
Users can verify the split before finishing it, which increases trust and reduces disputes. This directly solves the request for an Excel-like view of how the bill was divided.

## Priority 7: Correct Settlement Math

### User Story
As a user settling up the bill, I want the app to show what each person owes or receives so the final numbers are correct and easy to understand.

### Solution
Extract calculation logic into pure helpers and model the payer/participant settlement explicitly. The review should show a balance view, not just totals mixed with charges.

### Implementation Steps
1. Move calculation logic out of the context into standalone utility functions.
2. Define clear settlement outputs for payer, participants, and total bill balance.
3. Cover proportional and equal tax/tip logic with test scenarios.
4. Make the review screen consume those settlement results directly.
5. Validate that payer settlement and participant shares always add up cleanly.

### Final Outcome
The numbers become trustworthy and explainable. This solves the core risk of the app showing confusing or inverted totals and ensures the final review aligns with actual settlement behavior.

## Priority 8: Draft Persistence and Recovery

### User Story
As a user working through a split, I want my progress to survive refreshes or accidental exits so I do not lose my work.

### Solution
Persist the split draft locally and restore it on load. Use local storage or a similar browser-side store until a backend exists.

### Implementation Steps
1. Save form state after each meaningful edit.
2. Restore draft data when the split flow opens.
3. Add a clear reset action for starting over.
4. Keep local persistence in sync with step changes and validation changes.
5. Remove full-page reload behavior as the reset mechanism.

### Final Outcome
Users can safely pause and resume a split without losing time or data. This solves the “start over from scratch” frustration and makes the app feel more reliable.

## Priority 9: In-App Reset and Completion Flow

### User Story
As a user who finishes a split, I want to restart the process cleanly without reloading the page.

### Solution
Replace the reload-based completion behavior with an in-app reset and clear success state. Add proper loading and success feedback for any save/share action.

### Implementation Steps
1. Reset the wizard state from the app instead of reloading the browser.
2. Separate “new split” from “save/share” actions.
3. Add loading and error feedback for any future persistence action.
4. Clear or preserve draft state intentionally based on the user action.
5. Keep the completion screen focused on the next step the user should take.

### Final Outcome
The app ends the flow gracefully and predictably. This solves the jarring hard reload behavior and makes the completion screen feel like part of the product, not a placeholder.

## Priority 10: Navigation and Product Cleanup

### User Story
As a user exploring the app, I want the navigation to reflect real features so I do not hit dead ends or unfinished routes.

### Solution
Remove or hide unfinished links, tighten the home page messaging around faster bill splitting, and align navigation with the actual product state.

### Implementation Steps
1. Remove dead links or replace them with working destinations.
2. Reword the home page to emphasize speed, mobile use, and smart bill handling.
3. Keep call-to-action paths short and obvious.
4. Avoid exposing features that are not implemented yet.
5. Make the landing page feel like the start of the flow, not a separate marketing site.

### Final Outcome
Users encounter fewer false promises and smoother navigation. This improves trust and reduces confusion when moving from the homepage into the split workflow.

## Priority Order Summary
1. Mobile-First UI System
2. Quantity-Aware Bill Model
3. Fast Bill Entry and Import
4. Duplicate Person Validation
5. Better Item Split Workspace
6. Explainable Review and Detail View
7. Correct Settlement Math
8. Draft Persistence and Recovery
9. In-App Reset and Completion Flow
10. Navigation and Product Cleanup

## Execution Notes
- Build the data model and calculation engine before polishing the review UI.
- Treat mobile-first as a hard product rule, not a styling tweak.
- Solve bulk entry before OCR so the app gets faster immediately.
- Keep every screen usable with thumbs, short scrolls, and small displays first.
- Use the review screen as the trust checkpoint before any sharing or completion action.