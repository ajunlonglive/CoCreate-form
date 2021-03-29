import observer from '@cocreate/observer'
import ccutils from '@cocreate/utils';
import {socket, crud, core} from '../../../CoCreateJS/src'
import action from '@cocreate/action'
import utils from "./utils" 



// import crdt from '@cocreate/crdt'
// import text from '@cocreate/text'



const CoCreateForm = {
	
	requestAttr: "data-document_request",
	selectors: [],
	modules: [],

	init: function({name, selector, callback}) {
		
		this.modules.push({
			name,
			selector,
			callback
		});
		
		if (selector) {
			this.selectors.push(selector);
		}
	},
	
	get: function() {
		return {
			selectors: this.selectors
		}
	},
	
	checkID: function(element, attr = "data-document_id") {
		let document_id = element.getAttribute(attr) || "";
		if (document_id === "" || document_id === "pending" || !ccutils.checkValue(document_id)) {
			return false;
		}
		return true;
	},
	
	request: function({form, element, nameAttr, value}) {
		
		if (!form && element) {
			form = element.closest('form');
		}
		
		if (form) {
			this.__requestDocumentIdOfForm(form)
		} else if (element) {
			nameAttr = nameAttr || "name"
			this.__requestDocumentId(element, nameAttr, value);
		}
		
	},
	
	initElement: function(container) {
		const __container = container || document
		
		if (!__container.querySelectorAll) {
			return;
		}
		let  forms = __container.querySelectorAll('form');

		if (forms.length === 0 && __container != document && __container.tagName === "FORM") {
			forms = [__container];
		}
		
		forms.forEach((form) => {
			utils.setAttribute(form)
			utils.disableAutoFill(form);
		})
	},
	
	__init: function() {
		const forms = document.querySelectorAll('form');
		this.__initEvent();

		forms.forEach((form) => {
			utils.setAttribute(form)
		})
		
	},
	
	__initEvent: function() {
		const self = this;
		socket.listen('createDocument', function(data) {
			const {metadata} = data;
			self.__receivedDocumentId(data);
			if (metadata == "createDocument-action") {
				//. dispatch EndAction
			}
		})
		
		socket.listen('deleteDocument', function(data) {
			const {metadata} = data
			if (metadata === "deleteDocument-action") {
				//.dispatch End Action
			}
		})	
		document.addEventListener('clicked-submitBtn', function(event) {
			const {element} = event.detail;

			self.modules.forEach(({selector, callback}) => {
				if (callback && element.matches(selector)) {
					callback.call(null, element);
				}
			})
		})
	},

	__deleteDocumentAction: function(btn) {
		const collection = btn.getAttribute('data-collection');
		const document_id = btn.getAttribute('data-document_id')
		if (ccutils.checkValue(collection) && ccutils.checkValue(document_id)) {
			crud.deleteDocument({
				'collection': collection, 
				'document_id': document_id,
				'metadata': 'deleteDocument-action' 
			});
			
			document.dispatchEvent(new CustomEvent('deletedDocument', {
				detail: {}
			}))
		}
	},
	
	__deleteDocumentsAction: function(btn) {
		const collection = btn.getAttribute('data-collection');
		const selector = btn.getAttribute('data-document_target');
		if (!selector) return;
		
		const selectedEls = document.querySelectorAll(selector)
		
		if (utils.checkValue(collection)) {
			selectedEls.forEach((el) => {
				const document_id = el.getAttribute('data-document_id');
				if (ccutils.checkValue(document_id)) {
					crud.deleteDocument({
						'collection': collection,
						'document_id': document_id,
						'metadata': ''
					})
				}
			})
			
			document.dispatchEvent(new CustomEvent('deletedDocuments', {
				detail: {}
			}))
		}
	},
	
	__createDocumentAction: function(btn) {
		const form = btn.closest("form")
		const self = this;
		let collections = utils.getCOllections(form)
		
		collections.forEach((collection) => {
			let data = utils.getFormData(form, "", collection);
			
			if (Object.keys(data).length == 0 && data.constructor === Object) {
				return;
			}
			if (ccutils.checkValue(collection)) {
				crud.createDocument({
					'collection': collection,
					'data': data,
					'metadata': 'createDocument-action' ,
					'element':'empty'
				});
				document.dispatchEvent(new CustomEvent('createdDocument', {
					detail: {}
				}))
			}
		})
	},
	
	__saveDocumentAction: function(btn) {
		const form = btn.closest("form")

		if (!utils.checkFormValidate(form)) {
			alert('Values are not unique');
			return;
		}
		
		const selectors = this.selectors || [];
		const elements = form.querySelectorAll(selectors.join(','));
		
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
			
			if (input.isUsageY(el)) {
				continue;
			}

			if (utils.isTemplateInput(el)) return;

			var new_event = new CustomEvent("clicked-submitBtn", {
				bubbles: true,
				detail: { 
					type: "submitBtn", 
					element: el 
				}});
			el.dispatchEvent(new_event);  
		}
		if (request_document_id) {
			this.requestDocumentIdOfForm(form)
		}
		
		document.dispatchEvent(new CustomEvent('savedDocument', {
			detail: {}
		}))
	},
	
	__requestDocumentId: function(element, nameAttr = "name", value = null) {
		const collection = element.getAttribute('data-collection')
		const name = element.getAttribute(nameAttr)
		
		if (!collection || !name) return 

		const request_id = ccutils.generateUUID();

		element.setAttribute(this.requestAttr, request_id);
		
		crud.createDocument({
			"collection": collection,
			"element": request_id,
			"metadata": "",
		})
	},
		
	__requestDocumentIdOfForm: function (form) {
		
		let self = this;
		let elemens = form.querySelectorAll('[name], [data-pass_to]')
		
		let collections = [];

		for (var  i = 0; i < elemens.length; i++) {
			let el = elemens[i];
			if (el.parentNode.classList.contains('template')) {
				continue;
			}
			const collection = el.getAttribute("data-collection") || el.getAttribute("data-pass_collection") || "";	
			
			if (
				collection !== "" && 
				!collections.includes(collection) && 
				(!self.checkID(el, 'data-document_id') && !self.checkID(el, 'data-pass_document_id'))
			) {
				const request_id = ccutils.generateUUID();
				collections.push(collection);

				el.setAttribute(this.requestAttr, request_id);
				//. get Data
				
				let data = utils.getFormData(form, "", collection);
				
				/* FixME Create Document request */	
				crud.createDocument({
					"collection": collection,
					"element": request_id,
					'data': data,
					"metadata": "",
				})
			}
		}
	},

	__setNewIdProcess: function(element, document_id, pass) {
		if (!element) return;
		
  		element.removeAttribute(this.requestAttr);
		const event_data = {
			document_id: document_id,
		}

		if (!pass && !this.checkID(element) && element.hasAttribute('name')) {
			element.setAttribute('data-document_id', document_id);
	  	}

	  	if (pass && !this.checkID(element, 'data-pass_document_id') && element.hasAttribute('data-pass_to')) {
			element.setAttribute('data-pass_document_id', document_id);
			// CoCreateLogic.storePassData(element)
			
			if (element.parentNode.classList.contains('submitBtn')) {
				element.click();
			}
	  	}
  	
		var event = new CustomEvent('set-document_id', {detail: event_data})
		element.dispatchEvent(event);

	},
	
	__receivedDocumentId: function(data) {
		if (!data['document_id']) {
			return;
		}

		let element = document.querySelector(`[${this.requestAttr}="${data['element']}"]`);
		if (!element) return;
		let self = this;
		const form = (element.tagName === "FORM") ? element : utils.getParents(element, 'form');
		const collection = data['collection'];
		const id = data['document_id']
		if (form && id) {
			form.setAttribute('data-form_id', data['element']);
			const elements = form.querySelectorAll(`[data-collection=${collection}], [data-pass_collection=${collection}]`)
			elements.forEach(function(el) {
				el.removeAttribute(self.requestAttr);
				if (el.hasAttribute('name')) self.__setNewIdProcess(el, id);
				if (el.hasAttribute('data-pass_to')) self.__setNewIdProcess(el, id, true);
			})
	  	
		} else if (element) {
			this.__setNewIdProcess(element, id);
		}
	},
}

CoCreateForm.__init();
core.registerInit(CoCreateForm.initElement, CoCreateForm);

observer.init({ 
	name: 'CoCreateForm', 
	observe: ['subtree', 'childList'],
	include: 'form', 
	callback: function(mutation) {
		CoCreateForm.initElement(mutation.target)
	}
})

action.init({
	action: "createDocument",
	endEvent: "createdDocument",
	callback: (btn, data) => {
		CoCreateForm.__createDocumentAction(btn)
	},
})

action.init({
	action: "deleteDocument",
	endEvent: "deletedDocument",
	callback: (btn, data) => {
		CoCreateForm.__deleteDocumentAction(btn)
	},
})

action.init({
	action: "deleteDocuments",
	endEvent: "deletedDocuments",
	callback: (btn, data) => {
		CoCreateDocument.__deleteDocumentsAction(btn)
	},
})

action.init({
	action: "saveDocument",
	endEvent: "savedDocument",
	callback: (btn, data) => {
		CoCreateForm.__saveDocumentAction(btn)
	},
})

export default CoCreateForm;