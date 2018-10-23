import Vue from 'vue/dist/vue'
let lockRect = null
let outerRect = null
let dragProps = null
export default {
	name: 'unlock',
	template: `
<div class='gutter' ref='outer' :class="{ 'unlocked': unlocked }">
	<div class='handle'
		 ref='handle'
		 @mousedown='dragStart'
		 @touchstart='dragStart'
		 :class="{ 'dragging': dragging }"
		 :style="'left: ' + x + 'px'"
	>
		<div class='animationLayer'>
			<div class='visiblePart'></div>
			<div class='circle'></div>
		</div>
	</div>
	<div class='target'></div>
</div>
	`,
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
