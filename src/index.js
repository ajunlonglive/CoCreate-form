import observer from '@cocreate/observer';
import crud from '@cocreate/crud-client';
import action from '@cocreate/actions';
import CoCreateElements from '@cocreate/elements';

const CoCreateForm = {

	init: function({ name, selector, callback } = {}) {
		const elements = document.querySelectorAll('form');
		this.initElements(elements);
	},

	initElements: function(elements) {
		for(let el of elements)
			this.initElement(el);
	},

	initElement: function(el) {
		this.setAttribute(el);
		this.disableAutoFill(el);
	},
	
	setAttribute: function(form) {
		const { collection, document_id, isCrud, isCrdt, isRealtime, isSave, isUpdate, isRead, isListen, broadcast, broadcastSender } = crud.getAttr(form);
		// const isPassRefresh = form.getAttribute('pass-refresh');
		const isPass_id = form.getAttribute('pass_id');
		let elements = form.querySelectorAll('[name]');
		
		elements.forEach(function(el) {
			if (el.closest('.template')) return;
			if (el.getAttribute('crud') == null && isCrud) {
				el.setAttribute('crud', isCrud);
			}
			if (el.getAttribute('crdt') == null && isCrdt) {
				el.setAttribute('crdt', isCrdt);
			}
			if (el.getAttribute('realtime') == null && isRealtime) {
				el.setAttribute('realtime', isRealtime);
			}
			if (el.getAttribute('save') == null && isSave) {
				el.setAttribute('save', isSave);
			}
			if (el.getAttribute('update') == null && isUpdate) {
				el.setAttribute('update', isUpdate);
			}
			if (el.getAttribute('read') == null && isRead) {
				el.setAttribute('read', isRead);
			}
			if (el.getAttribute('listen') == null && isListen) {
				el.setAttribute('listen', isListen);
			}
			if (el.getAttribute('broadcast') == null && broadcast) {
				el.setAttribute('broadcast', broadcast);
			}
			if (el.getAttribute('broadcast-sender') == null && broadcastSender) {
				el.setAttribute('broadcast-sender', broadcastSender);
			}
			if (el.getAttribute('name') && !el.hasAttribute('collection') && collection) {
				el.setAttribute('collection', collection);
			}
			if (el.getAttribute('name') && !el.getAttribute('document_id') && document_id) {
				el.setAttribute('document_id', document_id);
			}
			if (!el.hasAttribute("document_id") && document_id != null) {
				el.setAttribute('document_id', document_id)
			}
			if (el.getAttribute('pass_id') == null && isPass_id) {
				el.setAttribute('pass_id', isPass_id);
			}
		});
	},
	
	disableAutoFill: function(element) {
		if (element.tagName == "TEXTAREA") {
			element.value = "";
			element.setAttribute("autocomplete","off");
		}
		if (!element.hasAttribute("autocomplete")) {
			element.setAttribute('autocomplete', "off");
		}
	},

	__saveAction: function(btn) {
		const form = btn.closest("form");
		this.save(form);
	},

	save: function(form) {
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
			if(isCrdt === "true" && document_id.match(/^[0-9a-fA-F]{24}$/) || isCrud === "flase" || isSave === "flase") continue;

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
				let {data, updateName, deleteName} = this.getValues(form, item.collection, item.document_id);
				if (!this.isObjectEmpty(data))
					this.updateDocument(form, item.collection, item.document_id, data, updateName, deleteName);
			}
		}
	},
	
	isObjectEmpty:  function(obj) { 
	   for (var x in obj) { return false; }
	   return true;
	},			


	updateDocument: async function(form, collection, document_id, data, updateName, deleteName) {
		if(document_id == "pending") return;
		let { namespace, room, broadcast, broadcastSender } = crud.getAttr(form);
		if(crud.checkAttrValue(collection)) {
			crud.updateDocument({
				namespace,
				room,
				collection,
				document_id,
				data,
				upsert: true,
				broadcast,
				broadcastSender,
				updateName,
				deleteName
			});
		}
		if(!updateName && !deleteName && window.CoCreate.crdt) {
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
		document.dispatchEvent(new CustomEvent('saved', {
			detail: {}
		}));
	},

	createDocuments: function(form, collections) {
		if(collections.length > 0) {
			for(let collection of collections) {

				let {data} = this.getValues(form, collection)
				delete data._id;
				this.createDocument(form, collection, data);
			}
		}
		else {
			document.dispatchEvent(new CustomEvent('saved', {
				detail: {}
			}));
		}
	},

	createDocument: async function(form, collection, data) {
		// if(crud.checkAttrValue(collection)) {
			let response = await crud.createDocument({
				'collection': collection,
				'data': data,
			});
			this.setDocumentId(form, response);
			document.dispatchEvent(new CustomEvent('saved', {
				detail: {}
			}));
		// }
	},

	setDocumentId: function(form, data) {
		if(!data) return;
		const collection = data['collection'];
		const id = data['document_id'];
		const pass_ids = new Map();
		
		let pass_id = form.getAttribute('pass_id');
		if(pass_id) {
			if(form.getAttribute('collection') == collection)
				pass_ids.set(pass_id, '');
		}
		
		if(form && id) {
			const elements = form.querySelectorAll(`[collection=${collection}], [pass-collection=${collection}]`);

			elements.forEach(function(el) {
				let documentId = el.getAttribute('document_id');
				if(el.hasAttribute('name') && (documentId == '' || documentId == 'pending')) {
					el.setAttribute('document_id', id);
					let pass_id = el.getAttribute('pass_id');
					if(pass_id) {
						pass_ids.set(pass_id, '');
					}
				}
				
				if (el.hasAttribute('pass-document_id')){
					if(!crud.checkAttrValue(el.getAttribute('pass-document_id'))) {
						el.setAttribute('pass-document_id', id);
						let pass_id = el.getAttribute('pass_id');
						if(pass_id) {
							pass_ids.set(pass_id, '');
						}
					}
				}
			});
			
			if (pass_ids.size > 0){
				for (let key of pass_ids.keys()){
					let passEls = document.querySelectorAll(`[pass_id="${key}"]`)
					for (let passEl of passEls){
						// if (passEl.getAttribute('collection') == collection){
							if (passEl.getAttribute('document_id') == '') {
								passEl.setAttribute('document_id', id);
							}
						// }
					}
				}
			}
		}
	},
	
	getValues: function(form, collection, document_id = '') {
		let selector, data = {}, updateName = {}, deleteName = {};
		if (document_id)
			selector = `[collection='${collection}'][document_id='${document_id}']`;
		else
			selector = `[collection='${collection}'][document_id]`;
		let inputs = form.querySelectorAll(selector);
		for (let input of inputs) {
			let name = input.getAttribute('name');
			if(name && name != '_id'){
				if (input.getValue || input.value) {
					let value = input.getValue();
					let valueType = input.getAttribute('value-type');
					if(value && valueType == 'object' || value && valueType == 'json')
						value = JSON.parse(value)
					if (value)
						data[name] = value;
				}
			}

			let $updateName = input.getAttribute('updateName');
			if($updateName && !['_id', 'organization_id',].includes($updateName)){
				if (input.getValue || input.value) {
					let value = input.getValue();
					if(value)
					updateName[$updateName] = value;
				}
			}

			let $deleteName = input.getAttribute('deleteName');
			if($deleteName && !['_id', 'organization_id',].includes($deleteName)){
				deleteName[$deleteName] = '';
			}
		}
		return {data, deleteName, updateName};
	},
	
	getCollections: function(form) {
		let collections = [];
		if (!form) return collections;

		let els = form.querySelectorAll('[name][collection]');
		els.forEach((el) => {
			let tmpCollection = el.getAttribute('collection');
			if (tmpCollection && !collections.includes(tmpCollection)) {
				collections.push(tmpCollection);
			} 
		});
		return collections;
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

	updateNameAction: function(btn) {
		const { collection, document_id, updateName, namespace, room, broadcast, broadcastSender } = crud.getAttr(btn);

		if(updateName && crud.checkAttrValue(collection) && crud.checkAttrValue(document_id)) {
			let value = btn.getValue()
			if (value) {
				let updateName = {[updateName]: value}
				
				crud.updateDocument({
					namespace,
					room,
					collection,
					document_id,
					updateName,
					broadcast,
					broadcastSender
				});			
				// ToDo: replace with custom event
				document.dispatchEvent(new CustomEvent('updateName', {
					detail: {}
				}));
			}
		}
	},

	deleteNameAction: function(btn) {
		const { collection, document_id, deleteName, namespace, room, broadcast, broadcastSender } = crud.getAttr(btn);

		if(deleteName && crud.checkAttrValue(collection) && crud.checkAttrValue(document_id)) {
			crud.updateDocument({
				namespace,
				room,
				collection,
				document_id,
				deleteName: {[deleteName]: ''},
				broadcast,
				broadcastSender
			});			
			// ToDo: replace with custom event
			document.dispatchEvent(new CustomEvent('deleteName', {
				detail: {}
			}));
		}
	},
	
	__resetForm: function(btn) {
		const form = btn.closest("form");
		let elements = form.querySelectorAll('[document_id]');
		for (let element of elements){
			element.setAttribute('document_id', '');
		}
		form.reset();
		document.dispatchEvent(new CustomEvent('reset', {
			detail: {}
		}));
	},

	collectionAction: function(btn, action) {
		let collection = btn.getAttribute('collection');
		let form = btn.closest("form")
		if (!collection && form) {
			let input = form.querySelector('[name="collection"]')
			if (input)
				collection = input.getValue()
		}
		let target = "";
		if (action == 'updateCollection') {
			target = btn.getAttribute('target')
			if (!target && form) {
				let input = form.querySelector('[name="target"]')
				if (input)
					target = input.getValue()
			}    
			if(!crud.checkAttrValue(target)) 
				return
		}
		if(crud.checkAttrValue(collection)) {
			crud[action]({collection, target});
	
			// ToDo: replace with custom event
			document.dispatchEvent(new CustomEvent(action, {
				detail: {}
			}));
		}
	}
	
};

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
		CoCreateForm.setAttribute(mutation.target)
});

