
const CoCreateForm = {
	
	selectors: [],
	
	modules: [],

	init: function() {
		const forms = document.querySelectorAll('form');
		const self = this;
		
		forms.forEach((form) => {
			self.__initAttribute(form)
		})
	},
	
	initElement: function(container) {
		const __container = container || document
		
		if (!__container.querySelectorAll) {
			return;
		}
		let  forms = __container.querySelectorAll('form');
		let self = this;
		
		if (forms.length === 0 && __container != document && __container.tagName === "FORM") {
			forms = [__container];
		}
		
		forms.forEach((form) => {
			// if (CoCreate.observer.getInitialized(form)) {
			// 	return;
			// }
			// CoCreate.observer.setInitialized(form);

			self.__initForm(form)
		})
	},
	
	disableAutoFill: function(element) {
		if (element.tagName == "TEXTAREA") {
			element.value = "";
			element.setAttribute("autocomplete","off")
		}
		if (!element.hasAttribute("autocomplete")) {
			element.setAttribute('autocomplete', "off");
		}
	},
	
	__initForm: function(form) {
		const  submitBtn = form.querySelector('.submitBtn, .registerBtn');
		
		this.__initAttribute(form);
		this.disableAutoFill(form);
	},
	
	__initAttribute: function(form) {
		
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

	__setSubmitEvent: function(form, submitBtn) {
		let self = this;
		

		
	},
	
	__checkFormValidate: function(form) {
		
		if (typeof CoCreate.unique !== 'undefined') {
			return CoCreate.unique.checkValidate(form)
		}
		return true;
	},
	
	__isTemplateInput: function (input) {
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
	
	getFormData: function(form) {
		const self = this; 
		const selectors = this.modules.map(m => m.selector);
		const elements = form.querySelectorAll(selectors.join(','));
		
		let request_document_id = false;
		let dataList = [];
		
		
		elements.forEach(el => {
			let collection = el.getAttribute('data-collection')
			let document_id = el.getAttribute('data-document_id')
			let name = el.getAttribute('name')
			
			if (el.getAttribute('data-save_value') == 'false') {
				return;
			}
			
			if (!document_id && name) {
				request_document_id = true;
				return;
			}
			
			let data = dataList.find(d => d.collection == collection && d.document_id == document_id);
				
		})
	},
	
	//. add information of modules
	//. { selector, .... }
	add: function({name, selector, getValueFunc}) {
		
		this.modules.push({
			name,
			selector,
			getValueFunc
		});
		
		if (selector) {
			this.selectors.push(selector);
		}
	},
	
	get: function() {
		return {
			selectors: this.selectors
		}
	}
	
}

CoCreateForm.init();
CoCreate.core.registerInit(CoCreateForm.initElement, CoCreateForm);

// CoCreate.init.register('CoCreateForm', CoCreateForm, CoCreateForm.initElement);

CoCreate.observer.add({ 
	name: 'CoCreateForm', 
	observe: ['subtree', 'childList'],
	include: 'form', 
	callback: function(mutation) {
		CoCreateForm.initElement(mutation.target)
	}
})

export default CoCreateForm;