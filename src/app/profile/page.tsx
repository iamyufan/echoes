"use client";

import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";

import styles from "./profile.module.css";
import Navbar from "@/app/components/navbar";
import CardGrid from "@/app/components/cardgrid";
import Footer from "@/app/components/footer";

export default function Page() {
  const { user } = useAuthContext() as { user: any };
  const uid = user?.uid;

  const [fetching, setFetching] = useState(true);
  const [authoredEchoes, setAuthoredEchoes] = useState([]) as any;
  const [resonatedEchoes, setResonatedEchoes] = useState([]) as any;
  const [collectedEchoes, setCollectedEchoes] = useState([]) as any;
  const [numberOfCategories, setNumberOfCategories] = useState(0);

  const [showModal, setShowModal] = useState("authored");
  const [showEchoes, setShowEchoes] = useState([]) as any;

  const fetchAuthoredEchoes = async () => {
    const response = await fetch(`/api/echoes/${uid}/authored`);
    let data = await response.json();
    // Sort the echoes by date in descending order
    data = data.sort((a: any, b: any) => b.date - a.date);

    // Count the distinct categories that the user has authored echoes in
    const categories = data.map((echo: any) => echo.category);
    const uniqueCategories = new Set(categories);
    setNumberOfCategories(uniqueCategories.size);
    setAuthoredEchoes(data);
    setShowEchoes(data);
  };

  const fetchResonatedEchoes = async () => {
    const response = await fetch(`/api/echoes/${uid}/resonated`);
    const data = await response.json();
    setResonatedEchoes(data);
  };

  const fetchCollectedEchoes = async (category = "all") => {
    const url =
      category === "all"
        ? `/api/echoes/${uid}/collected`
        : `/api/echoes/${uid}/collected?category=${category}`;
    const response = await fetch(url);
    const data = await response.json();
    setCollectedEchoes(data);
  };

  const switchTab = (tab: string) => {
    setShowModal(tab);

    if (tab === "authored") {
      setShowEchoes(authoredEchoes);
    } else if (tab === "collected") {
      setShowEchoes(collectedEchoes);
    } else if (tab === "resonated") {
      setShowEchoes(resonatedEchoes);
    } else {
      setShowEchoes([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      try {
        await Promise.all([
          fetchAuthoredEchoes(),
          fetchResonatedEchoes(),
          fetchCollectedEchoes(),
        ]);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
      setFetching(false);
    };

    if (uid) {
      fetchData();
    }
  }, [uid]);

  return (
    <main className={styles.main}>
      <Navbar />
      {(fetching && <p>Loading...</p>) || (
        <div className={styles.container}>
          <div className={styles.summaryContainer}>
            {/* <p className={styles.heading}>Your Echoes Impact</p> */}
            <p className={styles.heading}>
              You are logged in as{" "}
              <span className={styles.email}>{user?.email}</span>.
            </p>

            <div className={styles.textContainer}>
              <p className={styles.info}>
                You’ve shared{" "}
                <span className={styles.number}>{authoredEchoes.length}</span>{" "}
                echoes, sparking conversations and sharing insights across{" "}
                <span className={styles.number}>{numberOfCategories}</span>{" "}
                topics.
              </p>

              <p className={styles.info}>
                You have collected{" "}
                <span className={styles.number}>{collectedEchoes.length}</span>{" "}
                echoes, keeping track of conversations that matter most to you.
              </p>

              <p className={styles.info}>
                Your voice has been heard{" "}
                <span className={styles.number}>{resonatedEchoes.length}</span>{" "}
                times, contributing to the depth and diversity of discussions.
              </p>
            </div>
          </div>
          <div className={styles.tabContainer}>
            <button
              className={`${styles.tabButton} ${
                showModal === "authored" ? styles.active : ""
              }`}
              onClick={() => switchTab("authored")}
            >
              Echoes
            </button>
            <button
              className={`${styles.tabButton} ${
                showModal === "collected" ? styles.active : ""
              }`}
              onClick={() => switchTab("collected")}
            >
              Collected
            </button>
            <button
              className={`${styles.tabButton} ${
                showModal === "resonated" ? styles.active : ""
              }`}
              onClick={() => switchTab("resonated")}
            >
              Resonated
            </button>
          </div>

          <div className={styles.gridContainer}>
            <CardGrid echoes={showEchoes} />
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
