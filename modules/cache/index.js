/**
 *    _____ __
 *   / ___// /_  _____
 *   \__ \/ / / / / _ \
 *  ___/ / / /_/ /  __/
 * /____/_/\__, /\___/
 *       /____/
 *       Copyright 2017 Slye Development Team. All Rights Reserved.
 *       Licence: MIT License
 */

/**
 * Cache block
 * @param esy
 */
function cache(esy) {
	var cache_pattern   = /^cache\s+(?:(.+)\s+)?([$A-Z_][$A-Z_0-9]*)?\s*\(((?:(?:\s*[$A-Z_][$A-Z_0-9]*\s*)(?:,(?=\s*[$A-Z_]+))?)+)?\)$/ig;
	var key_pattern     = /^key\s*(?:\(((?:(?:\s*[$A-Z_][$A-Z_0-9]*\s*)(?:,(?=\s*[$A-Z_]+))?)+)?\)\s*)?$/ig;
	esy.block.self(key_pattern);
	esy.block(cache_pattern, (matches, block, parent, offset) => {
		var body    = esy.compile(block.body);
		var timer   = matches[1] ? matches[1] : 0;
		var name    = matches[2];
		var args    = matches[3];
		var key     = 'return arguments;';
		var key_args= args;

		var {index} = offset;
		index++;
		var key_r   = new RegExp(key_pattern);
		if(typeof parent[index] == 'object' && key_r.test(parent[index].head)){
			var km  = null;
			while(km == null){
				km = key_r.exec(parent[index].head)
			}
			if(km[1]){
				key_args = km[1];
			}
			key = esy.compile(parent[index].body);
			offset.index++;
		}

		var timer_body  = '';
		if(timer !== 0){
			timer_body = `
			setTimeout(function () {
				delete __esy_cache[key];
			}, parseInt(${timer}));`;
		}

		esy.head('esy-cache-0.0.1', 'var __esy_cache = __esy_cache || {};');
		return `function ${name}(${args}){
			var key   = "${name}-" + JSON.stringify((function(${key_args}){
				${key}
			})(...arguments));
			if(__esy_cache[key])
				return __esy_cache[key];
			var re  = (function(${args}){
				${body}
			})(...arguments);
			__esy_cache[key]    = re;
			${timer_body}
			return re;
		}`
	});

	return {
		name: "Esy Cache",
		version: "0.0.1",
		author: "Slye Development Team"
	};
}
module.exports = cache;