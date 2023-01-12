import styles from "./banner.module.css";

interface IBannerProps {
  buttonText: string;
  handleOnClick: () => void
}

const Banner = (props: IBannerProps) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <span className={styles.title1}>Coffee</span>
        <span className={styles.title2}>Connoissuer</span>
      </h1>
      <p className={styles.subtitle}>Discover your local coffee stores</p>
      <div className={styles.buttonWrapper}>
        <button className={styles.button} onClick={props.handleOnClick}>
          {props.buttonText}
        </button>
      </div>
    </div>
  )
}

export default Banner;