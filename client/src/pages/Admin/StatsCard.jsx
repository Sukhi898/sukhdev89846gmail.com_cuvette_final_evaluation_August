import styles from "./styles/StatsCard.module.css";

export default function StatsCard({ number, text, color }) {
  // Format number to 'k' if greater than 1000
  const formattedNumber =
    number > 1000 ? (number / 1000).toFixed(1) + "k" : number;

  return (
    <div style={{ color }} className={styles.container}>
      <p className={styles.number}>{formattedNumber}</p>
      <p className={styles.text}>{text}</p>
    </div>
  );
}
