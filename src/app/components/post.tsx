import React from "react";
import styles from "./post.module.css";

// Define a type for the props
type PostProps = {
  content: string;
  post_date: string;
  anonymized_author: string;
};

const Post: React.FC<PostProps> = ({
  content,
  post_date,
  anonymized_author,
}) => {
  // Handle line breaks in the content
  const formattedContent = content.split("\n").map((line, index) => {
    return (
      <span key={index}>
        {line}
        <br />
      </span>
    );
  });

  return (
    <div className={styles.card}>
      <div className={styles.postContainer}>
        <div className={styles.authorContainer}>
          <span className={styles.authorName}>{anonymized_author}</span>
          <div className={styles.postDate}>
            <p>{post_date}</p>
          </div>
        </div>
        <div className={styles.content}>{formattedContent}</div>
      </div>
    </div>
  );
};

export default Post;
