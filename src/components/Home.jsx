import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  deleteDoc,
} from "firebase/firestore";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [commentText, setCommentText] = useState({});
  const [replyText, setReplyText] = useState({});
  const [activeReplyId, setActiveReplyId] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          likedBy: doc.data().likedBy || [],
          comments: doc.data().comments || [],
        })),
      );
    });
  }, []);

  const handleLikePost = async (postId, likedBy) => {
    const userId = auth.currentUser.uid;
    const postRef = doc(db, "posts", postId);
    const isLiked = likedBy.includes(userId);
    await updateDoc(postRef, {
      likedBy: isLiked
        ? likedBy.filter((id) => id !== userId)
        : [...likedBy, userId],
    });
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("FATAL ERROR: Delete this post permanently?")) {
      try {
        await deleteDoc(doc(db, "posts", postId));
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const handleAddComment = async (e, postId) => {
    e.preventDefault();
    if (!commentText[postId]?.trim()) return;
    const postRef = doc(db, "posts", postId);
    const newComment = {
      id: `${Date.now()}-${auth.currentUser.uid}`,
      author: auth.currentUser.displayName,
      authorId: auth.currentUser.uid,
      text: commentText[postId],
      createdAt: new Date().toISOString(),
      likedBy: [],
      replies: [],
    };
    await updateDoc(postRef, { comments: arrayUnion(newComment) });
    setCommentText({ ...commentText, [postId]: "" });
  };

  const handleAddReply = async (e, postId, commentId) => {
    e.preventDefault();
    if (!replyText[commentId]?.trim()) return;
    const postRef = doc(db, "posts", postId);
    const post = posts.find((p) => p.id === postId);
    const updatedComments = post.comments.map((c) => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: [
            ...(c.replies || []),
            {
              id: `${Date.now()}-reply-${auth.currentUser.uid}`,
              author: auth.currentUser.displayName,
              authorId: auth.currentUser.uid,
              text: replyText[commentId],
              createdAt: new Date().toISOString(),
            },
          ],
        };
      }
      return c;
    });
    await updateDoc(postRef, { comments: updatedComments });
    setReplyText({ ...replyText, [commentId]: "" });
    setActiveReplyId(null);
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (window.confirm("Delete this comment?")) {
      const postRef = doc(db, "posts", postId);
      const post = posts.find((p) => p.id === postId);
      const filteredComments = post.comments.filter((c) => c.id !== commentId);
      await updateDoc(postRef, { comments: filteredComments });
    }
  };

  const handleDeleteReply = async (postId, commentId, replyId) => {
    if (window.confirm("Delete this reply?")) {
      const postRef = doc(db, "posts", postId);
      const post = posts.find((p) => p.id === postId);
      const updatedComments = post.comments.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            replies: c.replies.filter((r) => r.id !== replyId),
          };
        }
        return c;
      });
      await updateDoc(postRef, { comments: updatedComments });
    }
  };

  const filteredPosts = posts.filter((post) => {
    const content = ((post.title || "") + (post.content || "")).toLowerCase();
    return (
      content.includes(searchTerm.toLowerCase()) &&
      (activeCategory === "All" || post.category === activeCategory)
    );
  });

  return (
    <div style={{ width: "100%" }}>
      <div className="control-panel">
        <input
          className="search-input"
          placeholder="SEARCH DATABASE..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          style={{ width: "150px" }}
          onChange={(e) => setActiveCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Games">Games</option>
          <option value="Software">Software</option>
          <option value="Hardware">Hardware</option>
        </select>
      </div>

      {filteredPosts.map((post) => (
        <article key={post.id} className="post-card">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: "15px" }}>
              <img
                src={post.authorAvatar}
                style={{ width: "45px", borderRadius: "8px" }}
                alt="av"
              />
              <div>
                <div style={{ fontWeight: "bold" }}>u/{post.author}</div>
                <div className="post-timestamp">
                  {post.createdAt?.toDate().toLocaleString()}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <span
                style={{
                  fontSize: "10px",
                  color: "var(--accent-blue)",
                  fontWeight: "bold",
                }}
              >
                g/{post.category}
              </span>
              {post.authorId === auth.currentUser.uid && (
                <button
                  onClick={() => handleDeletePost(post.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  🗑️
                </button>
              )}
            </div>
          </div>

          <h2 style={{ margin: "20px 0 10px 0" }}>{post.title}</h2>
          <p style={{ color: "var(--text-dim)", lineHeight: "1.6" }}>
            {post.content}
          </p>

          <div className="interaction-bar">
            <button
              className={`heart-btn ${post.likedBy.includes(auth.currentUser.uid) ? "active" : ""}`}
              onClick={() => handleLikePost(post.id, post.likedBy)}
            >
              {post.likedBy.includes(auth.currentUser.uid) ? "❤️" : "🤍"}{" "}
              {post.likedBy.length}
            </button>
          </div>

          <div className="comment-section">
            <h4
              style={{
                fontSize: "9px",
                color: "var(--accent-blue)",
                letterSpacing: "1px",
              }}
            >
              SYSTEM_LOGS / COMMENTS
            </h4>
            {post.comments.map((c) => (
              <div
                key={c.id}
                style={{
                  marginBottom: "15px",
                  borderLeft: "1px solid #1e293b",
                  paddingLeft: "10px",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>
                    <span className="comment-author">{c.author}</span>
                    <span
                      style={{
                        fontSize: "10px",
                        color: "#444",
                        marginLeft: "8px",
                      }}
                    >
                      {new Date(c.createdAt).toLocaleTimeString()}
                    </span>
                  </span>
                  {c.authorId === auth.currentUser.uid && (
                    <button
                      onClick={() => handleDeleteComment(post.id, c.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#ff4b2b",
                        cursor: "pointer",
                        fontSize: "10px",
                      }}
                    >
                      [DELETE]
                    </button>
                  )}
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    marginTop: "4px",
                    color: "#cbd5e1",
                  }}
                >
                  {c.text}
                </div>

                <button
                  onClick={() =>
                    setActiveReplyId(activeReplyId === c.id ? null : c.id)
                  }
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--accent-blue)",
                    fontSize: "10px",
                    cursor: "pointer",
                    marginTop: "5px",
                  }}
                >
                  REPLY
                </button>

                {c.replies?.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      marginLeft: "20px",
                      marginTop: "8px",
                      fontSize: "11px",
                      opacity: 0.8,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>
                        <span style={{ color: "var(--accent-blue)" }}>
                          ↳ {r.author}:
                        </span>{" "}
                        {r.text}
                        <span
                          style={{
                            fontSize: "9px",
                            color: "#444",
                            marginLeft: "8px",
                          }}
                        >
                          {new Date(r.createdAt).toLocaleTimeString()}
                        </span>
                      </span>
                      {r.authorId === auth.currentUser.uid && (
                        <button
                          onClick={() => handleDeleteReply(post.id, c.id, r.id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#ff4b2b",
                            cursor: "pointer",
                            fontSize: "9px",
                          }}
                        >
                          [×]
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {activeReplyId === c.id && (
                  <form
                    onSubmit={(e) => handleAddReply(e, post.id, c.id)}
                    style={{ marginTop: "10px", display: "flex", gap: "5px" }}
                  >
                    <input
                      className="comment-input"
                      style={{ fontSize: "11px" }}
                      placeholder="Type reply..."
                      value={replyText[c.id] || ""}
                      onChange={(e) =>
                        setReplyText({ ...replyText, [c.id]: e.target.value })
                      }
                    />
                    <button
                      type="submit"
                      className="btn-action"
                      style={{ padding: "5px 10px", fontSize: "9px" }}
                    >
                      SEND
                    </button>
                  </form>
                )}
              </div>
            ))}

            <form
              className="comment-input-group"
              onSubmit={(e) => handleAddComment(e, post.id)}
            >
              <input
                className="comment-input"
                placeholder="Add comment..."
                value={commentText[post.id] || ""}
                onChange={(e) =>
                  setCommentText({ ...commentText, [post.id]: e.target.value })
                }
              />
              <button type="submit" className="btn-action">
                SEND
              </button>
            </form>
          </div>
        </article>
      ))}
    </div>
  );
};

export default Home;
