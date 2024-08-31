import styles from "./styles/Button.module.css";

export default function Button({
  children = "Button",
  type = "submit",
  style,
  variant,
  onClick,
}) {
  const buttonVariant = variant ? styles[variant] : "";

  return (
    <button
      onClick={onClick}
      style={{ ...style }}
      className={`${styles.button} ${buttonVariant}`}
      type={type}
    >
      {children}
    </button>
  );
}
