import { useContext } from "react";
import { Button, Input } from "../../components/";
import useInput from "../../hooks/useInput";
import styles from "./styles/QuizInitiator.module.css";
import { ModalContext } from "./Naviagtion";

export default function QuizInitiator({
  setIsCreatingQuiz,
  quizType,
  setQuizName,
  setQuizType,
}) {
  const { toggleModal } = useContext(ModalContext);
  const inputProps = useInput();

  const handleProceed = () => {
    setIsCreatingQuiz(true);
    setQuizName(inputProps.value);
  };

  // Determine the placeholder based on quizType
  const placeholderText = quizType === "poll" ? "Poll name" : "Quiz name";

  return (
    <div>
      <Input {...inputProps} placeholder={placeholderText} />
      <div className={styles.quizType}>
        <p>Quiz Type</p>
        <Button
          variant={quizType === "quiz" ? "primary" : ""}
          onClick={() => setQuizType("quiz")}
        >
          Q&A
        </Button>
        <Button
          variant={quizType === "poll" ? "primary" : ""}
          onClick={() => setQuizType("poll")}
        >
          Poll
        </Button>
      </div>
      <div className={styles.actions}>
        <Button onClick={toggleModal}>Cancel</Button>
        <Button variant="primary" onClick={handleProceed}>
          Continue
        </Button>
      </div>
    </div>
  );
}
