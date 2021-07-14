function stringify(search: SearchType = {}): string {
	let params = ""
	if(typeof search === "string"){
		params = search
	}else{
		params = Object.keys(search).map(k => `${k}=${search[k]}`).join("&")
	}
	return params
}

export default {
	stringify
}