action.init({
	name: "deleteDocument",
	endEvent: "deletedDocument",
	callback: (btn, data) => {
		CoCreateForm.__deleteDocumentAction(btn);
	}
});

action.init({
	name: "save",
	endEvent: "saved",
	callback: (btn, data) => {
		CoCreateForm.__saveAction(btn);
	}
});

action.init({
	name: "reset",
	endEvent: "reset",
	callback: (btn, data) => {
		CoCreateForm.__resetForm(btn);
	}
});

action.init({
	name: "updateName",
	endEvent: "updateName",
	callback: (btn, data) => {
        CoCreateForm.updateNameAction(btn, "updateName")
	}
});

action.init({
	name: "deleteName",
	endEvent: "deleteName",
	callback: (btn, data) => {
        CoCreateForm.deleteNameAction(btn, "deleteName")
	}
});

action.init({
	name: "createCollection",
	endEvent: "createCollection",
	callback: (btn, data) => {
        CoCreateForm.collectionAction(btn, "createCollection")
	}
});

action.init({
	name: "updateCollection",
	endEvent: "updateCollection",
	callback: (btn, data) => {
        CoCreateForm.collectionAction(btn, "updateCollection")
	}
});

action.init({
	name: "deleteCollection",
	endEvent: "deleteCollection",
	callback: (btn, data) => {
        CoCreateForm.collectionAction(btn, "deleteCollection")
	}
});


CoCreateForm.init();

export default CoCreateForm;
