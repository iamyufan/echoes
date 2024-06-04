import Link from "next/link";

import Navbar from "./components/navbar";
import styles from "./home.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <Navbar />
      <div className={styles.center}>
        <h1>Echoes.</h1>
        <p>Where Your Voice is Resonated, Not Judged</p>
      </div>
      <div className={styles.grid}>
        {/* <Link href="/recorder" className={styles.card}>
          <h2>echo recorder</h2>
          <p>hear new echoes.</p>
        </Link> */}

        <Link href="/new" className={styles.card}>
          <h2>echo</h2>
          <p>create a new echo.</p>
        </Link>

        <Link href="/chamber" className={styles.card}>
          <h2>echo chamber</h2>
          <p>view the echoes.</p>
        </Link>
      </div>
    </main>
  );
}
