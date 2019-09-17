const { createCanvas } = require('canvas')
const fs = require('fs')

const colors = [
	[50, '#D2F0CD', '#153311'], // 50-100
	[20, '#F9EDC7', '#63321C'], // 20-50
	[0, '#FFE0E0', '#6F2323'] // 0-20
]

createImage = (bg, fg, text) => {
	const canvas = createCanvas(48, 48)
	const ctx = canvas.getContext('2d')

	ctx.beginPath()
	ctx.arc(24, 24, 23, 0, 2 * Math.PI, false)
	ctx.fillStyle = bg
	ctx.strokeStyle = bg
	ctx.fill()
	ctx.stroke()

	ctx.font = '700 18px Segoe UI'
	ctx.textAlign = 'center'
	ctx.textBaseline = 'middle'
	ctx.fillStyle = fg
	ctx.fillText(text, 24, 22)

	return canvas.toDataURL().split(',')[1]
}

for (let percentage = 0; percentage <= 100; percentage++) {
	const c = colors.find((el) => percentage >= el[0])

	fs.writeFileSync(
		`./images/${percentage}.png`,
		createImage(c[1], c[2], percentage === 0 ? '?' : `${percentage}%`),
		'base64',
		(err) => {
			if (err) throw err
		}
	)
}
