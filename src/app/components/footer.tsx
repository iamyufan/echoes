"use client";

import Link from "next/link";
import styles from "./navbar.module.css";

const Footer = () => {
  return (
    <>
      <div className={styles.footer}>
        <Link href="/" className={styles.text}>
          Echoes.
        </Link>
        <div className={styles.text}>
          {" "}
          Developed by{" "}
          <Link href="https://yufanbruce.com" className="underline">
            Yufan
          </Link>
        </div>
      </div>
    </>
  );
};

export default Footer;
