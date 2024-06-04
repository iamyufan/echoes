import Link from "next/link";

import styles from "./cardgrid.module.css";
import EchoCard from "./echocard";

const CardGrid: React.FC<{ echoes: any }> = ({ echoes }) => {
  const categories = [
    {
      name: "Heartstrings",
      style: "heartstrings",
      description: "Share and discover tales of love and relationships.",
    },
    {
      name: "Bare Soul",
      style: "baresoul",
      description: "Confess your secrets safely and anonymously.",
    },
    {
      name: "Dream Scape",
      style: "dreamscape",
      description: "Make a wish and share your deepest desires.",
    },
    {
      name: "Culture Cache",
      style: "culturecache",
      description:
        "Discuss and recommend your favorite cultural items (movie/music/book).",
    },
    {
      name: "Guiding Lights",
      style: "guidinglights",
      description: "Seek or offer advice on various topics.",
    },
    {
      name: "Pulse Points",
      style: "pulsepoints",
      description: "Discuss health and wellness strategies.",
    },
    {
      name: "Mind & Body",
      style: "mindnbody",
      description: "Explore and debate current news and events.",
    },
  ];

  return (
    <div className={styles.cardgrid}>
      {echoes.map((echo: any) => (
        <Link href="/echo/[id]" as={`/echo/${echo.id}`} key={echo.id}>
          <EchoCard
            key={echo.id}
            title={echo.title}
            category={echo.category}
            content={echo.content}
            // Convert the date to a human-readable format
            postDate={
              new Date(echo.post_date._seconds * 1000).toLocaleDateString(
                "en-US",
                {
                  year: "numeric", // "1999"
                  month: "long", // "December"
                  day: "numeric", // "31"
                }
              )
            }
            backgroundClassName={
              categories.find((c) => c.name === echo.category)?.style || ""
            }
          />
        </Link>
      ))}
      {/* <div className={styles.card}>
      </div> */}
    </div>
  );
};

export default CardGrid;
