import { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { CoffeeStoreType, StoreContext } from "../../context/context";
import styles from "../../styles/coffee-store.module.css";
import cls from "classnames";
import { fetchCoffeeStores } from "../../lib/coffee-stores";
import { useContext, useEffect, useState } from "react";
import { isEmpty } from "../../utils";
import useSWR from "swr";

const CoffeeStore = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  // if (router.isFallback) {
  //   return (
  //     <div>
  //       Loading...
  //     </div>
  //   )
  // }
  const fsq_id = router.query.id;
  const [coffeeStore, setCoffeeStore] = useState(props.coffeeStore);
  const { state: { coffeeStores } } = useContext(StoreContext);
  const [voteCount, setVoteCount] = useState(0);

  const handleCreateCoffeeStore = async (coffeeStore: any) => {
    try {
      const {
        fsq_id, name, votes, imageUrl, neighborhood, address
      } = coffeeStore;
      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fsq_id, name, votes: votes ?? 0, imageUrl, neighborhood: neighborhood ?? "", address,
        })
      });
      const dbCoffeeStore = await response.json();
      // console.log(dbCoffeeStore); 
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (isEmpty(props.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const coffeeStoreFromContext = coffeeStores.find((store) => {
          return store.fsq_id === fsq_id;
        });
        if (coffeeStoreFromContext) {
          setCoffeeStore(coffeeStoreFromContext);
          handleCreateCoffeeStore(coffeeStoreFromContext);
        }
      }
    } else {
      handleCreateCoffeeStore(props.coffeeStore);
    }
  }, [fsq_id, props, props.coffeeStore]);

  const { data, error } = useSWR(`/api/getCoffeeStoreById?fsq_id=${fsq_id}`);

  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStore(data[0]);
      setVoteCount(data[0].votes);
    }
  }, [data])

  const handleUpvoteButton = async () => {
    try {
      const response = await fetch("/api/favCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fsq_id,
        })
      });
      const dbCoffeeStore = await response.json();
      if (dbCoffeeStore && dbCoffeeStore.length > 0) {
        setVoteCount(voteCount + 1);
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (error) {
    return (
      <div>
        Something went wrong :(
      </div>
    )
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
          <Image src={coffeeStore?.imageUrl as string} width={600} height={360} alt={"Store-Image"} className={styles.storeImage} />
        </div>

        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/places.svg" width={24} height={24} alt="" />
            <p className={styles.text}>{coffeeStore?.address}</p>
          </div>

          <div className={styles.iconWrapper}>
            <Image src="/static/icons/nearMe.svg" width={24} height={24} alt="" />
            <p className={styles.text}>{coffeeStore?.neighborhood}</p>
          </div>

          <div className={styles.iconWrapper}>
            <Image src="/static/icons/star.svg" width={24} height={24} alt="" />
            <p className={styles.text}>{voteCount}</p>
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

export const getStaticProps: GetStaticProps = async (staticProps) => {
  const { params } = staticProps;
  const coffeeStores: CoffeeStoreType[] = await fetchCoffeeStores();
  const findCoffeeStoreById = coffeeStores.find((store: CoffeeStoreType) => {
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
  const paths = coffeeStores.map((store: CoffeeStoreType) => {
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