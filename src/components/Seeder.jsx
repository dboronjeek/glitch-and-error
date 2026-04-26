import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const Seeder = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const seedDatabase = async () => {
    setLoading(true);
    setStatus("Establishing high-bandwidth uplink...");

    const categories = ["Games", "Software", "Hardware", "Other"];

    const megaTitles = [
      "The complete breakdown of the latest Neural-Link update",
      "Why 2026 is the year of Decentralized Operating Systems",
      "Hardware Review: The Liquid-Cooled Quantum Processor",
      "Security Alert: Unauthorized access detected in the Mainframe",
      "The evolution of Cyberpunk culture in modern software design",
      "Deep dive into the 128-bit gaming architecture leaks",
      "How to optimize your kernel for maximum terminal velocity",
      "The rise of AI-driven procedurally generated open worlds",
      "Legacy Code: Resurrecting forgotten servers from the 90s",
      "New Encryption Protocols: Is your data truly safe?",
    ];

    const longDescriptions = [
      "In this comprehensive analysis, we take a closer look at the underlying architecture that powers our daily interactions with the digital void. From the way packets are routed through high-latency nodes to the intricate dance of bits in a quantum environment, there is much to discover. We have spent the last 48 hours stress-testing the system to bring you these results.",
      "The latest hardware benchmarks have sent shockwaves through the community. Many thought we had reached the limit of silicon, but new experimental cooling methods have proven everyone wrong. In this post, we discuss the thermal dynamics and the raw power output of the latest prototype units that were leaked from the research facility in Sector 4.",
      "Software development is changing at an alarming rate. No longer are we tied to static compilers and manual memory management. The new wave of self-healing codebases is here, and it promises to eliminate the 'Glitch & Error' philosophy that has dominated our terminals for decades. However, this transition does not come without significant risks to system stability.",
      "Gaming has moved beyond simple pixels and frames. We are now entering the era of sensory-synced environments where every glitch is intentional and every error is a hidden path. After spending over 100 hours in the latest build, I can confidently say that the boundary between reality and the simulation is thinner than it has ever been before.",
    ];

    for (let i = 1; i <= 100; i++) {
      try {
        const randomTitle =
          megaTitles[Math.floor(Math.random() * megaTitles.length)];
        const randomDesc =
          longDescriptions[Math.floor(Math.random() * longDescriptions.length)];
        const extraText =
          " Added security layer: " +
          Math.random().toString(36).substring(2, 15) +
          ". Verification status: CLEAR. End of transmission.";

        await addDoc(collection(db, "posts"), {
          title: `${randomTitle} | Entry #${i}`,
          content: `${randomDesc}\n\n${randomDesc}\n\n${extraText}`,
          category: categories[Math.floor(Math.random() * categories.length)],
          author: "Admin_System",
          authorAvatar: `https://api.dicebear.com/7.x/bottts/svg?seed=ultra${i}`,
          authorId: "admin-bot-id",
          createdAt: serverTimestamp(),
        });

        if (i % 5 === 0) setStatus(`Transmitting data: ${i}/100 packets...`);
      } catch (e) {
        console.error(e);
      }
    }

    setStatus("Transmission complete. 100 high-capacity posts added.");
    setLoading(false);
  };

  return (
    <div
      style={{
        padding: "25px",
        background: "#0a0d16",
        border: "2px solid #0066ff",
        borderRadius: "12px",
        marginBottom: "30px",
        textAlign: "center",
      }}
    >
      <h3
        style={{
          color: "#0066ff",
          margin: "0 0 10px 0",
          fontSize: "14px",
          letterSpacing: "2px",
        }}
      >
        MASSIVE DATA INJECTION
      </h3>
      <p style={{ fontSize: "12px", color: "#64748b", marginBottom: "20px" }}>
        {status || "Ready to populate terminal with 100 large entries"}
      </p>
      <button
        onClick={seedDatabase}
        disabled={loading}
        className="btn-action"
        style={{ padding: "12px 30px", width: "auto" }}
      >
        {loading ? "UPLOADING..." : "START BIG SEED"}
      </button>
    </div>
  );
};

export default Seeder;
