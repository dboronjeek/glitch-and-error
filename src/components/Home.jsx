import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const formatDate = (ts) => {
    if (!ts) return "---";
    const d = ts.toDate();
    return (
      d.toLocaleDateString("en-US") +
      " " +
      d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <div style={{ width: "100%" }}>
      {posts.map((post) => (
        <article key={post.id} className="post-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div style={{ display: "flex", gap: "15px" }}>
              <img
                src={post.authorAvatar}
                style={{ width: "45px", height: "45px", borderRadius: "8px" }}
                alt="av"
              />
              <div>
                <div style={{ fontWeight: "bold" }}>u/{post.author}</div>
                <div className="post-timestamp">
                  {formatDate(post.createdAt)}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span
                style={{
                  fontSize: "10px",
                  color: "var(--accent-blue)",
                  fontWeight: "bold",
                }}
              >
                g/{post.category}
              </span>
              {auth.currentUser?.uid === post.authorId && (
                <button
                  onClick={() => deleteDoc(doc(db, "posts", post.id))}
                  className="delete-btn"
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
          <h2
            style={{
              margin: "20px 0 10px 0",
              fontSize: "24px",
              fontWeight: "800",
            }}
          >
            {post.title}
          </h2>
          <p
            style={{
              color: "var(--text-dim)",
              lineHeight: "1.6",
              whiteSpace: "pre-wrap",
            }}
          >
            {post.content}
          </p>
        </article>
      ))}
    </div>
  );
};

export default Home;
