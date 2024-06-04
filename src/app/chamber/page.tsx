"use client";

import { useState, useEffect } from "react";

import styles from "./chamber.module.css";
import Navbar from "@/app/components/navbar";
import CardGrid from "@/app/components/cardgrid";
import Footer from "@/app/components/footer";
import categories from "../categories";

export default function Page() {
  const [allEchoes, setAllEchoes] = useState([]) as any;

  const [filteredEchoes, setFilteredEchoes] = useState([]) as any;

  const [fetching, setFetching] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState() as any;

  const fetchAllEchoes = async () => {
    const url = "/api/echoes";
    const response = await fetch(url);
    const data = await response.json();

    // Shuffle the echoes to increase the possibility of seeing different echoes
    data.sort(() => Math.random() - 0.5);

    setAllEchoes(data);
  };

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      try {
        await Promise.all([fetchAllEchoes()]);
      } catch (error) {
        console.error(error);
      }
      setSelectedCategory("All");
      setFetching(false);
    };
    fetchData();
  }, []);

  const filterEchoes = (category: string) => {
    if (category === "All") {
      return allEchoes;
    } else {
      return allEchoes.filter((echo: any) => echo.category === category);
    }
  };

  useEffect(() => {
    if (!fetching) {
      console.log("selectedCategory", selectedCategory);
      setFilteredEchoes(filterEchoes(selectedCategory));
    }
  }, [selectedCategory]);

  return (
    <main className={styles.main}>
      <Navbar />
      <div className={styles.centerContainer}>
        <div className={styles.categoryButtons}>
          {categories.map((category) => (
            <button
              key={category.name}
              className={`${styles.categoryButton} 
              ${category.style}
              ${
                selectedCategory === category.name
                  ? `${styles.active} ${styles[category.style]}`
                  : ""
              }`}
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name}
            </button>
          ))}
        </div>
        {((fetching || !allEchoes) && (
          <p className={styles.loading}>Loading...</p>
        )) || (
          <div className={styles.gridContainer}>
            <CardGrid echoes={filteredEchoes} />
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
