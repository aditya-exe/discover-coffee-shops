import { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { IStoreProps } from "..";
import coffeeStoreData from "../../data/coffee-stores.json";
import styles from "../../styles/coffee-store.module.css";
import cls from "classnames";

export const getStaticProps: GetStaticProps<{ coffeeStore: IStoreProps | undefined }> = (staticProps) => {
  const { params } = staticProps;
  return {
    props: {
      coffeeStore: coffeeStoreData.find(store => {
        return store.id.toString() === params?.id
      })
    }
  }
}

export const getStaticPaths = async () => {
  const paths = coffeeStoreData.map(store => {
    return {
      params: {
        id: store.id.toString()
      }
    }
  });

  return {
    paths,
    fallback: true
  }
}

const CoffeeStore = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const { coffeeStore } = props;

  if (router.isFallback) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  const handleUpvoteButton = () => {

  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>{coffeeStore?.name}</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              Back to home
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{coffeeStore?.name}</h1>
          </div>
          <Image src={coffeeStore?.imgUrl as string} width={600} height={360} alt={"Store-Image"} className={styles.storeImage} />
        </div>

        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/places.svg" width={24} height={24} alt="" />
            <p className={styles.text}>{coffeeStore?.address}</p>
          </div>

          <div className={styles.iconWrapper}>
            <Image src="/static/icons/nearMe.svg" width={24} height={24} alt="" />
            <p className={styles.text}>{coffeeStore?.neighbourhood}</p>
          </div>

          <div className={styles.iconWrapper}>
            <Image src="/static/icons/star.svg" width={24} height={24} alt="" />
            <p className={styles.text}>2</p>
          </div>

          <button className={styles.upvoteButton} onClick={() => handleUpvoteButton()}>
            Upvote!
          </button>
        </div>
      </div>
    </div>
  )
};

export default CoffeeStore;
