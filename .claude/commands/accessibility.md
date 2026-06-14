---
description: Help with accessibility work in the Kuma Recipes app. Use when auditing UI accessibility, implementing or reviewing frontend changes that affect ARIA usage, keyboard navigation, screen reader support, contrast, labels, semantic HTML, common WCAG issues, or other accessibility-related behavior in the frontend codebase.
---

Use this skill when working on frontend accessibility work in the `kuma-recipes` app, especially in `apps/web`.

## Focus areas

Prioritize:

- semantic HTML before ARIA
- accessible labels for form controls
- keyboard navigation and visible focus states
- screen reader clarity for names, roles, values, and state
- colour contrast and non-colour indicators for important information
- error messaging, validation, and status annoucements

## Repo context

Key frontend areas:

- `apps/web/src/App.tsx`
- `apps/web/src/pages/NewRecipe/NewRecipe.tsx`
- `apps/web/src/pages/RecipeDetails/RecipeDetails.tsx`

If a change affects shared UI patterns, inspect related reusable components in `apps/web/src`.

## Workflow

When using this skill:

1. Identify the user flow and affected UI surface
2. Check semantic structure first before adding ARIA
3. Verify every interactive element has an accessible name
4. Check keyboard access:
   - tab order
   - focus visibility
   - no keyboard traps
   - correct button/link behavior
5. Check forms:
   - labels
   - helper text
   - error text
   - required-state communication
6. Check dynamic UI changes for screen reader impact:
   - dialogs
   - toasts
   - inline validation
   - loading and success states
7. Review contrast and whether meaning depends only on color
8. Prefer simple native patterns over custom ARIA-heavy solutions

## Implementation guidance

Prefer:

- native `button`, `label`, `input`, `select`, `textarea`, `fieldset`, `legend`
- headings in a meaningful order
- `aria-*` only when native semantics are not enough
- explicit labels for recipe forms, tag inputs, and share flows

Avoid:

- clickable `div` or `span` elements when a `button` fits
- placeholder-only labeling
- adding ARIA that conflicts with native semantics
- suppressing focus outlines without a strong replacement

## Output expectations

When reviewing or making changes:

- explain the accessibility issue in practical terms
- describe who is affected if relevant
- make the smallest clear fix that matches existing patterns
- mention any remaining manual verification needs

## Verification

For accessibility-related frontend changes, consider:

- keyboard-only navigation
- screen reader naming and announcements
- basic contrast checks
- existing web tests if relevant

## Audit mode

When asked to audit frontend accessibility:

1. Inspect the affected pages and shared components.
2. Identify issues with semantics, labeling, keyboard navigation, focus visibility, screen reader support, and contrast.
3. Prioritize findings by user impact.
4. Prefer native HTML solutions before ARIA-based fixes.
5. Report concrete findings with file references and suggested remediations.
