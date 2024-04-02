const IMAGE_TYPES = ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif']
const VIDEO_TYPES = ['mp4', 'video/ogg', 'webm', 'quicktime']
const AUDIO_TYPES = ['mp3', 'audio/ogg', 'wav', 'mpeg']

function checkMediaType(types, file) {
	if (!file || !file.type) return
	return types.some(t => file.type.toLowerCase().includes(t))
}

export function isImageFile(file) {
	return checkMediaType(IMAGE_TYPES, file)
}

export function isVideoFile(file) {
	return checkMediaType(VIDEO_TYPES, file)
}

export function isImageVideoFile(file) {
	return checkMediaType(IMAGE_TYPES, file) || checkMediaType(VIDEO_TYPES, file)
}

export function isAudioFile(file) {
	return checkMediaType(AUDIO_TYPES, file)
}