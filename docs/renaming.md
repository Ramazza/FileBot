# Renaming

## Overview

The renaming layer is responsible for generating a clean, consistent output filename based on matched episode data.

---

## Goal

Convert:

```id="b1"
One Piece 1074
```

Into:

```id="b2"
One Piece - S21E01
```

---

## Format

Standard format:

```id="b3"
{Show Name} - S{Season}E{Episode} - {Episode Name}
```

---

## Number Formatting

* Season → always 2 digits
* Episode → always 2 digits

Examples:

```id="b4"
S1E5   → S01E05
S10E3  → S10E03
```

---

## Data Source

Renaming uses **matched API data**, not parsed input.

This ensures:

* Correct season mapping
* Correct episode ordering

---

## Process

1. Receive matched episode:

```id="b5"
{
  show: "One Piece",
  season: 21,
  episode: 1
}
```

2. Format numbers

3. Build string

4. Return final name

---

## Decisions

### Always Standardize

Even if input already has format:

```id="b6"
One.Piece.S20E10
```

It will still be normalized to:

```id="b7"
One Piece - S20E10
```

---

### Ignore Original Formatting

Reason:

* Original names are inconsistent
* Consistency > preservation

---

## Limitations

* Does not include:

  * episode title
  * resolution
  * codec

Example not supported:

```id="b8"
One Piece - S21E01 - 1080p
```

---

