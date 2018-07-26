import {FileItem, FileUploader, FileUploaderOptions, ParsedResponseHeaders} from 'ng2-file-upload';
import { CreateRulesetComponent } from './create-ruleset.component';

export class FileUploaderCustom extends FileUploader {

	constructor(options: FileUploaderOptions) {
		super(options);
	}


	uploadAllFiles(): void {
		const xhr = new XMLHttpRequest();
		const sendable = new FormData();
		const fakeItem: FileItem = null;
		this.onBuildItemForm(fakeItem, sendable);


		CreateRulesetComponent.showErrorMessage = false;
		CreateRulesetComponent.showSuccessMessage = false;
		CreateRulesetComponent.showStatusMessage = false;
		
		if(this.queue[0] == undefined){
			CreateRulesetComponent.errorMessage = "Please Select 6 upload files...";
			CreateRulesetComponent.showErrorMessage = true;

		}else{
			CreateRulesetComponent.statusMessage = "In Progresssing...";
			CreateRulesetComponent.showStatusMessage = true;
		}

		
		for (const item of this.queue) {
			item.isReady = true;
			item.isUploading = true;
			item.isUploaded = false;
			item.isSuccess = false;
			item.isCancel = false;
			item.isError = false;
			item.progress = 0;

			

			if (typeof item._file.size !== 'number') {
				//return 'The file specified is no longer valid';
				throw new TypeError('The file specified is no longer valid');
			}

			if(item === this.queue[0]){
				sendable.append('refamt', item._file, item.file.name);
				console.log("item:0 refamt " + item._file + "name: " + item.file.name + "bind name: " + item.onBuildForm.bind.name);
			}else if (item === this.queue[1]){
				sendable.append('fop', item._file, item.file.name);
				console.log("item:1 fop " + item._file + "name: " + item.file.name + "indexof item.name: " + item._onBuildForm.name);
			}else if (item === this.queue[2]){
				sendable.append('shortcut', item._file, item.file.name);
				console.log("item:2 shortcut " + item + "name: " + item + "Item: ");
			}else if (item === this.queue[3]){
				sendable.append('thresholds', item._file, item.file.name);
				console.log("item:3 thresholds " + item._file + "name: " + item.file.name + "index: ");
			}else if (item === this.queue[4]){
				sendable.append('init', item._file, item.file.name);
				console.log("item:4 int " + item._file + "name: " + item.file.name + "index: " + item.index);
			}else if (item === this.queue[5]){
				sendable.append('tier', item._file, item.file.name);
				console.log("item:5 tier " + item._file + "name: " + item.file.name + "headers: " + item.headers);
			}
		}

		if (this.options.additionalParameter !== undefined) {
			Object.keys(this.options.additionalParameter).forEach((key) => {
				sendable.append(key, this.options.additionalParameter[key]);
			})
		}

		xhr.onerror = () => {
			//this.onErrorItem(fakeItem, null, xhr.status, null);
			this.onErrorItem = (fakeItem, response, status, headers) => this.onErrorItem(fakeItem, response, xhr.status, headers);
		}
		xhr.onloadend = () => {
			//this.onErrorItem(fakeItem, null, xhr.status, null);
			this.onCompleteItem = (fakeItem, response, status, headers) => this.onSuccessItem(null, response, xhr.status, null);
			//this.onErrorItem = (fakeItem, response, status, headers) => this.onErrorItem(fakeItem, response, xhr.status, headers);
		}

		xhr.onabort = () => {
			this.onErrorItem = (fakeItem, response, status, headers) => this.onErrorItem(fakeItem, response, xhr.status, headers);
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

			};
			
			//this._onCompleteItem(this.queue[0], response, xhr.status, headers);
		}

		xhr.send(sendable);	
	}
	//wma test
	onSuccessItem(item: FileItem, response: string, status: number, headers: null): any {
		let data = JSON.parse(response); //success server response	
		CreateRulesetComponent.successMessage = response;
		CreateRulesetComponent.showSuccessMessage = true;
		CreateRulesetComponent.showErrorMessage = false;
		CreateRulesetComponent.showStatusMessage = false;
	}

	onCompleteItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
		CreateRulesetComponent.errorMessage = response;
	}

	onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
		let error = JSON.parse(response); //error server response
		CreateRulesetComponent.errorMessage = response;
		CreateRulesetComponent.showErrorMessage = true;
		CreateRulesetComponent.showSuccessMessage = false;
		CreateRulesetComponent.showStatusMessage = false;
	}
}
