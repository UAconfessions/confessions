import Head from "../components/head/head";
import MicRecorder from 'mic-recorder-to-mp3';
import { useState, useEffect } from 'react';
import styles from '../styles/Voicemail.module.css';
import Icon from "../components/icon/icon";


export default function Voicemail() {
	const [recorder, setRecorder] = useState();
	const [isBlocked, setBlocked] = useState(false);
	const [isRecording, setRecording] = useState(false);
	const [blobURL, setBlobURL] = useState('');
	const [file, setFile] = useState();
	const [uploading, setUploading] = useState(false);

	const getPermission = () => {
		const streamHandler = () => {
			console.log('Permission Granted');
			setBlocked(false);
		};

		const errorHandler = (e) => {
			console.log('Permission Denied', e);
			setBlocked(true);
		};

		navigator.getUserMedia = (
			navigator.getUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia ||
			navigator.msGetUserMedia
		);

		if (typeof navigator.mediaDevices.getUserMedia === 'undefined') {
			navigator.getUserMedia({
				audio: true
			}, streamHandler, errorHandler);
		} else {
			navigator.mediaDevices.getUserMedia({
				audio: true
			}).then(streamHandler).catch(errorHandler);
		}
	};


	const uploadFile = async (file) => {
		setUploading(true);
		try{
			const tmpFilename = encodeURIComponent(file.name);
			const response = await fetch(`/api/upload?file=${tmpFilename}&type=voicemail`);
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
				alert('Upload success.');
				setBlobURL();
			} else {
				alert('Upload failed. You can try uploading again or sending the voicemail in messenger.');
			}
		}catch(error){
			console.error(error);
		}

		setUploading(false);
	};


	useEffect(() => {
		getPermission();
		if (!recorder) setRecorder(new MicRecorder({ bitRate: 128 }));
	}, [recorder, isBlocked]);

	useEffect(() => {
		console.log(file);
	}, [file]);


	const start = () => {
		if (isBlocked) {
			console.log('Permission Denied');
		} else {
			recorder
				.start()
				.then(() => {
					setRecording(true);
				}).catch((e) => console.error(e));
		}
	};

	const stage = (!isRecording && !blobURL) ? 'record' : (isRecording ? 'recording' : (uploading ? 'uploading' : 'recorded' ) );
	const buttonAction = () => {
		if (!isRecording && !blobURL) {
			start();
		}
		if (isRecording) {
			stop();
		}
		if (blobURL) {
			uploadFile(file);
		}
	};

	console.log(stage);
	const stop = () => {
		recorder
			.stop()
			.getMp3()
			.then(([buffer, blob]) => {
				setFile(new File(buffer, `voicemail${new Date().getTime()}.mp3`, {
					type: blob.type,
					lastModified: Date.now()
				}));
				setBlobURL(URL.createObjectURL(blob));
				setRecording(false);
			}).catch((e) => console.log(e));
	};
	return (
		<>
			<Head title={'Confess voicemail'} />
			<h1>The truth will set you free</h1>
			<span>
				This saturday [Admin] will be making radio. Leave him a voicemail confession and he'll play it on Radio NRJ.
			</span>
			{isBlocked && (
				<>
					<span>Before recording a voicemail you need to provide access to your microphone. Refresh this page or check your browser settings to give access.</span>
					{/*<button onClick={getPermission}>Get permission</button>*/}
				</>
			)}
			{!isBlocked && (
				<>
					<button
						className={styles.cancel}
						onClick={() => setBlobURL()}
						disabled={uploading || !blobURL || isRecording}
					>
						<div>
							<Icon.Reject/>
						</div>
					</button>
					<button
						className={styles.cta}
						onClick={buttonAction}
						data-stage={stage}
						disabled={uploading}
					>
						<div>
							<Icon.Start/>
							<Icon.Stop loading={isRecording}/>
							<Icon.Send />
							<Icon.Blocked loading={uploading}/>
						</div>
					</button>
					<audio src={blobURL} controls="controls"  className={styles.audio} />
				</>
			)}
		</>
	);
}
