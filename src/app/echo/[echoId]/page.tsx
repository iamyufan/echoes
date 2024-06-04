"use client";

import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import Link from "next/link";

import styles from "./echo.module.css";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import Post from "@/app/components/post";

export default function Page({ params }: { params: { echoId: string } }) {
  const { user } = useAuthContext() as { user: any };
  const uid = user?.uid;
  const echoId = params.echoId;

  const [fetching, setFetching] = useState(true);
  const [echo, setEcho] = useState({}) as any;
  const [postDate, setPostDate] = useState("");
  const [resonances, setResonances] = useState([]) as any;
  const [resonanceContent, setResonanceContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [randomWord, setRandomWord] = useState("somebody");
  const [isCollected, setIsCollected] = useState(false);

  const fetchIsCollected = async () => {
    const response = await fetch(`/api/echo/${echoId}/collection?uid=${uid}`);
    // Return True if the user has collected the echo
    const data = await response.json();
    setIsCollected(data.isCollected);
  };

  const switchCollectionStatus = async () => {
    const response = await fetch(`/api/echo/${echoId}/collection`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid: user.uid }),
    });

    if (response.ok) {
      fetchIsCollected();
    }
  };

  const fetchRandomWord = async () => {
    const response = await fetch("https://random-word-api.herokuapp.com/word");
    if (response.ok) {
      const word = await response.json();
      setRandomWord(word[0]); // Assuming the API returns an array with one element
    } else {
      console.error("Failed to fetch random word");
    }
  };

  const fetchEcho = async () => {
    const response = await fetch(`/api/echo/${echoId}`);
    const data = await response.json();
    setEcho(data);

    const date = new Date(data.post_date._seconds * 1000);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric", // "1999"
      month: "long", // "December"
      day: "numeric", // "31"
    });
    setPostDate(formattedDate);
  };

  const fetchResonances = async () => {
    const response = await fetch(`/api/echo/${echoId}/resonance`);
    const data = await response.json();
    setResonances(
      data.sort((a: any, b: any) => a.post_date._seconds - b.post_date._seconds)
    );
  };

  const handleResonanceSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!user) {
      setError("You must be logged in to post a resonance.");
      setIsSubmitting(false);
      return;
    }

    try {
      const newResonance = {
        anonymized_author: randomWord,
        author_UID: user.uid,
        content: resonanceContent,
      };

      const response = await fetch(`/api/echo/${echoId}/resonance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newResonance),
      });

      if (!response.ok) {
        throw new Error("Failed to post resonance");
      }

      setResonanceContent(""); // Clear the input field after successful submission
      // alert("Resonance posted successfully!");

      // Fetch the updated list of resonances
      fetchResonances();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      try {
        await Promise.all([fetchEcho(), fetchIsCollected(), fetchResonances()]);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
      setFetching(false);
    };

    fetchData();
  }, []);

  return (
    <main className={styles.main}>
      <Navbar />
      {(fetching && <p>Loading...</p>) || (
        <div className={styles.detailContainer}>
          <Link href="/chamber">
            <p className={styles.backLink}>{"<"} Back</p>
          </Link>
          <div className={styles.echoContainer}>
            <div className={styles.category}>{echo.category}</div>
            <div className={styles.echo}>
              <h1 className={styles.echoTitle}>{echo.title}</h1>
            </div>

            <Post
              content={echo.content}
              post_date={postDate}
              anonymized_author={echo.anonymized_author}
            />
            {user && (
              <div className={styles.echoButtons}>
                {(isCollected && (
                  <button
                    className={styles.collectedButton}
                    onClick={switchCollectionStatus}
                  >
                    Collected
                  </button>
                )) || (
                  <button
                    className={styles.collectButton}
                    onClick={switchCollectionStatus}
                  >
                    Collect
                  </button>
                )}
              </div>
            )}
          </div>

          <div className={styles.resonanceContainer}>
            <div className={styles.resonances}>
              {(resonances.length === 0 && (
                <p className="italic">
                  No resonances yet. Be the first to resonate!
                </p>
              )) || (
                <>
                  {resonances.map((resonance: any) => (
                    <Post
                      key={resonance.id}
                      content={resonance.content}
                      post_date={new Date(
                        resonance.post_date._seconds * 1000
                      ).toLocaleDateString("en-US", {
                        year: "numeric", // "1999"
                        month: "long", // "December"
                        day: "numeric", // "31"
                      })}
                      anonymized_author={resonance.anonymized_author}
                    />
                  ))}
                </>
              )}
            </div>
            {(user && (
              <form
                className={styles.resonanceForm}
                onSubmit={handleResonanceSubmit}
              >
                <div className={styles.anonymousName}>
                  {randomWord && (
                    <div className={styles.randomWordDisplay}>
                      {" "}
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
                <textarea
                  className={styles.resonanceInput}
                  value={resonanceContent}
                  onChange={(e) => setResonanceContent(e.target.value)}
                  placeholder="Write your resonance..."
                  rows={5}
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.submitButton}
                >
                  Post Resonance
                </button>
              </form>
            )) || (
              <p className={styles.loginPrompt}>
                <Link href="/signin" className="underline">
                  Log in
                </Link>{" "}
                to post a resonance.
              </p>
            )}

            {error && (
              <div className={styles.errorMessage}>
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
