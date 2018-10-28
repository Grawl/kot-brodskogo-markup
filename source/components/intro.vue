<template lang='pug'>
	.introContainer(:class="[ `step${step}`, { isVideoLoading } ]")
		.videoLoading(
		:class="{ 'hidden': !isVideoLoading }"
		) Загрузка
		.logo(
		@click='logoClick'
		:title='logoTitle'
		)
			include ../assets/kot-brodskogo-logo.svg
		.unlock(
		:class="{ 'hidden': step > 2 }"
		): unlock(
		ref='unlock'
		@x='unlockMove'
		@unlocked='nextScene'
		)
		p.text.text2(
		ref='text2'
		v-if='text.parts && step === 2'
		)
			template(v-for='letter in text.visible')
				span(v-html='letter')
			template(v-for='letter in text.hidden')
				span.invisible(v-html='letter')
		video.video.video1(
		muted playsinline preload='auto'
		ref='video1'
		)
			source(:src='step1video.url' :type='step1video.type')
		video.video.video2(
		muted playsinline preload='auto'
		ref='video2'
		)
			source(:src='step2video.url' :type='step2video.type')
</template>
<style lang='sass' scoped>
	.introContainer
		height: 100%
	.isVideoLoading
		.logo
			color: black
	.videoLoading
		absolute: top left
		size: 100%
		z-index: 10
		display: flex
		justify-content: center
		align-items: center
		background-color: white
		color: black
		cursor: progress
		&.hidden
			display: none
	.logo
		fixed: top 1vw left 1vw
		z-index: 30
		width: 5vw
		color: white
		cursor: pointer
		pointer-events: auto
		transition: opacity 0.3s
		&:hover
			opacity: 0.7
		svg
			path
				fill: currentColor
				transition: fill 1s
	.unlock
		absolute: top 50% left 30vw right 30vw
		z-index: 10
		width: auto
		transform: translateY(-50%)
		pointer-events: auto
		&.hidden
			visibility: hidden
			pointer-events: none
	.video
		absolute: top left
		z-index: 1
		size: 100%
		object-fit: cover
		background-color: black
		opacity: 0
		transition: opacity 1s
		pointer-events: none
	.text
		absolute: top left 50%
		z-index: 2
		width: 20em
		margin-left: -10em
		font-family: 'PT Mono', monospace
		font-size: 1.6em
		color: white
		opacity: 0
		.invisible
			opacity: 0
	.step1
		.video1
			opacity: 1
			transition: opacity 1s
			pointer-events: auto
	.step2
		.video1
			transition: opacity 5s
		.video2
			opacity: 1
			transition: opacity 1s
			pointer-events: auto
		.text2
			opacity: 1
	.step3
		.logo
			color: black
		.videoLoading
			opacity: 0
			pointer-events: none
</style>
<script>
	import unlock from './slide-to-unlock'
	let playTimeout
	let video
	let step2timeout
	let step3interval
	let step3timeout
	const navStep = 3
	const debugStep2 = false
	const debugStep3 = false
	export default {
		name: 'intro',
		components: {
			unlock,
		},
		data() {
			return {
				isVideoLoading: true,
				interactive: true,
				videoPaused: true,
				step: 1,
				counter: 0,
				text: {
					speed: 2,
					string: null,
					parts: [],
					visible: [],
					hidden: [],
				},
				step1video: {
					url: null,
					type: null,
				},
				step2video: {
					url: null,
					type: null,
				},
			}
		},
		beforeMount() {
			const externalStorage = this.$root.externalStorage
			console.log({ externalStorage })
			const skipIntro = JSON.parse(localStorage.getItem('skipIntro'))
			if (skipIntro) {
				this.step = 3
			}
			this.text.string = externalStorage.description
			this.step1video.url = externalStorage.step1video.url
			this.step1video.type = externalStorage.step1video.type
			this.step2video.url = externalStorage.step2video.url
			this.step2video.type = externalStorage.step2video.type
		},
		mounted() {
			if (debugStep2) {
				this.isVideoLoading = false
				this.step = 2
			}
			if (debugStep3) {
				this.isVideoLoading = false
				this.step = 3
			}
			switch (this.step) {
				case 1:
					this.initStep1()
					break
				case 2:
					this.initStep2()
					break
				default:
					break
			}
		},
		computed: {
			logoTitle() {
				if (this.step === navStep) {
					return 'Повторить вступление'
				} else {
					return 'Перейти к навигации'
				}
			}
		},
		methods: {
			logoClick() {
				if (this.step === navStep) {
					this.step = 1
					this.initStep1()
					this.playVideo(2000)
				} else {
					this.step = navStep
					localStorage.setItem('skipIntro', 'true')
				}
			},
			unlockMove(newVal, oldVal) {
				console.log('unlock move', { timeout: playTimeout, newVal, oldVal })
				if (newVal > oldVal && this.interactive) {
					this.playVideo(300)
					this.counter = this.counter + 1
					this.updateTextData(this.counter + this.text.speed)
				}
			},
			initStep1() {
				this.counter = 0
				video = this.$refs['video1']
				const skipIntro = JSON.parse(localStorage.getItem('skipIntro'))
				if (skipIntro) {
					this.step = 1
					this.isVideoLoading = false
					return
				}
				const goToStep3 = setTimeout(() => {
					console.warn('step 1 video not loaded in 5000ms')
					this.step = 3
				}, 5000)
				video.addEventListener("canplaythrough", () => {
					clearTimeout(goToStep3)
					this.step = 1
					this.isVideoLoading = false
					this.playVideo(2000)
				}, false)
			},
			initStep2() {
				this.counter = 0
				video = this.$refs['video2']
				this.text.parts = this.text.string.split('')
				this.text.visible = []
				this.text.hidden = []
				this.step = 2
				if (debugStep2) {
					this.updateTextData(1000)
				}
			},
			nextScene() {
				console.log('next scene')
				this.interactive = false
				clearTimeout(step2timeout)
				clearInterval(step3interval)
				clearTimeout(step3timeout)
				let time
				switch (this.step) {
					case 1:
						time = 3000
						this.playVideo(time)
						step2timeout = setTimeout(() => {
							console.log('case 1')
							this.step = 2
							this.$refs['unlock'].lock()
							this.interactive = true
							this.initStep2()
						}, time)
						break
					case 2:
						time = 5000
						this.playVideo(time)
						localStorage.setItem('skipIntro', 'true')
						step3interval = setInterval(() => {
							this.counter = this.counter + 1
							this.updateTextData(this.counter + this.text.speed)
						}, 20)
						step3timeout = setTimeout(() => {
							console.log('case 2')
							this.step = 3
							this.$refs['unlock'].lock()
							this.interactive = true
						}, time)
						break
					default:
						clearTimeout(step2timeout)
						clearInterval(step3interval)
						clearTimeout(step3timeout)
						break
				}
			},
			playVideo(time = 100) {
				clearTimeout(playTimeout)
				this.videoPaused = false
				playTimeout = setTimeout(this.pauseVideo, time)
				video.play()
			},
			pauseVideo() {
				this.videoPaused = true
				video.pause()
			},
			updateTextData(progress = 0) {
				const visibleWords = Math.floor(progress / this.text.speed)
				this.text.visible = this.text.parts.slice(0, visibleWords)
				this.text.hidden = this.text.parts.slice(visibleWords)
			},
		},
	}
</script>
