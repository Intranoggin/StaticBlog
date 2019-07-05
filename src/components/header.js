import React from 'react'
import TopNav from './topnav'
import styles from '../styles/header.module.scss'

export default()=>(
<header className={styles.header}>    
    <div className={styles.banner}>
        <div className={styles.sitetitle}><h1>Intranoggin</h1>
        <span className={styles.tagline}>Blither, Blather, Web Content Management.</span>
        </div>
    </div>	
    <TopNav/>
</header>
)