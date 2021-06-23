import observer from '@cocreate/observer'
import ccutils from '@cocreate/utils'
import crud from '@cocreate/crud-client'
import action from '@cocreate/action'
import utils from "./utils" 
import uuid from '@cocreate/uuid'

const CoCreateForm = {
	
	requestAttr: "data-document_request",
	selectors: [], 	// ToDo: Depreciate we will no longer use selector... we will let the callback query selector
	modules: [],

	init: function({name, selector, callback}) {
		
		this.modules.push({
			name,
			selector, // ToDo: Depreciate we will no longer use selector... we will let the callback query selector
			callback
		});
		
		// ToDo: Depreciate we will no longer use selector... we will let the callback query selector
		if (selector) {
			this.selectors.push(selector);
		}
	},
	
	// ToDo: Depreciate we will no longer use selector... we will let the callback query select
	get: function() {
		return {
			selectors: this.selectors
		}
	},
	
	// ToDO: Depreciate because handeled by setDocumentId
	checkID: function(element, attr = "data-document_id") {
		let document_id = element.getAttribute(attr) || "";
		if (document_id === "" || document_id === "pending" || !ccutils.checkValue(document_id)) {
			return false;
		}
		return true;
	},
	
	// ToDO: Depreciate because handeled by requestDocumentIdOfForm
	request: async function({form, element, nameAttr, value}) {
		
		if (!form && element) {
			form = element.closest('form');
		}
		
		if (form) {
			await this.__requestDocumentIdOfForm(form)
		} else if (element) {
			nameAttr = nameAttr || "name"
			await this.__requestDocumentId(element, nameAttr, value);
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
		// crud.listen('createDocument', function(data) {
		// 	const {metadata} = data;
		// 	self.__receivedDocumentId(data);
		// 	if (metadata == "createDocument-action") {
		// 		//. dispatch EndAction
		// 	}
		// })
		
		// ToDo: Depreciate due to await
		crud.listen('deleteDocument', function(data) {
			const {metadata} = data
			if (metadata === "deleteDocument-action") {
				//.dispatch End Action
			}
		})	
		
		// ToDo: Depreciate can request requestDocumentIdOfForm directly and await
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
		const { collection, document_id } = crud.getAttr(btn)
		
		// ToDo: why do we need to check value 
		if (ccutils.checkValue(collection) && ccutils.checkValue(document_id)) {

			crud.deleteDocument({ 
				collection, 
				document_id, 
				'metadata': 'deleteDocument-action' 
			});
			
			// ToDo: Depreciate due to await
			document.dispatchEvent(new CustomEvent('deletedDocument', {
				detail: {}
			}))
		}
	},
	
	__deleteDocumentsAction: function(btn) {
		const { collection, document_id } = crud.getAttr(btn)
		const selector = btn.getAttribute('data-document_target');
		if (!selector) return;
		
		const selectedEls = document.querySelectorAll(selector)
		
		if (utils.checkValue(collection)) {
			selectedEls.forEach((el) => {
				const document_id =  el.getAttribute('data-document_id');
				if (crud.checkValue(document_id)) {
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
	
	// ToDo: will be replace with function below but will maintain the same name
	__saveDocumentAction: function(btn) {
		const form = btn.closest("form")

		if (!utils.checkFormValidate(form)) {
			alert('Values are not unique');
			return;
		}
		
		const selectors = this.selectors || [];
		const elements = form.querySelectorAll(selectors.join(','));
		
		// ToDo: Deprecaite due to async await crud
		let request_document_id = false;
	
		for (var i = 0; i < elements.length; i++) {
			let el = elements[i];
			const { document_id, name } = crud.getAttr(el)
			const is_save = crud.isSaveAttr(el)
			if (!is_save) continue;

			if (!crud.checkValue(document_id)) {
				
				// ToDo: Deprecaite due to async await crud
				if (name) request_document_id = true;
				
				continue;
			}
			
			if (crud.isCRDT(el)) continue;

			if (utils.isTemplateInput(el)) return;

			var new_event = new CustomEvent("clicked-submitBtn", {
				bubbles: true,
				detail: { 
					type: "submitBtn", 
					element: el 
				}});
			el.dispatchEvent(new_event);  
		}
		// ToDo: Depreciate can request requestDocumentIdOfForm directly and await
		if (request_document_id) {
			// ToDo: this function should awiat before continuing
			this.requestDocumentIdOfForm(form)
		}
		
		document.dispatchEvent(new CustomEvent('savedDocument', {
			detail: {}
		}))
		// fire each callback with an element in the form and send the list of elements to process for saving
	},
	
	__saveDocument: async function(btn) {
		const form = btn.closest("form")

		if (!utils.checkFormValidate(form)) {
			alert('Values are not unique');
			return;
		}
		
		await this.requestDocumentIdOfForm(form);

		this.modules.forEach(({callback}) => {
			callback.call(null, form);
		})		
	},
	
	// ToDo: Deprecaite due to async await crud
	__requestDocumentId: async function(element, nameAttr = "name", value = null) {
		const { collection, name }  = crud.getAttr(element)
		if (!collection || !name) return 

		const request_id = uuid.generate();
		element.setAttribute(this.requestAttr, request_id);
		
		let response_data = await crud.createDocument({
			"collection": collection,
			"element": request_id,
			"metadata": "",
		})
		if (response_data) {
			this.__receivedDocumentId(response_data)
		}
	},
		
	__requestDocumentIdOfForm: async function (form) {
		
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

				collections.push(collection);

				/* FixME Create Document request */	
				// let document_id = await crud.createDocument({
				let response_data = await crud.createDocument({
					"collection": collection,
					'data': {},
					"metadata": "",
				})
				
				if (response_data) {
					this.setDocumentId(form, response_data)
				}
				
			}
		}
	},
	
	setDocumentId: function(form, data) {
		// this.__requestDocumentIdOfForm(form)
		if (!data['document_id']) {
			return;
		}
		let self = this;
		const collection = data['collection'];
		const id = data['document_id']
		
		if (form && id) {
			// this is needed
			const elements = form.querySelectorAll(`[data-collection=${collection}], [data-pass_collection=${collection}]`)
			
			// TODO: make line 301 and 302 continue or return
			elements.forEach(function(el) {
				if (el.hasAttribute('name') && !this.checkID(el)) {
					el.setAttribute('data-document_id', id);
			  	}
			
			  	if (el.hasAttribute('data-pass_to') && !this.checkID(el, 'data-pass_document_id')) {
					el.setAttribute('data-pass_document_id', id);

					if (el.parentNode.classList.contains('submitBtn')) {
						el.click();
					}
			  	}
			})
		} 
	},
	
	// ToDo: Deprecaite due to async await crud
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
	
	// ToDo: Deprecaite due to async await crud
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
			
			// TODO: Depreciate
			elements.forEach(function(el) {
				el.removeAttribute(self.requestAttr);
				if (el.hasAttribute('name')) self.__setNewIdProcess(el, id);
				if (el.hasAttribute('data-pass_to')) self.__setNewIdProcess(el, id, true);
			})
	  	
		// TODO: Depreciate
		} else if (element) {
			this.__setNewIdProcess(element, id);
		}
	},
}

CoCreateForm.__init();

observer.init({ 
	name: 'CoCreateForm', 
	observe: ['addedNodes'],
	callback: mutation =>  mutation.target.tagName === "FORM" &&
		CoCreateForm.initElement(mutation.target)
	
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

action.init({
	action: "saveDocumentNew",
	endEvent: "savedDocumentNew",
	callback: (btn, data) => {
		CoCreateForm.__saveDocument(btn)
	},
})

export default CoCreateForm;