import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";

import { Button } from "../../../components/";
import Question from "../Question";
import Timer from "../Timer";
import styles from "./styles/index.module.css";

export default function Quiz() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useImmer([]);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentQuestion = quiz?.questions?.[index];

  const fetchQuiz = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}api/quizzes/${quizId}`
      );

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.message ?? "Quiz not found");
      }

      const resJson = await res.json();
      setQuiz(resJson.data.quiz);
    } catch (error) {
      setError(error);
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    localStorage.setItem("userScore", null);
    fetchQuiz();
  }, [fetchQuiz]);
  const submitAnswers = useCallback(
    async (results) => {
      try {
        const url = `${
          import.meta.env.VITE_BACKEND_URL
        }api/quizzes/attempt/${quizId}`;
        console.log("Request URL:", url);

        const response = await fetch(url, {
          method: "PATCH",
          body: JSON.stringify({ results }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.log("Response Error:", errorData);
          throw new Error("Could not submit answers");
        }

        const responseData = await response.json();
        localStorage.setItem(
          "userScore",
          JSON.stringify(responseData.data.userResults)
        );
      } catch (error) {
        console.error("Error submitting answers:", error);
      }
    },
    [quizId]
  );

  const handleIndex = useCallback(() => {
    if (quiz && index >= quiz.questions.length - 1) {
      submitAnswers(results).then(() => navigate("/user/quiz/results"));
    } else {
      setIndex((prev) => prev + 1);
    }
  }, [index, quiz, results, submitAnswers, navigate]);

  const addResult = (result) => {
    setResults((draft) => {
      const index = draft.findIndex(
        (res) => res.questionId === result.questionId
      );

      if (index !== -1) {
        draft[index] = result;
      } else {
        draft.push(result);
      }
    });
  };

  let content;

  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (error) {
    content = <p>{error.message}</p>;
  } else if (quiz) {
    content = (
      <>
        <div className={styles.meta}>
          <p className={styles.count}>
            {index + 1}/{quiz.questions.length}
          </p>
          {quiz.timer && (
            <Timer
              key={index}
              timer={quiz.timer}
              handleTimerEnd={handleIndex}
            />
          )}
        </div>

        <Question
          key={currentQuestion._id}
          addResult={addResult}
          question={currentQuestion}
        />

        <Button variant={"primary"} onClick={handleIndex}>
          {index >= quiz.questions.length - 1 ? "Submit" : "Next"}
        </Button>
      </>
    );
  }

  return <div className={styles.container}>{content}</div>;
}
