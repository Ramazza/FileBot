# API

## Overview

The API layer is responsible for retrieving show and episode data from external services.

Currently supported:

* TMDB (The Movie Database)
* TVDB (The TV Database)

---

## Flow

### 1. Search Show

Input:

```
"One Piece"
```

Output:

* List of possible matches

Strategy:

* Pick best match (usually first result)

---

### 2. Fetch Show Details

Retrieve:

* Seasons
* Episode lists

---

### 3. Episode Resolution

Two scenarios:

#### A. Absolute Episode (e.g., 1074)

* Flatten all episodes across seasons
* Find index = episode number
* Map to:

  * season
  * episode

#### B. Season/Episode Provided

* Direct lookup

---

## Limitations

* TMDB season grouping is not always accurate
* Anime often differs from official numbering
* Some episodes may be missing or shifted

---

# Architecture

## Overview

The system is divided into independent layers:

---

## 1. Parser

Responsibility:

* Extract structured data from file names

Output:

```
{
  title: string
  episode?: number
  season?: number
}
```

---

## 2. API Layer

Responsibility:

* Fetch data from TMDB or TVDB

---

## 3. Matcher

Responsibility:

* Convert parsed data into real episode info

---

## 4. Renamer

Responsibility:

* Generate final file name

---

## 5. UI

Responsibility:

* Display results
* Allow user interaction

---

## Data Flow

```
File Name
   ↓
Parser
   ↓
API Search
   ↓
Matcher
   ↓
Renamer
   ↓
UI Output
```
