import config from './config';

export default function ajax(opts) {
    return window.$.ajax(Object.assign({
        url: `${config.host}${opts.path}`,
        dataType: 'json',
        data: opts.data,
        type: "GET",
        xhrFields: {
      		withCredentials: true
   		}
    }, opts)).catch((err) => {
    	console.error(err);
        //if it's a 401 then redirect to the login.
    	throw(err);
    });
}

export function get(path, data, opts){
	return ajax(Object.assign({
        path: path,
        data: data
    }, opts))
}

export function post(path, data, opts){
	return ajax(Object.assign({
        path: path,
        data: data,
        type: "POST",
    }, opts))
}
