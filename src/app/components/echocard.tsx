import React from "react";
import { useState, useEffect } from "react";
import styles from "./echocard.module.css";

// Define a type for the props
type EchoCardProps = {
  title: string;
  category: string;
  content: string;
  postDate: string;
  backgroundClassName: string;
};

const EchoCard: React.FC<EchoCardProps> = ({
  title,
  category,
  content,
  postDate,
  backgroundClassName,
}) => {

  return (
    <div className={`${styles.card} ${styles[backgroundClassName]}`}>
      <div className={styles.category}>{category}</div>
      <div className={styles.content}>
        <div className={styles.header}>{title.toUpperCase()}</div>
        {/* <div className={styles.content}>{content}</div> */}
        <div className={styles.footer}>
          <span>{postDate}</span>
          {/* <button className={styles.resonateButton}>Resonate</button> */}
        </div>
      </div>
    </div>
  );
};

export default EchoCard;
