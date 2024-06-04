import React from "react";
import styles from "./echocard.module.css";

// Define a type for the props
type EchoContentProps = {
  title: string;
  category: string;
  content: string;
  timeAgo: string;
};

const EchoCard: React.FC<EchoContentProps> = ({
  title,
  category,
  content,
  timeAgo,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.category}>{category}</div>
      <div className={styles.content}>
        <div className={styles.header}>{title.toUpperCase()}</div>
        {/* <div className={styles.content}>{content}</div> */}
        <div className={styles.footer}>
          <span>{timeAgo} ago</span>
          <button className={styles.resonateButton}>Resonate</button>
        </div>
      </div>
    </div>
  );
};

export default EchoCard;
