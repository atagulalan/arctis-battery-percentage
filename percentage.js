#!/usr/bin/env node

var HID = require('node-hid')
HID.setDriverType('libusb')

var devices = HID.devices()

const series = [
	[4152, 0x12ad], // Arctis 7 2019
	[4152, 0x1260], // Arctis 7 2017
	[4152, 0x1252] // Arctis Pro
]

function getPercentage(callback) {
	devices
		.filter((d) => {
			return series.some((s) => {
				return d.vendorId === s[0] && d.productId === s[1] && d.usage !== 1
			})
		})
		.forEach((deviceInfo) => {
			var device = new HID.HID(deviceInfo.path)

			if (!device) {
				console.log('Could not find device :(')
				process.exit(1)
			}

			try {
				device.write([0x06, 0x18])
				var report = device.readSync()
				callback(deviceInfo, report[2])
			} catch (error) {
				console.log('Error: Cannot write to Arctis Wireless device. Please replug the device.')
			}

			device.close()
		})
}

getPercentage((device, percentage) => {
	percentage = percentage > 100 ? 100 : percentage < 0 ? 0 : percentage

	console.log('Initializing...')

	console.log(percentage === 0
		? `Please connect your SteelSeries Wireless Device first.`
		: `${percentage}% battery left on your ${device.product}`)
})
