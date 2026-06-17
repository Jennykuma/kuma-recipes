# Domain Context

Vocabulary for the Kuma Recipes domain. Use these terms consistently in architecture reviews, ADRs, and design discussions.

---

## Core concepts

### Recipe
A user's saved recipe. Has a title, ingredient list, step list, optional notes, rating, yield, source URL, and cover photo. Scoped to a single authenticated user. The central entity — all other domain concepts attach to a Recipe.

### Tag
A user-defined label attached to one or more Recipes. Identified by a slug (normalized, unique per user). Used for filtering and organisation.

### Share Link
A token-based public URL that exposes a Recipe to unauthenticated viewers. Multiple Share Links can exist per Recipe; a link can be revoked without deleting the Recipe. Lookup is token-only — no user auth required.

---

## Lab (R&D Lab)

The Lab is the experimental workspace attached to a Recipe. Users iterate on a Recipe by creating Variants, logging Attempts, and leaving Pins.

### Variant
An experimental version of a Recipe. Carries its own ingredient list, step list, optional tag, optional delta (summary of what changed), and a rating. One Variant per Recipe can be marked as **Best**. Variants are ordered explicitly. The ingredients and steps fields are `VariantItem[]` — each item has `text` and `status` (`"original" | "tweaked" | "new"`).

### Attempt
A logged cooking session. Tied to a Recipe and optionally to a specific Variant. Records a date, a list of changes made, an optional note, and an optional rating.

### Pin
A sticky-note annotation. Attached to a Recipe (and optionally anchored to a specific ingredient or step via `attachType` / `attachMatch`). Has display properties: color, rotation. Displayed in the Lab's Pinned Recipe Pane.

### VariantItem
The unit inside a Variant's ingredient or step list. Fields: `text` (the content) and `status` (`"original"` | `"tweaked"` | `"new"`). Drives the visual chip rendering in the Pinned Recipe Pane.

---

## Import

### Parse Request
A request to extract a structured Recipe from raw text or a URL. Auto-detected: if the input looks like a URL it is fetched and parsed; otherwise treated as raw text. Returns a partial Recipe shape for the user to review before saving.

---

## Relationships

```
User
└── Recipe (many)
    ├── Tag (many-to-many, scoped to User)
    ├── Share Link (many)
    └── Lab
        ├── Variant (many, ordered)
        │   └── Attempt (many, optional link)
        ├── Attempt (many — also accessible without a Variant)
        └── Pin (many)
```

---

## What this file is for

Architecture reviews and grilling sessions use this vocabulary. When a new concept is named during a review, add it here. The goal is one name per thing — drift in naming (e.g. "version" vs "variant", "note" vs "pin") is a signal that a seam may be unclear.
