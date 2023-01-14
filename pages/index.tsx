import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Banner from '../components/banner'
import Card from '../components/card'
import { InferGetStaticPropsType } from 'next'
// import coffeeStoresData from "../data/coffee-stores.json";
import { fetchCoffeeStores, fetchStoreImages } from '../lib/coffee-stores'
import useTrackLocation from '../hooks/use-track-location'

export type StoreType = {
  fsq_id: string;
  name: string;
  imageUrl: string;
  address: string;
  neighborhood: string;
}

export const getStaticProps = async () => {
  const coffeeStores = await fetchCoffeeStores();
  // console.log(coffeeStores);
  return {
    props: {
      coffeeStores
    }
  }
};

export default function Home(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const coffeeStores = props.coffeeStores;
  const { latLong, handleTrackLocation, locationErrorMessage, isFindingLocation } = useTrackLocation();
  const [fetchedCoffeeStores, setCoffeeStores] = useState([]);
  const [error, setError] = useState("");

  const handleOnBannerBtnClick = () => {
    handleTrackLocation();
    console.log(latLong);
  };

  useEffect(() => {
    async function fetchData() {
      if (latLong) {
        try {
          const fetchedCoffeeStores = await fetchCoffeeStores();
          console.log(fetchedCoffeeStores);
          setCoffeeStores(fetchedCoffeeStores);
        } catch (err) {
          console.error(err);
          setError((err as Error).message);
        }
      }
    }
    fetchData();
  }, [latLong])

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoissuer</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="allows you to discover coffee stores" />
      </Head>

      <main className={styles.main}>
        <Banner buttonText={`${isFindingLocation ? "Finding..." : "View stores nearby"}`} handleOnClick={handleOnBannerBtnClick} />

        {locationErrorMessage && (
          <p>Something went wrong: {locationErrorMessage}</p>
        )}

        {error && (
          <p>Something went wrong: {error}</p>
        )}

        <div className={styles.heroImage}>
          <Image src={"/static/hero-image.png"} priority={true} width={700} height={400} alt={''} />
        </div>

        {fetchedCoffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores near me</h2>
            <div className={styles.cardLayout}>
              {fetchedCoffeeStores.map((store: any) => (
                <Card key={store.fsq_id} name={store.name} imageUrl={store.imageUrl} href={`/coffee-store/${store.fsq_id}`} className={styles.card} />
              ))}
            </div>
          </div>
        )}

        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Toronto stores</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((store: any) => (
                <Card key={store.fsq_id} name={store.name} imageUrl={store.imageUrl} href={`/coffee-store/${store.fsq_id}`} className={styles.card} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}