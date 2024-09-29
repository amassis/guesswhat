const fs = require('fs');
const imageDownloader = require('image-downloader');
const Unsplash = require('unsplash-js');
const sharp = require('sharp'); // image processing
const Type = require('../models/TypeModel');
const Element = require('../models/ElementModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { DEBUG, debug, fctName } = require('../utils/debug');

exports.getAllTypes = factory.getAll(Type);
exports.getType = factory.getOne(Type);
exports.createType = factory.createOne(Type);
exports.updateType = factory.updateOne(Type);
exports.deleteType = factory.deleteOne(Type);

exports.resizeTypePhoto = catchAsync(async (req, res, next) => {
	// if (!req.file) return next();

	// We need req.file.filename in the updateUser middleware, so we set it here.
	// It would have been set by multer - if we had saved to disk
	// Since we saved to memory, we add it manually here
	// req.file.filename = `user-${req.user.id}.jpeg`;

	const fromFile = `${req.filepath}/${req.filename}`;
	const toFile = `${req.filepath}/cropped-${req.filename}`;
	await sharp(fromFile).resize(500, 500).toFormat('jpeg').jpeg({ quality: 90 }).toFile(toFile);

	fs.rm(fromFile, { force: true }, (err) => {
		if (err) return next(new AppError('Error resizing Type image file: unable to remove original image file.', 500));
		req.body.image = `cropped-${req.filename}`;
		return next();
	});
});

exports.getTypeImage = catchAsync(async (req, res, next) => {
	let debugStep = 0;
	const debugLevel = 1;
	const debugMe = 'getTypeImage';

	if (DEBUG) debug(debugLevel, req.body, 'Here is req.body', debugMe, ++debugStep);

	const unsplash = Unsplash.createApi({
		accessKey: `${process.env.UNSPLASH_API_KEY}`,
	});

	const query = `${req.body.type.plural} ${req.body.type.singular} ${req.body.example}`;
	if (DEBUG) debug(1, { query }, 'Query', 'getTypeImage');

	const options = {
		query,
		count: 10,
		color: req.body.color.bg1,
		orientation: 'landscape',
	};

	if (DEBUG) debug(1, options, 'Unsplash Options', 'getTypeImage');

	const unsplashPhotos = await unsplash.photos.getRandom(options);

	if (DEBUG) debug(debugLevel, unsplashPhotos, 'Return from Unsplash', debugMe, ++debugStep);
	if (unsplashPhotos.type !== 'success') return next(new AppError('Unsplash Query Error', 400));

	const {
		id,
		slug,
		width,
		height,
		urls: { regular, small, thumb, small_s3 },
		links: { html, download, download_location },
		user: { name, portfolio_url },
	} = unsplashPhotos.response[Math.trunc(Math.random() * 10)];

	if (DEBUG)
		debug(
			debugLevel,
			{
				id,
				slug,
				width,
				height,
				regular,
				download_location,
				download,
				html,
				name,
			},
			'Photos: ',
			debugMe,
			++debugStep,
		);

	const filename = `${slug}.jpg`;
	const filepath = `${__dirname}/../public/img/types`;

	const resizeOptions = '&w=800&fit=clip';
	const downloadLocation = `${download_location}&client_id=${process.env.UNSPLASH_API_KEY}${resizeOptions}`;

	if (DEBUG) debug(debugLevel, downloadLocation, 'Download URL', debugMe, ++debugStep);

	const imageDownload = await unsplash.photos.trackDownload({
		downloadLocation,
	});

	const url = imageDownload.response.url;
	//await downloadImage(url, filepath);
	await imageDownloader.image({
		url,
		dest: `${filepath}/${filename}`,
	});

	req.filename = filename;
	req.filepath = filepath;
	req.body.image = filename;
	next();
});

exports.getTypeColor = catchAsync(async (req, res, next) => {
	const colors = [
		{ bg1: 'darkred', bg2: 'red', font: 'white' },
		{ bg1: 'darkorange', bg2: 'orange', font: 'white' },
		{ bg1: 'rgb(255,179,0)', bg2: 'rgb(191,154,64)', font: 'black' },
		{ bg1: 'yellow', bg2: 'yellowgreen', font: 'black' },
		{ bg1: 'darkgreen', bg2: 'green', font: 'white' },
		{ bg1: 'rgb(102,153,126)', bg2: 'rgb(13,242,121)', font: 'white' },
		{ bg1: 'darkcyan', bg2: 'cyan', font: 'black' },
		{ bg1: 'rgb(89,166,152)', bg2: 'rgb(0,255,208)', font: 'black' },
		{ bg1: 'rgb(64,169,191)', bg2: 'rgb(13,202,242)', font: 'white' },
		{ bg1: 'rgb(89,125,166)', bg2: 'rgb(13,121,242)', font: 'white' },
		{ bg1: 'darkblue', bg2: 'blue', font: 'white' },
		{ bg1: 'purple', bg2: 'violet', font: 'white' },
		{ bg1: 'rgb(87,51,204)', bg2: 'rgb(114,102,153)', font: 'white' },
		{ bg1: 'purple', bg2: 'violet', font: 'white' },
		{ bg1: 'rgb(238,0,255)', bg2: 'rgb(255,0,178)', font: 'white' },
	];

	req.body.color = colors[Math.trunc(Math.random() * colors.length)];
	next();
});
