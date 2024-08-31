import styles from "./styles/Modal.module.css";

export default function Modal({ children, toggleModal }) {
  // const { toggleModal } = useContext(ModalContext);

  return (
    <div className={styles.container}>
      <div onClick={toggleModal} className={styles.backdrop} />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
