# 🖥️ Terminal Dev Forum

A sleek, developer-focused community forum inspired by vintage terminal interfaces. Built with **React** and **Firebase**, this application features real-time data synchronization, threaded discussions, and a unique dark-mode aesthetic.

---

## 🚀 Quick Access (Test Credentials)

To explore the platform immediately without creating a new account, use the following credentials:

- **Email:** `test@test.com`
- **Password:** `test123`

---

## ✨ Key Features

- **Cyberpunk UI:** High-contrast terminal aesthetic with modern glassmorphism elements.
- **Real-time Interaction:** Posts, likes, and comments update instantly across all clients via Firestore Snapshots.
- **Threaded Conversations:** Support for nested replies (sub-comments) to keep discussions organized.
- **Ownership Control:** Users can delete their own posts, comments, and individual replies.
- **Unique Likes:** Intelligent heart system that prevents spamming (one like per user per post).
- **Dynamic Search:** Real-time filtering by keyword and category (Games, Software, Hardware, Other).
- **Avatar Selector:** Custom profile picture selection during account registration.

---

## 🛠️ Technology Stack

- **Frontend:** React.js (Hooks, Functional Components)
- **Backend/Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Styling:** Pure CSS3 (Custom Variables & Grid Layout)

---

## 📦 Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone [your-repository-url]
    cd terminal-dev-forum
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Firebase:**
    Open `src/firebase.js` and replace the configuration with your own Firebase project credentials:

    ```javascript
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_PROJECT.firebaseapp.com",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_PROJECT.appspot.com",
      messagingSenderId: "...",
      appId: "...",
    };
    ```

4.  **Run the application:**
    ```bash
    npm start
    ```

---

## 🛡️ Required Firestore Security Rules

To ensure likes and deletions work correctly while maintaining security, apply these rules in your Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      // Allows likes and comment updates for any authenticated user
      allow update: if request.auth != null;
      // Restricts deletion strictly to the original author
      allow delete: if request.auth != null && request.auth.uid == resource.data.authorId;
    }
  }
}
```
