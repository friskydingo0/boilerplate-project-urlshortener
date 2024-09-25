import('dotenv').then((mod) => { mod.config() });
import { lookup } from 'dns';
import { customAlphabet } from 'nanoid';

const urlDB = new Map();

// TODO: convert this to a non-blocking function when it connects to the database
export function getShortUrl(longUrl) {
	let shortID;
	urlDB.forEach((value, key, map) => {
		if (value === longUrl) {
			shortID = key;
			return;
		}
	});

	if (shortID) {
		return shortID;
	}
	else {
		const codeGen = customAlphabet('1234567890abcdef', 10);
		shortID = codeGen();
		urlDB.set(shortID, longUrl);
		return shortID;
	}
}

export function getFullUrl(shortID, done) {
	const fullUrl = urlDB.get(shortID);
	if (fullUrl) {
		done(null, fullUrl);
	}
	else {
		done({ 'error': 'invalid code' });
	}
}

export default function isValidURL(longUrl, done) {
	const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

	if (regex.test(longUrl)) {
		const urlVar = new URL(longUrl);
		lookup(urlVar.hostname, (err, address, family) => {
			if (err) {
				done({ 'error': 'invalid url' });
			}
			else {
				const shortID = getShortUrl(longUrl);
				done(null, { 'original_url': longUrl, 'short_url': shortID });
			}
		});
	}
	else {
		done({ 'error': 'invalid url' });
	}
}
