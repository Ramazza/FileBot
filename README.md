# FileBot

FileBot is a desktop application built with Electron that helps automatically organize and rename media files such as TV shows and movies using metadata from external sources.

---

## Features

- Automatically detects TV shows and episodes from filenames
- Matches episodes using external metadata APIs (e.g. TMDB / TVDB)
- Renames files into a consistent format (e.g. `Show Name - S01E01 - Episode Name`)
- Preview changes before applying
- Simple desktop UI built with Electron + React

---

## Tech Stack

- Electron (Desktop app)
- React (UI)
- TypeScript
- Node.js
- External metadata APIs (TMDB / TVDB or similar)

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