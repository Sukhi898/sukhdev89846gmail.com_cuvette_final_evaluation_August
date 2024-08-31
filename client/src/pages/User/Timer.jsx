import styles from "./styles/Timer.module.css";
import { useTimer } from "@mzaleski/use-timer";

export default function Timer({ timer, handleTimerEnd }) {
  const { timeRemaining } = useTimer(timer, false, handleTimerEnd);
  return (
    <div className={styles.timer}>
      <p>{timeRemaining}s</p>
    </div>
  );
}
