const fs = require('fs');
const ytdl = require('ytdl-core');
const { getVideoQuality, getAudioQuality, outputProgress, slugify } = require('./util');
const prompt = require('prompt-sync')();
const ffmpeg = require('fluent-ffmpeg');

// Example video
// Video Size (1080p) - 116MB
// Audio Size - 3.51MB
const exampleVideoUrl = 'https://www.youtube.com/watch?v=fe7xdR5hOoc';
const exampleVideoID = 'fe7xdR5hOoc';

let fullDownloadPath = '';

// hardcode if you want (without file name)
// const downloadPath = '<your-path>';
const downloadPath = prompt('Enter download of video path: ');

const videoPath = `${downloadPath}\\video.mp4`;
const audioPath = `${downloadPath}\\audio.mp4`;

ytdl.getInfo(exampleVideoID, (err, info) => {
  if (err) throw err;

  const searchVideoQuality = getVideoQuality(info.formats);
  const searchAudioQuality = getAudioQuality(info.formats);

  console.log('Video Quality Query: ', searchVideoQuality);
  console.log('Audio Quality Query: ', searchAudioQuality);

  console.log('--------------------------------------------------------------------------------');

  // download video
  let writeStream = null;

  ytdl(exampleVideoUrl, { quality: searchVideoQuality.itag })
  .on('info', (videoInfo) => {
    const videoTitle = videoInfo.player_response.videoDetails.title;
    const titleSlugified = `${slugify(videoTitle)}.mp4`;

    fullDownloadPath = `${downloadPath}\\${slugify(videoTitle)}.mp4`;

    const infoFileName = `${titleSlugified}-download-info.txt`;
    const infoFileContent = `Video Quality: ${searchVideoQuality.quality}\nVideo itag: ${searchVideoQuality.itag}\nAudio Quality: ${searchAudioQuality.quality}\nAudio itag: ${searchAudioQuality.itag}`;

    fs.writeFile(infoFileName, infoFileContent, () => { 
      console.log('Info file written: ', infoFileName); 
    });

    writeStream = fs.createWriteStream(videoPath);
  })
  .on('data', (chunk) => writeStream.write(chunk))
  .on('progress', (_chunk, downloaded, toDownload) => outputProgress('video', downloaded, toDownload))
  .on('end', () => {
    writeStream.end();

    console.log('--------------------------------------------------------------------------------');

    // download audio
    writeStream = fs.createWriteStream(audioPath);

    ytdl(exampleVideoUrl, { quality: searchAudioQuality.itag })
    .on('data', (chunk) => writeStream.write(chunk))
    .on('progress', (_chunk, downloaded, toDownload) => outputProgress('audio', downloaded, toDownload))
    .on('end', () => {
      writeStream.end();

      // merge video and audio
      ffmpeg()
        .input(videoPath)
        .videoCodec('copy')
        .input(audioPath)
        .audioCodec('copy')
        .save(fullDownloadPath)
        .on('error', console.error)
        .on('end', () => {
          fs.unlinkSync(videoPath);
          fs.unlinkSync(audioPath);
          console.log('--------------------------------------------------------------------------------');
          console.log(`Video and Audio Merged. Ready for playing at: ${fullDownloadPath}.`);
        });
    });
  });
});