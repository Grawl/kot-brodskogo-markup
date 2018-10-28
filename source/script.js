import Vue from 'vue/dist/vue'
import intro from './components/intro'
console.log('script')
initVueInstance('[intro]', initIntro)
function initIntro(where) {
	return new Vue({
		name: 'intro',
		el: `#${where.id}`,
		components: {
			intro,
		},
		data() {
			return {
				externalStorage: window['site'],
			}
		}
	})
}
function initVueInstance(selector, initFunction) {
	document.querySelectorAll(selector).forEach(element => {
		console.log({ element })
		if (element.id) {
			initFunction(element)
		} else {
			console.warn('element does not have an ID and will not be used as Vue instance element', element)
		}
	})
}
