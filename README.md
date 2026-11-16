# MojiText

MojiText is a lightweight, anonymous emoji chat app built with plain HTML, CSS, and JavaScript. It lets users post emoji-only messages in a shared live feed, where each message disappears after 30 seconds.

The project is designed as a simple frontend experience with Firebase Realtime Database support for live updates and shared conversations.

## Features

- Anonymous chat experience
- Emoji-only message posting
- Live message updates with Firebase Realtime Database
- Messages disappear automatically after 30 seconds
- Landing page and informational pages for About, Privacy, Contact, and Terms
- Mobile-friendly responsive layout

## Project structure

- `index.html` – main chat interface
- `landing.html` – landing page / entry screen
- `main.js` – chat logic, posting flow, and message lifecycle
- `FireBase.js` – Firebase initialization and database access
- `style.css` – application styling
- `about.html`, `contact.html`, `privacy.html`, `terms.html` – supporting pages
- `database.rules.json` – Firebase Realtime Database security rules
- `firebase.json` – Firebase Hosting and emulator configuration
- `Images/` – project logo and assets

## Tech stack

- HTML5
- CSS3
- JavaScript (ES modules)
- Firebase Realtime Database
- Firebase Hosting

## Local development

1. Install the Firebase CLI if needed:

   ```bash
   npm install -g firebase-tools
   ```

2. From the project root, start the local Firebase emulators:

   ```bash
   firebase emulators:start
   ```

3. Open the app in your browser:

   - Hosting: `http://localhost:5000`
   - Firebase Emulator UI: `http://localhost:4000`

## Firebase setup

The app currently includes a Firebase configuration in `FireBase.js` for a demo/test project. For a production or personal deployment, update the config object with your own Firebase project settings.

The database rules in `database.rules.json` allow public read/write access for the message feed, and enforce emoji-style content validation.

## Deployment

To deploy the app to Firebase Hosting:

```bash
firebase deploy
```

## Notes

- This app is intentionally minimal and does not include authentication.
- Messages are ephemeral by design to keep the chat lightweight and social.
- The app uses `localStorage` to assign a client-side user ID so a user can be distinguished from other chat participants without sign-in.

## License

This project does not currently include a license file. If you plan to publish or share it publicly, add an appropriate license before distribution.
