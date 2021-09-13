import observer from '@cocreate/observer';
import crud from '@cocreate/crud-client';
import action from '@cocreate/action';
import utils from "./utils";

const CoCreateForm = {

	components: [],

	init: function({ name, selector, callback } = {}) {
		name && callback && this.components.push({
			name,
			callback
		});

		const elements = document.querySelectorAll('form');
		this.initElements(elements);

	},

	initElements: function(elements) {
		for(let el of elements)
			this.initElement(el);
	},

	initElement: function(el) {
		utils.setAttribute(el);
		utils.disableAutoFill(el);
	},

	__saveAction: function(btn) {
		const form = btn.closest("form");
		this.save(form);
	},

	save: function(form) {
		if(!utils.checkFormValidate(form)) {
			alert('Values are not unique');
			return;
		}
		this.__requestDocumentId(form);
	},

	__requestDocumentId: function(form) {
		let selector = `[collection][document_id][name]`;
		let selectors = `input${selector}, textarea${selector}, [contenteditable]${selector}:not([contenteditable='false'])`;
		let elements = form.querySelectorAll(selectors);

		let collections = [];
		let document_ids = [];

		for(let el of elements) {
		// for(var i = 0; i < elements.length; i++) {
		// 	let el = elements[i];
			if(el.parentNode.classList.contains('template')) continue;
			
			const { collection, document_id, name, isCrdt, isCrud, isSave, isUpdate } = crud.getAttr(el);
			if(isCrdt === "true" && document_id || isCrud === "flase" || isSave === "flase") continue;

			if(!crud.checkAttrValue(collection) && !crud.checkAttrValue(document_id)) continue;
			if(collection !== "" && !collections.includes(collection) && (document_id == '' || document_id == 'pending')) {
				collections.push(collection);
			}
			else {
				if(document_id == "" || document_id == "pending" || isUpdate === "false") continue;
				if(document_ids.includes(document_id)) continue;
				if(collection && document_id && name) {
					document_ids.push({ document_id: document_id, collection: collection });
				}
			}
		}
		this.updateDocuments(form, document_ids);
		this.createDocuments(form, collections);
	},


	updateDocuments: function(form, document_ids) {
		if(document_ids.length > 0) {
			for(let item of document_ids) {

				let data = {};
				this.components.forEach(({ callback }) => {
					let result = callback.call(null, form, item.collection, item.document_id);
					Object.assign(data, result);
				});
				if (!this.isObjectEmpty(data))
					this.updateDocument(form, item.collection, item.document_id, data);
			}
		}
	},
	
	isObjectEmpty:  function(obj) { 
	   for (var x in obj) { return false; }
	   return true;
	},			


	updateDocument: async function(form, collection, document_id, data) {
		if(document_id == "pending") return;
		let { namespace, room, broadcast, broadcast_sender } = crud.getAttr(form);
		if(crud.checkAttrValue(collection)) {
			crud.updateDocument({
				namespace,
				room,
				collection,
				document_id,
				data,
				upsert: true,
				broadcast,
				broadcast_sender,
				is_flat: true,
			});
		}
		if(window.CoCreate.crdt) {
			for(const [key, value] of Object.entries(data)) {
				window.CoCreate.crdt.replaceText({
					collection,
					name: `${key}`,
					document_id,
					value: `${value}`,
					crud: false
				});
			}
		}
		// this.setDocumentId(form, response);
		document.dispatchEvent(new CustomEvent('savedDocument', {
			detail: {}
		}));
	},

	createDocuments: function(form, collections) {
		if(collections.length > 0) {
			for(let collection of collections) {

				let data = {};
				this.components.forEach(({ callback }) => {
					let result = callback.call(null, form, collection);
					Object.assign(data, result);
				});
				delete data._id;
				this.createDocument(form, collection, data);
			}
		}
		else {
			document.dispatchEvent(new CustomEvent('savedDocument', {
				detail: {}
			}));
		}
	},

	createDocument: async function(form, collection, data) {
		// if(crud.checkAttrValue(collection)) {
			let response = await crud.createDocument({
				'collection': collection,
				'data': data,
				'is_flat': true
			});
			this.setDocumentId(form, response);
			document.dispatchEvent(new CustomEvent('savedDocument', {
				detail: {}
			}));
		// }
	},

	setDocumentId: function(form, data) {
		if(!data) return;
		const collection = data['collection'];
		const id = data['document_id'];

		if(form && id) {
			const elements = form.querySelectorAll(`[collection=${collection}], [pass-collection=${collection}]`);

			elements.forEach(function(el) {
				let documentId = el.getAttribute('document_id');
				if(el.hasAttribute('name') && (documentId == '' || documentId == 'pending')) {
					el.setAttribute('document_id', id);
				}

				if(!crud.checkAttrValue(el.getAttribute('pass-document_id'))) {
					el.setAttribute('pass-document_id', id);
				}
			});
		}
	},

	__createAction: function(btn) {
		const form = btn.closest("form");
		let collections = utils.getCOllections(form);

		collections.forEach((collection) => {
			let data = utils.getFormData(form, "", collection);

			if(Object.keys(data).length == 0 && data.constructor === Object) {
				return;
			}
			crud.createDocument({
				'collection': collection,
				'data': data,
			});
		});

		document.dispatchEvent(new CustomEvent('createdDocument', {
			detail: {}
		}));
	},

	__createDocumentAction: function(btn) {
		const form = btn.closest("form");
		let collections = utils.getCOllections(form);

		collections.forEach((collection) => {
			let data = utils.getFormData(form, "", collection);

			if(Object.keys(data).length == 0 && data.constructor === Object) {
				return;
			}

			if(crud.checkAttrValue(collection)) {
				crud.createDocument({
					'collection': collection,
					'data': data,
					'metadata': 'createDocument-action',
					'element': 'empty'
				});
				document.dispatchEvent(new CustomEvent('createdDocument', {
					detail: {}
				}));
			}
		});
	},

	__deleteDocumentAction: function(btn) {
		const { collection, document_id } = crud.getAttr(btn);

		if(crud.checkAttrValue(collection) && crud.checkAttrValue(document_id)) {

			crud.deleteDocument({
				collection,
				document_id,
				'metadata': 'deleteDocument-action'
			});

			// ToDo: replace with custom event
			document.dispatchEvent(new CustomEvent('deletedDocument', {
				detail: {}
			}));
		}
	},

	__deleteDocumentsAction: function(btn) {
		const collection = btn.getAttribute('collection');
		if(crud.checkAttrValue(collection)) {
			const dataTemplateid = btn.getAttribute('template_id');
			if(!dataTemplateid) return;

			const selectedEls = document.querySelectorAll(`.selected[templateid="${dataTemplateid}"]`);

			selectedEls.forEach((el) => {
				const document_id = el.getAttribute('document_id');

				if(crud.checkAttrValue(document_id)) {
					crud.deleteDocument({
						collection,
						document_id,
						'metadata': ''
					});
				}
			});

			document.dispatchEvent(new CustomEvent('deletedDocuments', {
				detail: {}
			}));
		}
	},

};

CoCreateForm.init();

observer.init({
	name: 'CoCreateForm',
	observe: ['addedNodes'],
	target: 'form',
	callback: mutation => mutation.target.tagName === "FORM" &&
		CoCreateForm.initElement(mutation.target)

});

observer.init({
	name: 'CoCreateForm',
	observe: ['attributes'],
	attributeName: ['collection', 'document_id'],
	target: 'form',
	callback: mutation => mutation.target.tagName === "FORM" &&
		utils.setAttribute(mutation.target)
});

action.init({
	action: "createDocument",
	endEvent: "createdDocument",
	callback: (btn, data) => {
		CoCreateForm.__createDocumentAction(btn);
	}
});

action.init({
	action: "deleteDocument",
	endEvent: "deletedDocument",
	callback: (btn, data) => {
		CoCreateForm.__deleteDocumentAction(btn);
	}
});

action.init({
	action: "deleteDocuments",
	endEvent: "deletedDocuments",
	callback: (btn, data) => {
		CoCreateForm.__deleteDocumentsAction(btn);
	}
});

action.init({
	action: "saveDocument",
	endEvent: "savedDocument",
	callback: (btn, data) => {
		CoCreateForm.__saveAction(btn);
	}
});

export default CoCreateForm;
