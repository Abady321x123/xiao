const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const snekfetch = require('snekfetch');
const path = require('path');

module.exports = class ChristmasHatCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'christmas-hat',
			group: 'avatar-edit',
			memberName: 'christmas-hat',
			description: 'Draws a Christmas hat over a user\'s avatar.',
			throttling: {
				usages: 1,
				duration: 15
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'user',
					prompt: 'Which user would you like to edit the avatar of?',
					type: 'user',
					default: ''
				}
			]
		});
	}

	async run(msg, { user }) {
		if (!user) user = msg.author;
		const avatarURL = user.displayAvatarURL({
			format: 'png',
			size: 256
		});
		try {
			const canvas = createCanvas(256, 256);
			const ctx = canvas.getContext('2d');
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'christmas-hat.png'));
			const { body } = await snekfetch.get(avatarURL);
			const avatar = await loadImage(body);
			ctx.drawImage(avatar, 0, 0, 256, 256);
			ctx.drawImage(base, 15, 175, 65, -26);
			return msg.say({ files: [canvas.toBuffer()] });
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};