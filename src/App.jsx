import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import React, { useEffect, useState } from 'react';
// import logo from './logo.svg';
import './App.css';
const ffmpeg = createFFmpeg({
	corePath: "/ffmpeg_core_dist/ffmpeg-core.js",
	log: true
});

function App() {
	const [ready, setReady] = useState(false);
	const [video, setVideo] = useState();
	const [gif, setGif] = useState();
	const [width, setWidth] = useState(250);
	const [height, setHeight] = useState(200);
	const [startTime, setStartTime] = useState(2.0);
	const [endTime, setEndTime] = useState(2.5);

	const convertToGIf = async () => {
		ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));
		await ffmpeg.run('-i', 'test.mp4', '-t', `${endTime}`, '-vf', `scale=${width}:${height}`, '-ss', `${startTime}`, '-f', 'gif', 'out.gif');
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
		<br></br>
		<input type="file" onChange={(e) => setVideo(e.target.files?.item(0))}/>
<div>
		width: <input type="text" value={width} onChange={(e) => setWidth(e.target.value)} />px
		height: <input type="text" value={height} onChange={(e) => setHeight(e.target.value)}/>px <br></br>
		start time: <input type="text" value={startTime} onChange={(e) => setStartTime(e.target.value)} />s
		end time: <input type="text" value={endTime} onChange={(e) => setEndTime(e.target.value)} />s
</div>
		<h3>Result</h3>
		<button onClick={convertToGIf}>Convert</button>
		{ gif && <img src={gif} width={width}/>}
    </div>
  ) :
	(<p>Loading...</p>);
}

export default App;
