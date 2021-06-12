import style from '../../styles/Admin.module.css';
import Icon from '../../components/icon/icon';
import {useEffect, useRef, useState} from 'react';
import Head from '../../components/head/head';
import {getDownloadableUrl, listFiles} from '../../utils/firebase/firebase';
import {useAuth} from '../../utils/auth.context';

export async function getServerSideProps() {
	const fileNames = (await listFiles())[0];
	const files = fileNames.map(file => getDownloadableUrl(file.name))

	return { props: {  files: files.filter(file => !file.includes('%2F?')) } };
}

export default function Dashboard({files}) {
	const { user } = useAuth();
	const [fetching, setFetching] = useState(false);
	const [html, setHtml] = useState('');
	const [to, setTo] = useState('');
	const [subject, setSubject] = useState('');
	const [imageUploading, setImageUploading] = useState(false);
	const [htmlLoading, setHtmlLoading] = useState(false);
	const [inputVersion, setInputVersion] = useState(new Date());
	const [images, setImages] = useState(files ?? []);
	const [imgLocation, setImgLocation] = useState('');
	const [heights, setHeights] = useState({});
	const mailerRef = useRef(null);
	const filesRef = useRef(null);

	useEffect(() => {
		setTimeout(() => {
			setHeights({
				mail: Math.ceil((mailerRef?.current?.clientHeight ?? 1 ) / 40),
				files: Math.ceil((filesRef?.current?.clientHeight ?? 1 ) / 40)
			});
		}, 1000);
	}, [images, html]);



	const handleSendMail = async () => {
		if(!user.token) return alert('no user token found');
		setFetching(true);
		await sendMail(user.token, to, subject, html);
		setHtml('');
		setFetching(false);
	};

	const uploadImage = async ([file]) => {
		setImageUploading(true);
		const tmpFilename = encodeURIComponent(file.name);

		try{
			const response = await fetch(`/api/upload?file=${tmpFilename}&type=mails`, {
				headers: new Headers({token: user.token}),
				credentials: 'same-origin',
			});
			if (!response.ok) throw await response.json();

			const { url, fields } = await response.json();
			const formData = new FormData();

			Object.entries({ ...fields, file }).forEach(([key, value]) => {
				formData.append(key, value);
			});



			const upload = await fetch(url, {
				method: 'POST',
				body: formData,
			});



			if (upload.ok) {

			} else {
				alert('Upload failed.');
			}



		}catch(error){
			console.error(error);
		}

		const path = `mails/${user.id}/${tmpFilename}`;
		const image = `https://firebasestorage.googleapis.com/v0/b/confessions-61611.appspot.com/o/${path.split('/').join('%2F')}?alt=media`;
		setImages([...images, image]);

		setInputVersion(Date.now());
		setImageUploading(false);
	};

	const loadHtml = async ([file]) => {
		setHtmlLoading(true);
		const reader = new FileReader();
		reader.onload = () => {
			setHtml(reader.result);
			setInputVersion(Date.now());
			setHtmlLoading(false);
		}
		reader.readAsText(file);
	};

	const toClipBoard = (text) => {
		navigator.clipboard.writeText(text)
			.then(
				() => {},
				er => alert('Could not copy link.')
			);
	};

	if (!user.id){
		return <span>You need to log in to view this page</span>;
	}

	return (
		<>
			<Head title={'Admin dashboard'} />

			<section className={style.sectionContainer} ref={mailerRef} style={heights.mail ? {gridRowEnd: `span ${heights.mail}`} : {}}>
				<h1>Mailer</h1>
				<div className={style.section}>
					<label className={style.textLabel}>
						<span>To:</span>
						<input
							className={style.textInput}
							type="email"
							onChange={e => setTo(e.target.value)}
							value={to}
							placeholder={'test@example.com'}
						/>
					</label>
					<label className={style.textLabel}>
						<span>Subject:</span>
						<input
							className={style.textInput}
							type="text"
							onChange={e => setSubject(e.target.value)}
							value={subject}
							placeholder={'What are we talking about today?'}
						/>
					</label>
					<div className={style.htmlInputContainer}>
						<textarea
							className={style.htmlInput}
							onChange={e => setHtml(e.target.value)}
							placeholder={'drop html file or type here'}
							value={html}
						/>
						{!html && (
							<input
								type={'file'}
								className={style.htmlLoad}
								disabled={htmlLoading}
								id={'upload-html'}
								onChange={(e) => loadHtml(e.target.files)}
								key={inputVersion}
								accept=".html, .htm, .txt"
							/>
						)}
					</div>

					{html && (
						<>
							<h2>Preview:</h2>
							<div className={style.previewContainer}>
								<iframe srcDoc={html} className={style.preview} />
							</div>
						</>
					)}


					<div className={style.actions}>
						<button disabled={fetching || html === '' || to === '' || subject === ''} className={style.green} onClick={() => handleSendMail()}><Icon.Accept /></button>
					</div>
				</div>
			</section>

			<section className={style.sectionContainer} ref={filesRef} style={heights.files ? {gridRowEnd: `span ${heights.files}`} : {}}>
				<h1>Files</h1>
				<div className={style.section}>
					<ul className={style.imageList}>
						{images.map((image, key) => (
							<li key={key}>
								<img src={image}  alt={''}/>
								<div className={style.actionAlt} onClick={() => toClipBoard(image)}>copy link</div>
								<a href={image} className={style.download} target={'_blank'}>download</a>

								{/*https://firebase.google.com/docs/storage/web/delete-files*/}
								<div className={style.red} onClick={() => alert('delete has not been implemented yet')}><Icon.Reject /></div>
							</li>
						))}
					</ul>
					<label className={style.textLabel}>
						<span>
							location:
						</span>
						<input
							className={style.textInput}
							type="text"
							onChange={e => setImgLocation(e.target.value)}
							value={imgLocation}
							placeholder={'mails'}
						/>
					</label>
					<div className={style.green}>
						<input
							type={'file'}
							className={style.imageUpload}
							disabled={imageUploading}
							id={'upload-image'}
							onChange={(e) => uploadImage(e.target.files)}
							key={inputVersion}
							accept="image/png, image/jpeg"
						/>
						<Icon.SetImage />
					</div>
				</div>
			</section>
		</>
	);
}


const sendMail = async (token, to, subject, html) => {
	await fetch(`/api/admin/mail`, {
		method: 'POST',
		headers: new Headers({'Content-Type': 'application/json', token}),
		body: JSON.stringify({to, subject, text: html}),
		credentials: 'same-origin',
	});
}
