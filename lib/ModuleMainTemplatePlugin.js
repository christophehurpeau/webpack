/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

const ConcatSource = require("webpack-sources").ConcatSource;

class SetVarMainTemplatePlugin {
	constructor(name) {
		this.name = name;
	}

	apply(compilation) {
		const mainTemplate = compilation.mainTemplate;
		compilation.templatesPlugin("render-with-entry", (source, chunk, hash) => {
			if(this.name) {
				const name = mainTemplate.applyPluginsWaterfall("asset-path", this.name, {
					hash,
					chunk
				});

				return new ConcatSource(`export const ${name} = `, source);
			}
			return new ConcatSource("export default ", source);
		});
		mainTemplate.plugin("global-hash-paths", (paths) => {
			if(this.name) paths.push(this.name);
			return paths;
		});
		mainTemplate.plugin("hash", hash => {
			hash.update("exports module");
			hash.update(`${this.name}`);
		});
	}
}

module.exports = SetVarMainTemplatePlugin;
