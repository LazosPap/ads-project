const fs = require('fs');
const { promisify } = require('util');
const nodemailer = require('nodemailer');
const pipeline = promisify(require('stream').pipeline);
const EmailTemplates = require('./EmailTemplates');

async function sendEmail(recipientEmail, emailCase, newPassword) {
	const transporter = nodemailer.createTransport({
		host: 'smtp.mail.yahoo.com',
		port: 465,
		secure: true,
		auth: {
			user: 'adopse_ads',
			pass: 'tuaxepuepaixomdj',
		},
	});

	let subject;
	let html;

	switch (emailCase) {
		case 'reset':
			subject = 'Επαναφορά κωδικού πρόσβασης';
			html = EmailTemplates.resetPasswordBody(newPassword);
			break;
		case 'register':
			subject = 'Εγγραφή στην ηλεκτρονική σελίδα MotherTech';
			html = EmailTemplates.registerUserBody();
			break;
	}

	await transporter.sendMail({
		from: '"Adopse Ads 🔑" <adopse_ads@yahoo.com>',
		to: recipientEmail,
		subject: subject,
		html: EmailTemplates.emailTemplate(subject, html),
	});
}

async function uploadImage(file, userId) {
	try {
		fs.unlinkSync(`${__dirname}/../public/userImages/${userId}.jpg`);
		fs.unlinkSync(`${__dirname}/../public/userImages/${userId}.png`);
		fs.unlinkSync(`${__dirname}/../public/userImages/${userId}.jpeg`);
	} catch (e) {
		console.log(e);
	}

	const extension = file.detectedFileExtension;
	if (extension == '.png' || extension == '.jpg' || extension == '.jpeg') {
		await pipeline(
			file.stream,
			fs.createWriteStream(
				`${__dirname}/../public/userImages/${userId}${extension}`
			)
		);
	}
}


async function getImages(files) {
	const images = new Array();

	for (image of files) {
		const imageObject = {
			fileName: image.originalName,
			stream: image.stream,
		};
		images.push(imageObject);
	}

	return images;
}

async function saveImages(images, adId) {
	for (image of images) {
		mkdirp.sync(`${__dirname}/../public/adImages/${adId}/`);
		await pipeline(
			image.stream,
			fs.createWriteStream(
				`${__dirname}/../public/adImages/${adId}/${image.fileName}`
			)
		);
	}
}


module.exports = {
	uploadImage,
	sendEmail,
	getImages,
	saveImages
};
