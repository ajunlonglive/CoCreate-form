
const CoCreateForm = {

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
			// if (CoCreateInit.getInitialized(form)) {
			// 	return;
			// }
			// CoCreateInit.setInitialized(form);

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
		
		if (submitBtn) {
			this.__setSubmitEvent(form, submitBtn)
		}
	},
	
	__initAttribute: function(form) {
		// if (!form.getAttribute('data-collection')) {
		// 	return;
		// }
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
		})
	},

	__setSubmitEvent: function(form, submitBtn) {
		let self = this;
		
		var dataRealTime = form.getAttribute('data-realtime') || "true";
		
		submitBtn.addEventListener('click', function(e) {
			e.preventDefault();
			e.stopPropagation()
			
			const elements = form.querySelectorAll(g_moduleSelectors.join(","));
			
			if (!self.__checkFormValidate(form)) {
				alert('Values are not unique');
				return;
			}
			
			let request_document_id = false;    
			
			for (var i = 0; i < elements.length; i++) {
				let el = elements[i];        
				const data_document_id = el.getAttribute('data-document_id');

				if (el.getAttribute('data-save_value') == 'false') {
					continue;
				}

				if (!data_document_id) {
					if (el.getAttribute('name')) {
						request_document_id = true;
					}
					continue;
				}
				
				if (CoCreateInput.isUsageY(el)) {
					continue;
				}

				if (self.__isTemplateInput(el)) return;

				var new_event = new CustomEvent("clicked-submitBtn", {detail: { type: "submitBtn" }});
				el.dispatchEvent(new_event);  
				
				el.dispatchEvent(new CustomEvent('CoCreateForm-run', {
					eventType: 'submitBtn', 
					item: el
				}))
			}
			
			if (request_document_id) {
				CoCreateDocument.requestDocumentIdOfForm(form)
			}
		});
		
	},
	
	__checkFormValidate: function(form) {
		
		if (typeof CoCreateUnique !== 'undefined') {
			return CoCreateUnique.checkValidate(form)
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
	
}

CoCreateForm.init();
CoCreate.registerSocketInit(CoCreateForm.initElement, CoCreateForm);

CoCreateInit.register('CoCreateForm', CoCreateForm, CoCreateForm.initElement);
