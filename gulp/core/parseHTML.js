const path = require("path");

const {
	store
} = require("../utils");

const {
	RemoveExtension
} = require("../helpers/remove-extension");

const getComponent = require("./getComponent");

module.exports = function (file) {
	const fileName = path.basename(file.path);
	const pageName = RemoveExtension(fileName);

	if (!store.pages[pageName]) {
		const page = (store.pages[pageName] = {
			name: pageName,
			dependencies: {},
			components: {},
			styles: [],
			scripts: []
		});
		getComponent(file, page);

	}
};
