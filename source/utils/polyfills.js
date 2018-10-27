import 'babel-polyfill'
import 'core-js/es7/promise' // See - https://github.com/babel/babel/issues/7795
import 'whatwg-fetch/fetch'

// Fix 'whatwg-fetch', see - https://github.com/zloirock/core-js/issues/178
const _fetch = fetch
window.fetch = (...args) => Promise.resolve(_fetch(...args))

if (window.NodeList && !NodeList.prototype.forEach) {
	NodeList.prototype.forEach = Array.prototype.forEach
}

if (!('remove' in Element.prototype)) {
	Element.prototype.remove = function() {
		if (this.parentNode) {
			this.parentNode.removeChild(this)
		}
	}
}
