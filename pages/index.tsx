import React, { useContext, useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Banner from '../components/banner'
import Card from '../components/card'
import { InferGetStaticPropsType, NextPage } from 'next'
import { fetchCoffeeStores } from '../lib/coffee-stores'
import useTrackLocation from '../hooks/use-track-location'
import { ACTION_TYPES, CoffeeStoreType, StoreContext } from '../context/context'

export async function getStaticProps() {
  const coffeeStores = await fetchCoffeeStores()
  return {
    props: {
      coffeeStores
    }
  }
}

const Home = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { handleTrackLocation, locationErrorMessage, isFindingLocation } = useTrackLocation();
  const [error, setError] = useState("");
  const { dispatch, state } = useContext(StoreContext);
  const { coffeeStores, latLong } = state;

  const handleOnBannerBtnClick = () => {
    handleTrackLocation();
  };

  useEffect(() => {
    (async function fetchData() {
      if (latLong) {
        try {
          const fetchedResponse = await fetch(`/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=30`);
          const fetchedCoffeeStores = await fetchedResponse.json();
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: {
              coffeeStores: fetchedCoffeeStores.response,
            }
          })
        } catch (err) {
          console.error(err);
          setError((err as Error).message);
        }
      }
    })();
  }, [latLong])
  // console.log(coffeeStores);
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

        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores near me</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((store: any) => (
                <Card key={store.fsq_id} name={store.name} imageUrl={store.imageUrl} href={`/coffee-store/${store.fsq_id}`} className={styles.card} />
              ))}
            </div>
          </div>
        )}

        {props.coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Toronto stores</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map((store: CoffeeStoreType) => (
                <Card key={store.fsq_id} name={store.name} imageUrl={store.imageUrl} href={`/coffee-store/${store.fsq_id}`} className={styles.card} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Home;