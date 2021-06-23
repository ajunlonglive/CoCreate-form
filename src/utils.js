import crud from '@cocreate/crud-client'

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
		const { collection, document_id, name } = crud.getAttr(form)
		
		const dataRealTime = form.getAttribute('data-realtime');
		const is_flat = form.getAttribute('data-flat')
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
			
			if (!el.hasAttribute('data-flat') && is_flat != null) {
				el.setAttribute('data-flat', is_flat);
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

	// ToDo: Used by api and renderkey to get all form values
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