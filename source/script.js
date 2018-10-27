import initIntro from './components/intro/intro'
console.log('script')
initVueInstance('[intro]', initIntro)
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
