import React from 'react'
import styles from '../styles/layout.module.scss'
import Header from './header.js'
import Footer from './footer.js'
export default({children})=>(
    <div>
        <Header/>
        <div section="main" className={styles.main}>
            <div className={styles.leftChannel}>left</div>
            <div className={styles.content}>{children}</div>    
        </div>
        <Footer/>
    </div>
)