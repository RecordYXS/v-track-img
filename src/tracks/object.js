export default {
    isPlainObject: function(obj) {
		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || {}.toString.call(obj) !== "[object Object]" ) {
			return false;
		}

		let proto = Object.getPrototypeOf(obj);

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if (!proto) {
			return true;
		}

        let hasOwn = {}.hasOwnProperty;
        let fnToString = hasOwn.toString;
        let ObjectFunctionString = fnToString.call(Object);
		// Objects with prototype are plain iff they were constructed by a global Object function
		let Ctor = {}.hasOwnProperty.call(proto, "constructor") && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},
	toQueryString: function(obj) {
		let arr = []

		for (let key in obj) {
			let value = obj[key]
			// extra_parameter、bi_params是对象，将其变成字符串
			if (this.isPlainObject(value)) {
				value = JSON.stringify(value)
			}
			arr.push(key + '=' + encodeURIComponent(value))
		}
		
		return arr.join('&')
	},
	//获取url参数
	getQueryVariable: function(path,variable){
		var query = path.substring(1);
		var vars = query.split("&");
		for (var i=0;i<vars.length;i++) {
				var pair = vars[i].split("=");
				if(pair[0] == variable){return pair[1];}
		}
		return(false);
	},
	guid:function(){
		return 'xxxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		}).toUpperCase();
	},
	sessionid:function(){
		return 'xxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		}).toUpperCase();
	}
}