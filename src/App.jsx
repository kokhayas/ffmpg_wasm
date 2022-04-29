import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
import './App.css';
import {createFFmpeg, fetchFile} from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({
	corePath: "/ffmpeg_core_dist/ffmpeg-core.js",
	log: true
});

function App() {
	const [ready, setReady] = useState(false);
	const [video, setVideo] = useState();
	const [gif, setGif] = useState();

	const convertToGIf = async () => {
		ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));
		await ffmpeg.run('-i', 'test.mp4', '-t', '2.5', '-ss', '2', '-f', 'gif', 'out.gif');
		const data = ffmpeg.FS('readFile', 'out.gif');
		const url = URL.createObjectURL(new Blob([data.buffer], {type: 'image/gif'}));
		setGif(url);
	}

	const load = async () => {
		await ffmpeg.load();
		setReady(true);
		console.log("hello");
	};

	useEffect(() => {
		load();
	}, [])

  return ready ? (
    <div className="App">
		{video && <video controls width="250"src={URL.createObjectURL(video)}></video>}
		<input type="file" onChange={(e) => setVideo(e.target.files?.item(0))}/>
		<h3>Result</h3>
		<button onClick={convertToGIf}>Convert</button>
		{ gif && <img src={gif} width="250"/>}
    </div>
  ) :
	(<p>Loading...</p>);
}

export default App;
