<template lang='pug'>
	.gutter(ref='outer' :class="{ 'unlocked': unlocked }")
		.handle(
		ref='handle'
		@mousedown='dragStart'
		@touchstart='dragStart'
		:class="{ 'dragging': dragging }"
		:style='`left: ${x}px`'
		)
			.animationLayer
				.visiblePart
				.circle
		.target
</template>
<style lang='sass' scoped>
	.gutter
		position: relative
		width: 100%
		user-select: none
		&.unlocked
			.handle
				cursor: initial
			.handle,
			.target
				transform: scale(0)
	.handle,
	.target
		width: 10%
		height: 0
		padding-bottom: 10%
		border-radius: 100%
		transform: scale(1)
	.handle
		position: relative
		left: 0
		cursor: pointer
		transition: background 0.2s ease-out, left 0.3s ease-out, transform 1s
		&.dragging
			transition: none
			.visiblePart
				transform: scale(0.25)
			.animationLayer
				animation: none
			.circle
				animation: none
		.animationLayer
			absolute: top left
			size: 100%
			animation: pulse 2s infinite alternate-reverse ease-in-out
			border-radius: inherit
		.visiblePart
			absolute: top left
			size: 100%
			border-radius: inherit
			background: white
			transform: scale(0.5)
			transition: transform 0.2s
			will-change: transform
		.circle
			absolute: top left
			size: 100%
			border-radius: inherit
			border: 1px solid white
			transform: scale(0)
			opacity: 0
			animation: circle 4s infinite ease-out
			will-change: transform
			@keyframes circle
				from
					transform: scale(0)
					opacity: 0.2
				to
					transform: scale(2)
					opacity: 0
	.target
		absolute: top -1px right
		border: 1px solid white
		opacity: 0.3
		transform: scale(0.5)
	@keyframes pulse
		from
			transform: scale(1)
		to
			transform: scale(0.8)
</style>
<script>
let lockRect = null
let outerRect = null
let dragProps = null
export default {
	name: 'unlock',
	data() {
		return {
			dragging: false,
			unlocked: false,
			x: 0,
		}
	},
	computed: {
		isTouch() {
			return 'ontouchstart' in document.documentElement
		}
	},
	watch: {
		'x': function(newVal, oldVal) {
			this.$emit('x', newVal, oldVal)
		}
	},
	mounted() {
		outerRect = this.$refs['outer'].getBoundingClientRect()
		window.addEventListener('resize', () => {
			console.log('resize')
			lockRect = this.$refs['handle'].getBoundingClientRect()
			outerRect = this.$refs['outer'].getBoundingClientRect()
		})
	},
	methods: {
		dragStart(e) {
			if (this.unlocked) return
			this.dragging = true
			this.$emit('dragStart')
			lockRect = this.$refs['handle'].getBoundingClientRect()
			const x = this.getX(e)
			dragProps = {
				start: lockRect.left - outerRect.left,
				mouseStart: x,
				newX: 0,
			}
			document.addEventListener('mousemove', this.dragLock, false)
			document.addEventListener('touchmove', this.dragLock, false)
			document.addEventListener('mouseup', this.dragStop)
			document.addEventListener('touchend', this.dragStop)
		},
		dragStop(reset) {
			this.dragging = false
			this.$emit('dragStop')
			if (reset !== false) {
				this.x = 0
			}
			document.removeEventListener('mousemove', this.dragLock, false)
			document.removeEventListener('touchmove', this.dragLock, false)
			document.removeEventListener('mouseup', this.dragStop)
			document.removeEventListener('touchend', this.dragStop)
		},
		lock() {
			this.$emit('locked')
			this.unlocked = false
			this.x = 0
		},
		unlock() {
			this.dragStop(false)
			this.unlocked = true
			this.$emit('unlocked')
		},
		dragLock(e) {
			e.preventDefault()
			const posX = this.getX(e)
			const mouseDiff = posX - dragProps.mouseStart
			const maxX = outerRect.width - lockRect.width
			let newX = dragProps.start + mouseDiff
			newX = this.clamp(newX, 0, maxX)
			this.x = newX
			if (newX >= maxX) {
				this.unlock()
			}
		},
		clamp(value, min, max) {
			return Math.min(Math.max(value, min), max)
		},
		getX(event) {
			if (this.isTouch === true) {
				return event.touches[0].pageX
			} else {
				return event.clientX
			}
		},
	},
}
</script>
