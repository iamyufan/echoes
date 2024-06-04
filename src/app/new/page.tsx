"use client";

import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

import styles from "./new.module.css";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import Link from "next/link";
import categories from "../categories";

export default function Page() {
  const { user } = useAuthContext() as { user: any };
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [randomWord, setRandomWord] = useState("somebody");

  const fetchRandomWord = async () => {
    const response = await fetch("https://random-word-api.herokuapp.com/word");
    if (response.ok) {
      const word = await response.json();
      setRandomWord(word[0]); // Assuming the API returns an array with one element
    } else {
      console.error("Failed to fetch random word");
    }
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    const newEcho = {
      anonymized_author: randomWord,
      author_UID: user.uid,
      title,
      content,
      category,
      visibility: 1,
    };

    const response = await fetch("/api/echoes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEcho),
    });

    if (response.ok) {
      console.log("Echo created successfully");
      router.push("/chamber");
    } else {
      console.error("Failed to create echo");
    }
  };

  return (
    <main className={styles.main}>
      <Navbar />
      <div className={styles.container}>
        {/* Enable this feature only if the user is signed in */}
        {(user && (
          <form onSubmit={handleSubmit} className={styles.formContainer}>
            <div className={styles.textContainer}>
              <div className={styles.titleInput}>
                <label htmlFor="title"></label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  placeholder="TITLE"
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className={styles.textInput}>
                <label htmlFor="content"></label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Echo your thoughts..."
                  rows={20}
                  required
                />
              </div>
            </div>
            <div className={styles.rightContainer}>
              <div className={styles.buttonGroup}>
                <div className="font-bold">Topics:</div>
                {categories.map(
                  (cat) =>
                    // If the category name is All, ignore it
                    cat.name !== "All" && (
                      <button
                        key={cat.name}
                        type="button"
                        className={
                          category === cat.name
                            ? `${styles.categoryButton} ${styles[cat.style]}`
                            : styles.categoryButton
                        }
                        onClick={() => setCategory(cat.name)}
                      >
                        {cat.name}
                        <span className={`${styles.tooltip}`}>
                          {cat.description}
                        </span>
                      </button>
                    )
                )}
              </div>
              <div className={styles.anonymousName}>
                {randomWord && (
                  <div className={styles.randomWordDisplay}>
                    Anonymous as:{" "}
                    <span className={styles.randomWord}>{randomWord}</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={fetchRandomWord}
                  className={styles.randomButton}
                >
                  regenerate
                </button>
              </div>
              <div className={styles.saveForLater}></div>
              <button
                type="submit"
                disabled={!category || !title || !content}
                className={
                  !category || !title || !content
                    ? `${styles.submitButton} ${styles.disabled}`
                    : `${styles.submitButton} ${styles.enabled}`
                }
              >
                Cast the Echo
              </button>
            </div>
          </form>
        )) || (
          <div className={styles.signInPrompt}>
            <h1>Sign in to cast your Echo</h1>

            <div>
              <h2>Already have an account?</h2>
              <Link href="/signin">Sign in</Link>
            </div>
            <div>
              <h2>Don't have an account?</h2>
              <Link href="/signup">Sign up</Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
