import Link from "next/link";
import styles from "./CaseStudy.module.css";

export type NextTarget = { href: string; title: string; kicker: string; img?: string };

/** The bottom of every page points to the next chapter of the story. */
export default function NextChapter({ next }: { next: NextTarget }) {
  return (
    <Link href={next.href} className={styles.next}>
      <span className="mono muted">{next.kicker} →</span>
      <span className={`display ${styles.nextTitle}`}>{next.title}</span>
      {next.img && (
        <div className={`${styles.nextImg} img-grain`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={next.img} alt={next.title} loading="lazy" />
        </div>
      )}
    </Link>
  );
}
