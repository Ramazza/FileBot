# Decisions

## Why TMDB and TVDB?

* Free
* Simple API
* Good coverage

---

## Why Convert to SXXEXX?

Chosen standard:

```
Show - SXXEXX
```

Reasons:

* Plex compatibility
* Industry standard
* Predictable

---

## Why Not Trust File Names?

File names are unreliable:

* Missing season
* Wrong numbering
* Different formats

Solution:
→ Always validate using API

---

## Absolute Episode Handling

Decision:

* Support absolute numbers (e.g., 1074)

Implementation:

* Flatten episode list
* Map index → season/episode

---

## Logging Strategy

Controlled via:

```
VITE_DEBUG=true
```

Types:

* Parser logs
* API logs
* Matching logs

---

## Trade-offs

### Accuracy vs Simplicity

* Current approach favors simplicity
* Some edge cases may fail

---

## Known Weak Points

* Anime season inconsistencies
* Abbreviated show names
* Multiple shows with similar names
