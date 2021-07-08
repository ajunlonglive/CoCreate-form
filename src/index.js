import observer from '@cocreate/observer'
import crud from '@cocreate/crud-client'
import action from '@cocreate/action'
import utils from "./utils" 

const CoCreateForm = {
	
	requestAttr: "data-document_request",
	modules: [],

	init: function({name, selector, callback}) {
		this.modules.push({
			name,
			callback
		});
	},
	

	// ToDo: this is the same as crud.checkAttrValue we can probaly replace check id in all places and use crud.checkAttrValue
	checkID: function(element, attr = "data-document_id") {
		let document_id = element.getAttribute(attr) || "";
		
		if (document_id === "" || !crud.checkAttrValue(document_id)) {
			return false;
		}
		return true;
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
		forms.forEach((form) => {
			utils.setAttribute(form)
		})
	},
	

	__deleteDocumentAction: function(btn) {
		const { collection, document_id } = crud.getAttr(btn)
		
		// ToDo: why do we need to check value 
		if (crud.checkAttrValue(collection) && crud.checkAttrValue(document_id)) {

			crud.deleteDocument({ 
				collection, 
				document_id, 
				'metadata': 'deleteDocument-action' 
			});
			
			// ToDo: replace with custom event
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
		
		// ToDo: why do we need to check value
		if (crud.checkAttrValue(collection)) {
			selectedEls.forEach((el) => {
				const document_id =  el.getAttribute('data-document_id');
				
				// ToDo: why do we need to check value 
				if (crud.checkAttrValue(document_id)) {
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
			
			// ToDo: why do we need to check value 
			if (crud.checkAttrValue(collection)) {
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
	

	__saveDocumentAction: async function(btn) {
		const form = btn.closest("form")

		if (!utils.checkFormValidate(form)) {
			alert('Values are not unique');
			return;
		}
		
		await this.__requestDocumentId(form);

		this.modules.forEach(({callback}) => {
			callback.call(null, form);
		})		
	},

	__requestDocumentId: async function (form) {
		
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
		if (!data['document_id']) {
			return;
		}
		let self = this;
		const collection = data['collection'];
		const id = data['document_id']
		
		if (form && id) {
			const elements = form.querySelectorAll(`[data-collection=${collection}], [data-pass_collection=${collection}]`)
			
			elements.forEach(function(el) {
				if (el.hasAttribute('name') && !self.checkID(el)) {
					el.setAttribute('data-document_id', id);
			  	}
			
			  	if (el.hasAttribute('data-pass_to') && !self.checkID(el, 'data-pass_document_id')) {
					el.setAttribute('data-pass_document_id', id);

					// if (el.parentNode.classList.contains('submitBtn')) {
					// 	el.click();
					// }
			  	}
			})
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

// ToDo 
observer.init({ 
	name: 'CoCreateForm', 
	observe: ['attributes'],
	attributeFilter: ['data-collection', 'data-document_id'],
	callback: mutation =>  mutation.target.tagName === "FORM" &&
	// mutation.target.hasAttribute('data-collection') &&
	// mutation.target.hasAttribute('data-document_id') &&
		utils.setAttribute(mutation.target)
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