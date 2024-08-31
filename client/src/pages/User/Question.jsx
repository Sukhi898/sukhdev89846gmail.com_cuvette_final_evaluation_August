import { useState } from "react";
import Option from "./Option";
import styles from "./styles/Question.module.css";

export default function Question({ question, addResult }) {
  console.log(question);
  const [selected, setSelected] = useState(null);

  const handleSelect = (index) => {
    const result = { questionId: question._id, selectedOption: index };

    addResult(result);
    setSelected(index);
  };

  return (
    <div className="">
      <p className={styles.question}>{question?.question}</p>
      <div className={styles.options}>
        {question.options?.map((op, index) => (
          <Option
            selected={selected}
            onClick={() => handleSelect(index)}
            key={op._id}
            index={index}
            op={op}
          />
        ))}
      </div>
    </div>
  );
}
