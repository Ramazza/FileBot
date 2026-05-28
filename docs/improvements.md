# Improvements

## Overview

This document outlines potential improvements to increase accuracy, performance, and usability.

---

## Matching Improvements

### Fuzzy Search

* Handle typos
* Better title matching

Example:

```id="d1"
"One Peice" → "One Piece"
```

---

### Abbreviation Support

Map:

```id="d2"
OP → One Piece
AOT → Attack on Titan
```

---

### Confidence Scoring

* Show how reliable a match is
* Allow user confirmation

---

## API Improvements

### Caching

* Store API responses
* Reduce repeated calls
* Improve performance

---

## Performance

### Batch Processing

* Process multiple files at once
* Parallel API calls

---

## UI Improvements

* Editable matches
* Highlight mismatches

---

## Testing Improvements

* Add unit tests
* Add integration tests
* Prevent regressions

---

## Feature Ideas

### Custom Naming Templates

```id="d3"
{show} - {season}x{episode} - {title}
```

---

### File System Integration

* Rename files directly
* Folder organization

---

