import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";

import { Button } from "../../../components";
import Question from "../Question";
import Timer from "../Timer";
import styles from "./styles/index.module.css";

export default function Poll() {
  const { pollId } = useParams();
  const [poll, setPoll] = useState(null);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useImmer([]);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentQuestion = poll?.questions[index];

  const fetchPoll = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}api/polls/${pollId}`
      );

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.message ?? "Poll not found");
      }

      const resJson = await res.json();
      setPoll(resJson.data.poll);
    } catch (error) {
      setError(error);
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [pollId]);

  useEffect(() => {
    fetchPoll();
  }, [fetchPoll]);

  const submitAnswers = useCallback(
    async (results) => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}api/polls/attempt/${pollId}`,
          {
            method: "PATCH",
            body: JSON.stringify({ results }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          const resError = await res.json();
          console.log(resError);
          throw new Error("Could not submit answers");
        }
      } catch (error) {
        console.log(error);
      }
    },
    [pollId]
  );

  const handleIndex = () => {
    if (index >= poll.questions.length - 1) {
      submitAnswers(results).then(() => navigate("/user/poll/results"));
    } else {
      setIndex((prev) => prev + 1);
    }
  };

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
  } else if (poll) {
    content = (
      <>
        <div className={styles.meta}>
          <p className={styles.count}>
            {index + 1}/{poll.questions.length}
          </p>

          {poll.timer && (
            <Timer
              key={index}
              timer={poll.timer}
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
          {index >= poll.questions.length - 1 ? "Submit" : "Next"}
        </Button>
      </>
    );
  }

  return <div className={styles.container}>{content}</div>;
}
