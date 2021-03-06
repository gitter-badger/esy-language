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

const fs        = require('fs');
const path      = require('path');
const md5       = require('md5');
const EsyError  = require('../libs/errors/esy_error');

global.configs  = global.configs    || {
		file    : 'esy.json',
		configs : {},
		defaults: {},
		run: {}
	};

/**
 * Load configs from given file
 * @param filename
 */
function load(filename = 'esy.json'){
	var e, file;
	if(fs.existsSync(filename)){
		if(!fs.lstatSync(filename).isFile()){
			e   = new EsyError('It seems config src <'+filename+'> is not a file, maybe it\'s a directory or something else.');
			throw e;
		}
		file    = fs.readFileSync(filename);
		try {
			global.configs.configs  = JSON.parse(file);
		} catch (e){
			// e   = new EsyError('Config file is not a valid JSON string.');
			// throw e;
			// fs.writeFileSync(filename, JSON.stringify({}, null, 4));
		}
	}else{
		// fs.writeFileSync(filename, JSON.stringify({}, null, 4))
	}
	global.configs.file = path.join(process.cwd(), filename);
}

/**
 * Set object's element to an special value using element's path
 * @param data
 * @param name
 * @param value
 */
function setByPath(data, name, value){
	var path    = name.split('.');
	var d       = data;
	for(var i   = 0;i < path.length - 1;i++){
		if(typeof d[path[i]] !== 'object'){
			if(typeof d[path[i]] == 'undefined')
				d[path[i]]  = {};
			else
				d[path[i]]  = {__val: d[path[i]]}
		}
		d   = d[path[i]];
	}
	if(typeof d[path[path.length - 1]] == 'object' && typeof value !== 'object'){
		d[path[path.length - 1]].__val  = value;
	}else {
		d[path[path.length - 1]]    = value;
	}
}

/**
 * Set a config's element to an special value
 * @param name
 * @param value
 * @param save
 */
function set(name, value, save = true) {
	if (!save)
		return run(name, value);
	setByPath(global.configs.configs, name, value);
	// Save change instantly
	if (global.configs.file)
		fs.writeFile(global.configs.file, JSON.stringify(global.configs.configs, null, 4))
}

/**
 * Return value from an object
 * @param data
 * @param name
 * @returns {*}
 */
function getByPath(data, name){
	var path    = name.split('.');
	var d       = data;
	for(var i   = 0;i < path.length - 1;i++){
		if(typeof d[path[i]] !== 'object'){
			return undefined;
		}
		d   = d[path[i]];
	}
	if(typeof d[path[path.length - 1]] == 'object') {
		if(d[path[path.length - 1]].__val){
			return d[path[path.length - 1]].__val;
		}else {
			return d[path[path.length - 1]];
		}
	}else {
		if(d[path[path.length - 1]] == undefined){
			return undefined;
		}else {
			return d[path[path.length - 1]];
		}
	}
}

/**
 * Returns value from configs if value does not exists the default value will return.
 * @param name
 * @returns {*}
 */
function get(name) {
	var run = getByPath(global.configs.run, name);
	if (run === undefined) {
		var re = getByPath(global.configs.configs, name);
		var def = getByPath(global.configs.defaults, name);
		if (re === undefined)
			return def;
		if (typeof re == 'object' && typeof def == 'object') {
			var keys = Object.keys(def);
			for (var key of keys) {
				if (!re.hasOwnProperty(key))
					re[key] = def[key]
			}
		}
		return re;
	}
	return run;
}

/**
 * Set default config value
 * @param name
 * @param value
 */
function def(name, value){
	setByPath(global.configs.defaults, name, value);
}

/**
 * Set a config value but don't save it to config's file, (just in run time)
 * @param name
 * @param value
 */
function run(name, value) {
	setByPath(global.configs.run, name, value);
}

/**
 * Hash configs
 */
function hash() {
	return md5(JSON.stringify([global.configs.configs, global.configs.defaults, global.configs.run]));
}

module.exports  = {
	load: load,
	set : set,
	get : get,
	def : def,
	run : run,
	hash: hash,
	file: () => global.configs.file
};