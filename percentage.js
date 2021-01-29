#!/usr/bin/env node

const getHeadphoens = require('arctis-usb-finder').default

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
  getHeadphoens().forEach(callback)
}

getPercentage((device) => {
  let percentage = device.batteryPercent
  percentage = percentage > 100 ? 100 : percentage < 0 ? 0 : percentage

  console.log('Initializing...')
  console.log(
    "Your %s device's battery percentage is %s",
    device.modelName,
    percentage
  )

  notify({
    title:
      percentage === 0
        ? `Please connect your SteelSeries Wireless Device first.`
        : `${percentage}% battery left on your ${device.modelName}`,
    message: ' ',
    icon: path.join(__dirname, `./images/${percentage}.png`),
    appID: 'SteelSeries Arctis Battery Percentage',
  })
})
