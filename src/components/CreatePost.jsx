import React, { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Games");

  const handlePost = async (e) => {
    e.preventDefault();
    if (!title || !content) return;
    await addDoc(collection(db, "posts"), {
      title,
      content,
      category,
      author: auth.currentUser.displayName,
      authorAvatar: auth.currentUser.photoURL,
      authorId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    });
    setTitle("");
    setContent("");
  };

  return (
    <div className="post-card">
      <form onSubmit={handlePost}>
        <div style={{ display: "flex", gap: "15px" }}>
          <input
            placeholder="TITLE"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: "150px" }}
          >
            <option value="Games">Games</option>
            <option value="Software">Software</option>
            <option value="Hardware">Hardware</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <textarea
          placeholder="WRITE SOMETHING..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows="3"
        />
        <div style={{ textAlign: "right" }}>
          <button
            className="btn-action"
            type="submit"
            style={{ width: "auto", padding: "10px 40px" }}
          >
            POST
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
