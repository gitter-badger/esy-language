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

// Load required modules
const EsyError  = require('../libs/errors/esy_error');
/**
 * Setup a global variable to store all blocks and it'll be accessible in all program's scope
 * @type []
 */
global.blocks   = global.blocks     || [];
global.patterns = global.patterns   || [];

/**
 *
 * @param esy
 */
function add(esy){
	/**
	 * Add a new block recognizer with custom headline pattern
	 * @param pattern   Regex pattern to identify the header
	 * @param callback  method(matches, block, parent, offset)
	 */
	function Block(pattern, callback){
		if(typeof callback !== 'function')
			throw new EsyError('Error adding new block parser, callback must be type of function');
		global.patterns.push(pattern);
		global.blocks.push(callback);
	}
	Block['self'] = (pattern) => {
		Block(pattern, (matches, block) => {
			return block.head + '{' + esy.compile(block.body) + '}';
		})
	};
	return Block;
}

/**
 * Find the parser for given block headline
 * @param headline
 * @returns {{matches: *, parser: *}}
 */
function search(headline) {
	var i;
	for(i = global.patterns.length - 1; i >= 0;i--){
		var p   = new RegExp(global.patterns[i]);
		if(p.test(headline)){
			// I don't have any idea why it's happening!?
			// the RegExp.exec always returns null at first call :|
			var matches = p.exec(headline);
			while(matches == null){
				matches = p.exec(headline);
			}
			return {
				matches : matches,
				parser  : global.blocks[i]
			}
		}
	}
}

/**
 * Return the longest matched pattern for a code
 * @see Tree (../libs/tree/index.js)
 * @param code
 * @return {number}
 */
function find(code){
	var newRegExp   = pattern => {
		var flags   = pattern.flags,
			source  = pattern.source;
		// Remove ^ from first of source
		if(source[0] == '^')
			source  = '(?:[;\s]|^)' + source;
		// Add $ to the end of source if not exists
		if(!source.endsWith('$'))
			source  += '$';
		return new RegExp(source, flags);
	};
	var results     = [], i;
	for(i = 0; i < global.patterns.length;i++){
		var p   = newRegExp(global.patterns[i]);
		if(p.test(code)){
			var matches = p.exec(code);
			results.push(matches[0]);
		}
	}
	return Math.max(...results);
}

module.exports  = {
	add     : add,
	search  : search,
	find    : find
};