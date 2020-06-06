#!/usr/bin/env node
var getPercentage = require('./getPercentage');

getPercentage((device, percentage) => {
	percentage = percentage > 100 ? 100 : percentage < 0 ? 0 : percentage

	console.log('Initializing...')
	console.log("Your %s device's battery percentage is %s", device.product, percentage)

	notify({
		title:
			percentage === 0
				? `Please connect your SteelSeries Wireless Device first.`
				: `${percentage}% battery left on your ${device.product}`,
		message: ' ',
		icon: path.join(__dirname, `./images/${percentage}.png`),
		appID: 'SteelSeries Arctis Battery Percentage'
	})
})
