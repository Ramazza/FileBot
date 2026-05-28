## Architecture

The application is built using Electron and follows a two-process architecture:

### Main Process

The main process is responsible for:
- File system operations (reading and renaming files)
- Handling OS-level interactions
- Managing IPC communication

### Renderer Process

The renderer is a React application responsible for:
- User interface
- Displaying files and matches
- Handling user interactions

### Communication (IPC)

The renderer and main process communicate using IPC.

Example:
- Renderer requests folder contents
- Main process reads files and returns results

---

## Data Flow

1. User selects a folder
2. Renderer sends request to main process via IPC
3. Main process reads files and returns file list
4. Renderer parses filenames
5. App fetches metadata from external APIs
6. New filenames are generated
7. User previews changes
8. Renderer sends rename request via IPC
9. Main process renames files

---

## Frontend Structure

The React app is organized into:

- Components: UI elements (file list, modals, matches)
- Context: global state management
- Services: API calls and matching logic
- Utils: filename parsing helpers