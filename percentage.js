#!/usr/bin/env node

const path = require('path')
var HID = require('node-hid')
HID.setDriverType('libusb')

var devices = HID.devices()

const series = [
  {
    name: 'Arctis 7 2019',
    vendorId: 4152,
    productId: 0x12ad,
    reportIdx: 2,
    writeBytes: [0x06, 0x18],
  },
  {
    name: 'Arctis 7 2017',
    vendorId: 4152,
    productId: 0x1260,
    reportIdx: 2,
    writeBytes: [0x06, 0x18],
  },
  {
    name: 'Arctis Pro',
    vendorId: 4152,
    productId: 0x1252,
    reportIdx: 2,
    writeBytes: [0x06, 0x18],
  },
  {
    name: 'Actris 1 Wireless',
    vendorId: 4152,
    productId: 0x12b3,
    reportIdx: 2,
    writeBytes: [0x06, 0x18],
  },
  {
    name: 'Arctis 9',
    vendorId: 4152,
    productId: 0x12c2,
    reportIdx: 3,
    writeBytes: [0x06, 0x12],
  },
]

function notify(options) {
  const { execFile } = require('child_process')
  execFile(
    path.join(__dirname, `./bin/SnoreToast.exe`),
    [
      '-t',
      options.title,
      '-m',
      options.message,
      '-w',
      '-silent',
      '-p',
      options.icon,
      '-appID',
      options.appID,
    ],
    function (err, data) {
      process.exit(1)
    }
  )
}

function getPercentage(callback) {
  devices
    .map((d) => {
      let tempDev = series.find((s) => {
        return (
          d.vendorId === s.vendorId &&
          d.productId === s.productId &&
          d.usage !== 1
        )
      })
      return tempDev ? { ...d, additional: tempDev } : false
    })
    .filter((el) => !!el)
    .forEach((deviceInfo) => {
      var device = new HID.HID(deviceInfo.path)
      var { writeBytes, reportIdx } = deviceInfo.additional
      if (!device) {
        console.log('Could not find device :(')
        process.exit(1)
      }

      try {
        device.write(writeBytes)
        var report = device.readSync()
        callback(deviceInfo, report[reportIdx])
      } catch (error) {
        console.log(
          'Error: Cannot write to Arctis Wireless device. Please replug the device.'
        )
      }

      device.close()
    })
}

getPercentage((device, percentage) => {
  percentage = percentage > 100 ? 100 : percentage < 0 ? 0 : percentage

  console.log('Initializing...')
  console.log(
    "Your %s device's battery percentage is %s",
    device.product,
    percentage
  )

  notify({
    title:
      percentage === 0
        ? `Please connect your SteelSeries Wireless Device first.`
        : `${percentage}% battery left on your ${device.product}`,
    message: ' ',
    icon: path.join(__dirname, `./images/${percentage}.png`),
    appID: 'SteelSeries Arctis Battery Percentage',
  })
})
