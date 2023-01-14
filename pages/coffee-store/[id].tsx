import { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { StoreType } from "..";
import styles from "../../styles/coffee-store.module.css";
import cls from "classnames";
import { fetchCoffeeStores } from "../../lib/coffee-stores";

export const getStaticProps: GetStaticProps<{ coffeeStore: StoreType }> = async (staticProps) => {
  const { params } = staticProps;
  const coffeeStores = await fetchCoffeeStores();
  const findCoffeeStoreById = coffeeStores.find((store: any) => {
    return store.fsq_id === params?.id
  });

  return {
    props: {
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    }
  }
}

export const getStaticPaths = async () => {
  const coffeeStores = await fetchCoffeeStores();
  const paths = coffeeStores.map((store: any) => {
    return {
      params: {
        id: store.fsq_id
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
          <Image src={coffeeStore.imageUrl} width={600} height={360} alt={"Store-Image"} className={styles.storeImage} />
        </div>

        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/places.svg" width={24} height={24} alt="" />
            <p className={styles.text}>{coffeeStore?.address}</p>
          </div>

          <div className={styles.iconWrapper}>
            <Image src="/static/icons/nearMe.svg" width={24} height={24} alt="" />
            <p className={styles.text}>{coffeeStore.neighborhood}</p>
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
