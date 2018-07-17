import {FileItem, FileUploader, FileUploaderOptions} from 'ng2-file-upload';

export class FileUploaderCustom extends FileUploader {

	constructor(options: FileUploaderOptions) {
		super(options);
	}

	uploadAllFiles(): void {
		const xhr = new XMLHttpRequest();
		const sendable = new FormData();
		const fakeItem: FileItem = null;
		this.onBuildItemForm(fakeItem, sendable);

		console.log("get into uplodadAllFiles...01");

		for (const item of this.queue) {
			item.isReady = true;
			item.isUploading = true;
			item.isUploaded = false;
			item.isSuccess = false;
			item.isCancel = false;
			item.isError = false;
			item.progress = 0;

			if (typeof item._file.size !== 'number') {
				throw new TypeError('The file specified is no longer valid');
			}

			if(item === this.queue[0]){
				sendable.append('refamt', item._file, item.file.name);
			}else if (item === this.queue[1]){
				sendable.append('fop', item._file, item.file.name);
			}else if (item === this.queue[2]){
				sendable.append('shortcut', item._file, item.file.name);
			}else if (item === this.queue[3]){
				sendable.append('thresholds', item._file, item.file.name);
			}else if (item === this.queue[4]){
				sendable.append('init', item._file, item.file.name);
			}else if (item === this.queue[5]){
				sendable.append('tier', item._file, item.file.name);
			}
		}

		console.log("get into uplodadAllFiles...02");
		if (this.options.additionalParameter !== undefined) {
			Object.keys(this.options.additionalParameter).forEach((key) => {
				sendable.append(key, this.options.additionalParameter[key]);
			})
		}

		xhr.onerror = () => {
			this.onErrorItem(fakeItem, null, xhr.status, null);
			console.log("get into uplodadAllFiles...03" + xhr.status);
		}

		xhr.onabort = () => {
			console.log("get into uplodadAllFiles...04" + xhr.response);
			this.onErrorItem(fakeItem, null, xhr.status, null);
		}

		xhr.open('POST', this.options.url, true);
		xhr.withCredentials = true;
		if (this.options.headers) {
			for (let _i = 0, _a = this.options.headers; _i < _a.length; _i++) {
				const header = _a[_i];
				xhr.setRequestHeader(header.name, header.value);
			}
		}
		if (this.authToken) {
			xhr.setRequestHeader(this.authTokenHeader, this.authToken);
		}

		xhr.onload = () => {
			const headers = this._parseHeaders(xhr.getAllResponseHeaders());
			const response = this._transformResponse(xhr.response, headers);
			const gist = this._isSuccessCode(xhr.status) ? 'Success' : 'Error';
			const method = '_on' + gist + 'Item';
			for (const item of this.queue) {
				this[method](item, response, xhr.status, headers);

			}
			this._onCompleteItem(this.queue[0], response, xhr.status, headers);
		}

		xhr.send(sendable);
		
	}
}
