import Vue from 'vue/dist/vue'
import unlock from '../slide-to-unlock'
let playTimeout
let video
let step2timeout
let step3interval
let step3timeout
const navStep = 3
const debugStep2 = false
const debugStep3 = false
export default where => {
	return new Vue({
		name: 'intro',
		el: `#${where.id}`,
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
			const externalStorage = window['site']
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
				const goToStep3 = setTimeout(() => {
					console.warn('step 1 video not loaded in 5000ms')
					this.step = 3
				}, 5000)
				video.addEventListener('canplaythrough', () => {
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
	})
}
