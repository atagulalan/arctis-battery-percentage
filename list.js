#!/usr/bin/env node

const path = require('path')
var HID = require('node-hid')
HID.setDriverType('libusb')

var devices = HID.devices()

// Caution: This sends data to EVERY HID device connected.
// If you know the vendorId and productId of your device,
// please uncomment filter section.

devices
	//.filter(d => d.vendorId === VENDORID && d.productId === PRODUCTID && d.usage !== 1)
	.forEach((deviceInfo) => {
		try {
			var device = new HID.HID(deviceInfo.path)
			device.write([0x06, 0x18])
			var report = device.readSync()
			console.log(deviceInfo, report)
			device.close()
		} catch (error) {
			//console.log('Not a steelseries wireless device.')
		}
	})