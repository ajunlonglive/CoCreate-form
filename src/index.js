import observer from '@cocreate/observer'
import crud from '@cocreate/crud-client'
import action from '@cocreate/action'
import utils from "./utils"

const CoCreateForm = {

	components: [],

	init: function({name, selector, callback} ={}) {
		name && callback && this.components.push({
			name,
			callback
		});

		const elements = document.querySelectorAll( 'form');
		this.initElements(elements)

	},

	initElements: function(elements) {
		for (let el of elements)
			this.initElement(el)
	},

	initElement: function(el) {
		utils.setAttribute(el)
		utils.disableAutoFill(el);
	},

	__saveAction: function(btn) {
		const form = btn.closest("form")
		this.save(form);
	},
	
	save: function(form) {
		if (!utils.checkFormValidate(form)) {
			alert('Values are not unique');
			return;
		}

		this.__requestDocumentId(form);
		
		this.components.forEach(({	callback }) => {
			callback.call(null, form);
		})
	},
	
	__requestDocumentId: async function(form) {

		let self = this;
		let elements = form.querySelectorAll('[data-collection][data-document_id][name], [data-pass_to]')

		let collections = [];

		for (var i = 0; i < elements.length; i++) {
			let el = elements[i];
			if (el.parentNode.classList.contains('template')) {
				continue;
			}
			const collection = el.getAttribute("data-collection") || el.getAttribute("data-pass_collection") || "";

			if (
				collection !== "" &&
				!collections.includes(collection) &&
				(!crud.checkAttrValue(el.getAttribute('data-document_id')) && !crud.checkAttrValue(el.getAttribute('data-pass_document_id')))
			) {

				collections.push(collection);
				
				// ToDo: get values of all registered form.init components
				let data = utils.getFormData(form, "", collection);
				if (Object.keys(data).length == 0 && data.constructor === Object) {
					return;
				}
				
				let response_data = await crud.createDocument({
					"collection": collection,
					'data': data,
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
				if (el.hasAttribute('name') && !crud.checkAttrValue(el.getAttribute('data-document_id'))) {
					el.setAttribute('data-document_id', id);
				}

				if (el.hasAttribute('data-pass_to') && !crud.checkAttrValue(el.getAttribute('data-pass_document_id'))) {
					el.setAttribute('data-pass_document_id', id);

				}
			})
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
					'metadata': 'createDocument-action',
					'element': 'empty'
				});
				document.dispatchEvent(new CustomEvent('createdDocument', {
					detail: {}
				}))
			}
		})
	},

	__deleteDocumentAction: function(btn) {
		const {
			collection,
			document_id
		} = crud.getAttr(btn)

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
		const collection = btn.getAttribute('data-collection');
		if (crud.checkAttrValue(collection)) {
			const dataTemplateid = btn.getAttribute('data-template_id');
			if (!dataTemplateid) return;

			const selectedEls = document.querySelectorAll(`.selected[templateid="${dataTemplateid}"]`)

			selectedEls.forEach((el) => {
				const document_id = el.getAttribute('data-document_id');

				if (crud.checkAttrValue(document_id)) {
					crud.deleteDocument({
						collection,
						document_id,
						'metadata': ''
					})
				}
			})

			document.dispatchEvent(new CustomEvent('deletedDocuments', {
				detail: {}
			}))
		}
	},

}

CoCreateForm.init();

observer.init({
	name: 'CoCreateForm',
	observe: ['addedNodes'],
	target: 'form',
	callback: mutation => mutation.target.tagName === "FORM" &&
		CoCreateForm.initElement(mutation.target)

})

observer.init({
	name: 'CoCreateForm',
	observe: ['attributes'],
	attributeName: ['data-collection', 'data-document_id'],
	target: 'form',
	callback: mutation => mutation.target.tagName === "FORM" &&
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
		CoCreateForm.__deleteDocumentsAction(btn)
	},
})

action.init({
	action: "saveDocument",
	endEvent: "savedDocument",
	callback: (btn, data) => {
		CoCreateForm.__saveAction(btn)
	},
})

export default CoCreateForm;
