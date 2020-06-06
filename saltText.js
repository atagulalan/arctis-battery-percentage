#!/usr/bin/env node
var getPercentage = require('./getPercentage');

getPercentage((device, percentage) => {
  console.log(percentage > 100 ? 100 : percentage < 0 ? 0 : percentage)
})