import { useEffect, useState } from "react";

import trophy from "../../../assets/tropy.png";
import styles from "./styles/QuizResults.module.css";

export default function QuizResults() {
  const [score, setScore] = useState(null);

  useEffect(() => {
    const userScore = JSON.parse(localStorage.getItem("userScore"));
    setScore(userScore);
  }, []);

  return (
    <div>
      <h1>Congrats quiz is complete</h1>
      <div className="image">
        <img src={trophy} alt="" />
      </div>
      {score && (
        <h1>
          Your score is{" "}
          <span className={styles.score}>
            {score.corrects}/{score.totalQuestions}
          </span>
        </h1>
      )}
    </div>
  );
}
