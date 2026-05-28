# FileBot

FileBot is a desktop application built with Electron that automatically **parses, matches, and renames media files** (TV shows and movies) into a clean, consistent format using external metadata sources.

It is designed to solve one core problem: **messy, inconsistent file names that break media organization tools like Plex.**

---

## Purpose

Media files often come in unreliable formats such as:

```
One Piece 1074
OP_1075.mp4
One.Piece.S20E10.1080p
```

These formats:

* are inconsistent
* may lack season/episode data
* are not compatible with media servers

FileBot standardizes them into:

```
One Piece - S21E01 - Entering a New Chapter! Luffy and Sabo's Paths!
```

---

## Features

### Intelligent Parsing

* Extracts show name, season, and episode from messy filenames
* Supports multiple formats:

  * `SXXEXX` (standard)
  * Absolute episode numbers (e.g. anime)
  * Mixed separators (`.`, `_`, `-`)

---

### Smart Matching

* Uses external APIs (TMDB / TVDB) to identify the correct show
* Converts absolute episode numbers → season/episode format
* Handles inconsistent naming across sources

---

### Automatic Renaming

* Applies consistent naming format:

  ```
  Show Name - SXXEXX - Episode Name
  ```
* Ensures compatibility with tools like Plex

---

### Preview Before Apply

* Displays matched results before renaming
* Prevents incorrect file changes

---

### Desktop Application

* Built with Electron + React
* Simple and responsive UI

---

## How It Works

The application follows a pipeline:

```
File Name
   ↓
Parsing
   ↓
API Search (TMDB)
   ↓
Episode Matching
   ↓
Renaming
   ↓
Preview / Apply
```

### Step-by-step:

1. **Parse filename**

   * Extract title, episode, season (if available)

2. **Search show**

   * Query TMDB using parsed title

3. **Fetch metadata**

   * Get seasons and episodes

4. **Match episode**

   * Resolve correct season/episode

5. **Generate new name**

   * Format into standardized output

---

## Supported Naming Patterns

### Standard

```
One.Piece.S20E10
```

### Absolute Episode

```
One Piece 1074
```

### Loose Formats

```
One_Piece-1075
OP 1076
```

---

## Limitations

* Anime may have inconsistent season structures across APIs
* Abbreviated names (e.g. `OP`) may not always match correctly
* Some matches depend on API accuracy

---

## Debug Mode

Enable debug logs via environment variables:

```
VITE_DEBUG=true
DEBUG=true
```

This enables:

* Console
* Parsing logs
* API logs
* Matching logs

---

## Tech Stack

* **Electron** — Desktop application
* **React** — UI layer
* **TypeScript** — Type safety
* **Node.js** — Backend/runtime
* **TMDB API** — Metadata provider
* **TVDB API** — Metadata provider

---

## Documentation

Detailed documentation is available in the `/docs` folder:

* `api.md` — API integration and flow
* `architecture.md` — System design and data flow
* `decisions.md` — Technical decisions and trade-offs
* `parsing.md` — Filename parsing logic
* `renaming.md` — Output formatting rules
* `testing.md` — Testing strategy
* `improvements.md` — Future enhancements

---

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/filebot.git

# Enter the project folder
cd filebot

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build the app
npm run dist
```

---

## Future Plans

* Better matching heuristics (fuzzy search)
* Batch file processing
* Custom naming templates
* Automated tests
* User typed name

---

## Disclaimer

This tool performs **best-effort matching**.

Due to inconsistencies in:

* file naming
* API data
* episode structures

Manual verification is recommended before applying changes.

---
