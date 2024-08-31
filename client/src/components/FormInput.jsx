import styles from "./styles/FormInput.module.css";

const FormInput = ({ label, type, register, required, field, error }) => {
  return (
    <div className={styles.inputDiv}>
      <label>{label}</label>
      <div className={styles.group}>
        <input
          type={type}
          className={`${styles.input} ${error ? styles.inputError : ""}`}
          {...register(field, { required })}
        />
        <p className={styles.error}>{error?.message}</p>
      </div>
    </div>
  );
};

export default FormInput;
