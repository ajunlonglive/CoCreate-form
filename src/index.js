import observer from '@cocreate/observer'
import crud from '@cocreate/crud-client'
import action from '@cocreate/action'
import utils from "./utils"

const CoCreateForm = {

	components: [],

	init: function({ name, selector, callback } = {}) {
		name && callback && this.components.push({
			name,
			callback
		});

		const elements = document.querySelectorAll('form');
		this.initElements(elements)

	},

	initElements: function(elements) {
		for(let el of elements)
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
		if(!utils.checkFormValidate(form)) {
			alert('Values are not unique');
			return;
		}

		this.__requestDocumentId(form);

	},

	__requestDocumentId: async function(form) {

		let self = this;
		let elements = form.querySelectorAll('[collection][document_id][name], [pass_to]')

		let collections = [];
		let document_ids = [];

		for(var i = 0; i < elements.length; i++) {
			let el = elements[i];
			if(el.parentNode.classList.contains('template')) {
				continue;
			}
			const { document_id, isCrdt, isCrud, isSave, isUpdate } = crud.getAttr(el)
			if(isCrdt === "true" && document_id || isCrud === "flase" || isSave === "flase") continue;
			const collection = el.getAttribute("collection") || el.getAttribute("pass-collection") || "";

			if(
				collection !== "" &&
				!collections.includes(collection) &&
				(!crud.checkAttrValue(el.getAttribute('document_id')) && !crud.checkAttrValue(el.getAttribute('pass-document_id')))
			) {

				collections.push(collection);

			}
			else {
				const { collection, document_id, name } = crud.getAttr(el)
				if(collection && document_id && name) {
					if(isUpdate === "false") continue;
					document_ids.push(document_id);
				}
			}
		}
		this.createDocuments(form, collections)
		this.updateDocuments(form, document_ids)
	},

	createDocuments: function(form, collections) {
		for(let collection of collections) {

			let data = {};
			this.components.forEach(({ callback }) => {
				let result = callback.call(null, form, collection)
				Object.assign(data,result)
			})

			 this.createDocument(collection, data).then(data => {
				this.setDocumentId(form, data)
			})


		}
	},

	updateDocuments: function(form, document_ids) {
		for(let document_id of document_ids) {
			let data = {};
			
			this.components.forEach(({ callback }) => {
				let result = callback.call(null, form, document_id)
				Object.assign(data,result)
			})
			
			// let element = data[element]

			// this.crud.save(element, data).then(data => {
				// this.setDocumentId(form, data)
			// })

			// crud.save(document_id)
		}
	},

	createDocument: async function(collection, data) {
		if(crud.checkAttrValue(collection)) {
			return await crud.createDocument({
				'collection': collection,
				'data': data,
			});
		}
	},

	setDocumentId: function(form, data) {
		if(!data['document_id']) {
			return;
		}
		let self = this;
		const collection = data['collection'];
		const id = data['document_id']

		if(form && id) {
			const elements = form.querySelectorAll(`[collection=${collection}], [pass-collection=${collection}]`)

			elements.forEach(function(el) {
				if(el.hasAttribute('name') && !crud.checkAttrValue(el.getAttribute('document_id'))) {
					el.setAttribute('document_id', id);
				}

				if(el.hasAttribute('pass_to') && !crud.checkAttrValue(el.getAttribute('pass-document_id'))) {
					el.setAttribute('pass-document_id', id);

				}
			})
		}
	},

	__createAction: function(btn) {
		const form = btn.closest("form")
		const self = this;
		let collections = utils.getCOllections(form)

		collections.forEach((collection) => {
			let data = utils.getFormData(form, "", collection);

			if(Object.keys(data).length == 0 && data.constructor === Object) {
				return;
			}
			self.createDocument(collection, data)
		})

		document.dispatchEvent(new CustomEvent('createdDocument', {
			detail: {}
		}))
	},

	__createDocumentAction: function(btn) {
		const form = btn.closest("form")
		const self = this;
		let collections = utils.getCOllections(form)

		collections.forEach((collection) => {
			let data = utils.getFormData(form, "", collection);

			if(Object.keys(data).length == 0 && data.constructor === Object) {
				return;
			}

			// ToDo: why do we need to check value 
			if(crud.checkAttrValue(collection)) {
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
		if(crud.checkAttrValue(collection) && crud.checkAttrValue(document_id)) {

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
		const collection = btn.getAttribute('collection');
		if(crud.checkAttrValue(collection)) {
			const dataTemplateid = btn.getAttribute('template_id');
			if(!dataTemplateid) return;

			const selectedEls = document.querySelectorAll(`.selected[templateid="${dataTemplateid}"]`)

			selectedEls.forEach((el) => {
				const document_id = el.getAttribute('document_id');

				if(crud.checkAttrValue(document_id)) {
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
	attributeName: ['collection', 'document_id'],
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
