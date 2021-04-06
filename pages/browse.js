import {getDownloadableUrl, listFiles} from "../utils/firebase/firebase";
import Head from "../components/head/head";
import styles from '../styles/Browse.module.css'

export async function getServerSideProps() {
	const fileNames = (await listFiles())[0];
	const files = await Promise.all(fileNames.map(file => getDownloadableUrl(file.name)))

	return { props: {  files } };
}

export default function Pending({files}) {


	return (
		<div>
			<Head title={'Browse files'} />
			<section className={styles.list}>
				{files.map(file => {
					if(file.includes('%2F?')) return null;
					if(file.includes('.mp3')){
						return (
							<>
								<audio controls preload="auto">
									<source src={file} type="audio/mpeg" />
									Your browser does not support inline audio
								</audio>
								<a href={file} className={styles.download} target={'_blank'}>download</a>
							</>
						);
					}
					return (
						<>
							<img src={file}  alt={''} className={styles.image} />
							<a href={file} className={styles.download} target={'_blank'}>download</a>
						</>
					)
				})}
			</section>

		</div>
	);
}
