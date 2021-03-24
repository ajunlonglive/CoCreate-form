
const Utils = {

	disableAutoFill: function(element) {
		if (element.tagName == "TEXTAREA") {
			element.value = "";
			element.setAttribute("autocomplete","off")
		}
		if (!element.hasAttribute("autocomplete")) {
			element.setAttribute('autocomplete', "off");
		}
	},

	setAttribute: function(form) {
		
		const collection = form.getAttribute('data-collection') || ""; 
		const dataRealTime = form.getAttribute('data-realtime');
		const document_id = form.getAttribute('data-document_id') || "";
		let elements = form.querySelectorAll('[name], [data-pass_to]')
		
					
		elements.forEach(function(el) {
			if (el.parentNode.classList.contains('template')) {
				return;
			}
			if (el.getAttribute('data-realtime') == null && dataRealTime) {
				
				// if (!['INPUT', 'TEXTAREA'].indexOf(el.tagName)) {
				el.setAttribute('data-realtime', dataRealTime);
				// }
			}
			if (el.getAttribute('name') && !el.hasAttribute('data-collection') && collection) {
				el.setAttribute('data-collection', collection);
			}
			
			if (el.getAttribute('data-pass_to') && !el.hasAttribute('data-pass_collection') &&  collection) {
				el.setAttribute('data-pass_collection', collection);
			}
			
			if (el.getAttribute('name') && !el.getAttribute('data-document_id') && document_id) {
				el.setAttribute('data-document_id', document_id)
			}
			if (!el.hasAttribute("data-document_id") && document_id != null) {
				el.setAttribute('data-document_id', document_id)
			}

		})
	},

	checkFormValidate: function(form) {
		
		if (typeof CoCreate.unique !== 'undefined') {
			return CoCreate.unique.checkValidate(form)
		}
		return true;
	},
	
	isTemplateInput: function (input) {
		if (input.classList.contains('template')) return true;
		
		let node = input.parentNode;
		while (node) {
			if (node.classList && node.classList.contains('template')) {
				return true;
			}
			node = node.parentNode;
		}
		
		return false;
	},
	
	getFormData: function(form, document_id, collection) {
		let data = {};
		if (!collection) return {}
		
		const elements = form.querySelectorAll(`[name][data-collection='${collection}']`)
		elements.forEach((el) => {
			let el_document_id = el.getAttribute('data-document_id') || ""
			let name = el.getAttribute('name')
			let value = el.value || el.getAttribute('value')
			if (name === "_id") return;
			if (!name || !value) return;
			if (document_id == el_document_id) {
				data[name] = el.value
			}
		})
		return data;
	},
	// getFormData: function(form, selectors) {
	// 	const self = this; 
	// 	const elements = form.querySelectorAll(selectors.join(','));
		
	// 	let request_document_id = false;
	// 	let dataList = [];
		
		
	// 	elements.forEach(el => {
	// 		let collection = el.getAttribute('data-collection')
	// 		let document_id = el.getAttribute('data-document_id')
	// 		let name = el.getAttribute('name')
			
	// 		if (el.getAttribute('data-save_value') == 'false') {
	// 			return;
	// 		}
			
	// 		if (!document_id && name) {
	// 			request_document_id = true;
	// 			return;
	// 		}
			
	// 		let data = dataList.find(d => d.collection == collection && d.document_id == document_id);
				
	// 	})
	// },
	
	getParents: function(element, selector = "form") {
		if (!Element.prototype.matches) {
			Element.prototype.matches =	Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector ||	Element.prototype.oMatchesSelector ||	Element.prototype.webkitMatchesSelector ||
			
			function(s) {
				var matches = (this.document || this.ownerDocument).querySelectorAll(s), i = matches.length;
				while (--i >= 0 && matches.item(i) !== this) {}
				return i > -1;
			};
		}
		
		for ( ; element && element !== document; element = element.parentNode ) {
			if ( element.matches( selector ) ) return element;
		}
		return null;
	},
	
	setDocumentIDOfElement: function(element, document_id) {
		let old_document_id = element.getAttribute('data-document_id');
		if (!old_document_id || old_document_id == "" || old_document_id == "pending") {
			element.setAttribute('data-document_id', document_id);
		}
	},
	
	getCOllections: function(form) {
		let collections = [];
		if (!form) return collections;

		let els = form.querySelectorAll('[name][data-collection]');
		els.forEach((el) => {
			let tmpCollection = el.getAttribute('data-collection')
			if (tmpCollection && !collections.includes(tmpCollection)) {
				collections.push(tmpCollection)
			} 
		})
		return collections;
	},
}

export default Utils;