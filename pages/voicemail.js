import Head from "../components/head/head";
import MicRecorder from 'mic-recorder-to-mp3';
import { useState, useEffect } from 'react';


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

		const errorHandler = () => {
			console.log('Permission Denied');
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
			{isBlocked && (
				<>
					<span>Before recording a voicemail you need to provide access to your microphone.</span>
					<button onClick={getPermission}>Get permission</button>
				</>
			)}
			{!isBlocked && !uploading && (
				<>
					{!isRecording && !blobURL && (
						<button onClick={start} disabled={isRecording}>
							Record
						</button>
					)}
					{isRecording && (
						<button onClick={stop} disabled={!isRecording}>
							Stop
						</button>
					)}
					{blobURL && (
						<>
							<button onClick={() => setBlobURL()} disabled={isRecording}>
								Reset
							</button>
							<button onClick={() => uploadFile(file)}>
								Upload
							</button>
							<audio src={blobURL} controls="controls" />
						</>
					)}
				</>
			)}
			{uploading && (
				<span>uploading...</span>
			)}
		</>
	);
}
