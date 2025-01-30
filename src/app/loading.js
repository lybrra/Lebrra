import styles from './page.module.css'
export default function Loading() {
    // Define the Loading UI here
    return <div className={styles.loading}>
     <img src='https://media4.giphy.com/media/emySgWo0iBKWqni1wR/giphy.gif?cid=6c09b952z6i5wl30owr9ggftkjkv5ktbn8whbhfozjki1nyu&ep=v1_gifs_search&rid=giphy.gif&ct=g' alt='loading'/>
    </div>
  }