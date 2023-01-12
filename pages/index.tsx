import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Banner from '../components/banner'
import Card from '../components/card'
import { InferGetStaticPropsType } from 'next'
import coffeeStoresData from "../data/coffee-stores.json";
import { fetchCoffeeStores } from '../lib/coffee-stores'

// export interface IStoreProps {
//   fsq_id: string;
//   categories: Object[];
//   chains: any[];
//   distance: number;
//   geocodes: Object;
//   link: string;
//   location: Object;
//   name: string;
//   related_place: Object;
//   timezone: string;
//   imageUrl: string;
// }

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
  
  const handleOnBannerBtnClick = () => {
    console.log("hello");
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoissuer</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="allows you to discover coffee stores" />
      </Head>

      <main className={styles.main}>
        <Banner buttonText="View stores nearby" handleOnClick={handleOnBannerBtnClick} />
        <div className={styles.heroImage}>
          <Image src={"/static/hero-image.png"} priority={true} width={700} height={400} alt={''} />
        </div>
        {coffeeStores.length > 0 && (
          <>
            <h2 className={styles.heading2}>Toronto stores</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((store: any) => (
                <Card key={store.fsq_id} name={store.name} imageUrl={store.imageUrl} href={`/coffee-store/${store.fsq_id}`} className={styles.card} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}