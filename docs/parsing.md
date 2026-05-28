# Parsing

## Overview

The parsing layer is responsible for transforming raw file names into structured data that can be used by the rest of the system.

Input:

```id="a1"
"One.Piece.S20E10.mkv"
```

Output:

```id="a2"
{
  title: "One Piece",
  season: 20,
  episode: 10
}
```

---

## Goals

* Extract:

  * Show name
  * Episode number
  * Season number (optional)
* Support multiple naming conventions
* Be resilient to messy input

---

## Supported Patterns

### 1. Standard (SXXEXX)

```id="a3"
One.Piece.S20E10
```

Extracts:

* title → One Piece
* season → 20
* episode → 10

---

### 2. Absolute Episode

```id="a4"
One Piece 1074
```

Extracts:

* title → One Piece
* episode → 1074

---

### 3. Mixed / Loose Formats

```id="a5"
One_Piece-1075
OP 1076
One-Piece Episode 1077
```

Handled via normalization + flexible regex

---

## Parsing Strategy

### Step 1 — Normalize Input

* Replace separators:

  * `.` `_` `-` → space
* Remove file extensions
* Trim whitespace

---

### Step 2 — Pattern Matching

Apply regex patterns in priority order:

1. `SXXEXX`
2. Absolute episode
3. Fallback patterns

---

### Step 3 — Cleanup Title

* Remove extra tokens (episode, season, numbers)
* Normalize spacing
* Preserve readable format

---

## Edge Cases

### Abbreviations

```id="a6"
OP 1074
```

Problem:

* "OP" is ambiguous

Current behavior:

* Passed to API as-is

---

### Numbers in Title

```id="a7"
"86 Eighty Six 05"
```

Problem:

* Number may belong to title, not episode

---

### Missing Episode

```id="a8"
One Piece
```

Result:

* Partial parse (no episode)

---

## Design Decisions

* Prefer flexibility over strict validation
* Allow partial results
* Defer validation to API/matching layer

---

## Future Improvements

* Fuzzy title normalization
* Abbreviation expansion (OP → One Piece)
* Confidence scoring for parsed results
