import React, { useState, useEffect } from "react";
import "./App.css";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import Auth from "./components/Auth";
import CreatePost from "./components/CreatePost";
import Home from "./components/Home";
import Seeder from "./components/Seeder";

const avatarOptions = Array.from(
  { length: 48 },
  (_, i) =>
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 888}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
);

function App() {
  const [user, setUser] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [stats, setStats] = useState({ posts: 0, users: 0 });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubPosts = onSnapshot(collection(db, "posts"), (snap) => {
      setStats((prev) => ({ ...prev, posts: snap.size }));
    });
    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
      setStats((prev) => ({ ...prev, users: snap.size }));
    });
    return () => {
      unsubPosts();
      unsubUsers();
    };
  }, []);

  const handleChangeAvatar = async (url) => {
    try {
      await updateProfile(auth.currentUser, { photoURL: url });
      setShowPicker(false);
      window.location.reload();
    } catch (err) {
      alert(err.message);
    }
  };

  if (!user) return <Auth />;

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2 style={{ color: "var(--accent-blue)", letterSpacing: "2px" }}>
          GLITCH & ERROR
        </h2>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <img
            src={user.photoURL}
            style={{ width: "80px", borderRadius: "12px" }}
            alt="p"
          />
          <h4 style={{ margin: "10px 0" }}>u/{user.displayName}</h4>
          <button
            onClick={() => setShowPicker(true)}
            className="btn-action"
            style={{ fontSize: "10px", padding: "8px" }}
          >
            CHANGE AVATAR
          </button>
          <button
            onClick={() => signOut(auth)}
            style={{
              marginTop: "20px",
              background: "transparent",
              border: "1px solid #222",
              color: "#555",
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            LOGOUT
          </button>
        </div>
      </aside>

      {
        <main>
          {/*  <Seeder /> */} {/*OVO JE ZA RANDOM GENIRANA POSTOVE */}
          <CreatePost />
          <Home />
        </main>
      }

      <aside className="sidebar">
        <h3
          style={{
            fontSize: "10px",
            color: "var(--accent-blue)",
            textTransform: "uppercase",
          }}
        >
          Terminal
        </h3>
        <div
          style={{
            fontSize: "13px",
            color: "var(--text-dim)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <p style={{ margin: 0 }}> USER: {user.displayName}</p>
          <p style={{ margin: 0 }}> STATUS: ONLINE</p>
        </div>

        <div className="stats-container">
          <h3
            style={{
              fontSize: "10px",
              color: "var(--accent-blue)",
              textTransform: "uppercase",
            }}
          >
            Database
          </h3>
          <div
            style={{
              fontSize: "13px",
              color: "var(--text-dim)",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <p style={{ margin: 0 }}> POSTS: {stats.posts}</p>
            <p style={{ margin: 0 }}> USERS: {stats.users}</p>
          </div>
        </div>
      </aside>

      {showPicker && (
        <div
          className="avatar-grid-overlay"
          onClick={() => setShowPicker(false)}
        >
          <div
            className="avatar-selector-box"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-x" onClick={() => setShowPicker(false)}>
              &times;
            </button>
            <h3
              style={{
                textAlign: "center",
                color: "white",
                letterSpacing: "2px",
              }}
            >
              SELECT IDENTITY
            </h3>
            <div className="grid-layout">
              {avatarOptions.map((url) => (
                <img
                  key={url}
                  src={url}
                  className="avatar-item"
                  onClick={() => handleChangeAvatar(url)}
                  alt="avatar"
                />
              ))}
            </div>
            <button
              onClick={() => setShowPicker(false)}
              className="btn-action"
              style={{ marginTop: "30px" }}
            >
              CANCEL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
