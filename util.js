function getVideoQuality(formats) {
  const quality1080p = formats.find(format => format.container === 'mp4' && format.qualityLabel === '1080p' && !format.audioQuality);
  if(quality1080p) {
    return {
      quality: '1080p',
      itag: quality1080p.itag
    };
  }

  const quality720p = formats.find(format => format.container === 'mp4' && format.qualityLabel === '720p' && !format.audioQuality);
  if(quality720p) {
    return {
      quality: '720p',
      itag: quality720p.itag
    };
  }

  const quality480p = formats.find(format => format.container === 'mp4' && format.qualityLabel === '480p' && !format.audioQuality);
  if(quality480p) {
    return {
      quality: '480p',
      itag: quality480p.itag
    };
  }

  const quality360p = formats.find(format => format.container === 'mp4' && format.qualityLabel === '360p' && !format.audioQuality);
  if(quality360p) {
    return {
      quality: '360p',
      itag: quality360p.itag
    };
  }

  const quality240p = formats.find(format => format.container === 'mp4' && format.qualityLabel === '240p' && !format.audioQuality);
  if(quality240p) {
    return {
      quality: '240p',
      itag: quality240p.itag
    };
  }

  const quality144p = formats.find(format => format.container === 'mp4' && format.qualityLabel === '144p' && !format.audioQuality);

  return {
    quality: '144p',
    itag: quality144p.itag
  };
}

function getAudioQuality(formats) {
  const mediumQuality = formats.find(format => format.container === 'mp4' && format.audioQuality === 'AUDIO_QUALITY_MEDIUM' && !format.qualityLabel);
  if(mediumQuality) {
    return {
      quality: 'AUDIO_QUALITY_MEDIUM',
      itag: mediumQuality.itag
    };
  }

  const lowQuality = formats.find(format => format.container === 'mp4' && format.audioQuality === 'AUDIO_QUALITY_LOW' && !format.audioQuality);
  return {
    quality: 'AUDIO_QUALITY_LOW',
    itag: lowQuality.itag
  };
}

function outputProgress(mediaType, downloaded, toDownload) {
  const percent = (downloaded/toDownload) * 100;

  console.log(`${mediaType} download progress: ${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(toDownload / 1024 / 1024).toFixed(2)}MB: ${percent.toFixed(2)}%`);
}

function slugify(input) {
  return input.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

module.exports = {
  getVideoQuality,
  getAudioQuality,
  outputProgress,
  slugify
};