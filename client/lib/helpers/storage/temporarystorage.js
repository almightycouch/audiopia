TemporaryStorage = function() {
    var self = this;
    self.storage = [];
}

TemporaryStorage.prototype.readFile = function(filePath, successCallback, errorCallback) {
    var self = this;
    for(var i in self.storage) {
        if(self.storage[i].path == filePath) {
            return self.readFileFromUrl(self.storage[i].dataUrl, successCallback, errorCallback);
        }
    }
    errorCallback(new Error('No file found for the given path.'));
}

TemporaryStorage.prototype.readFileFromUrl = function(url, successCallback, errorCallback) {
    var self = this;
    var request = new XMLHttpRequest();
    request.open('GET', url, true); 
    request.responseType = 'blob';
    request.onerror = errorCallback;
    request.onload = function(event) {
        successCallback(new Blob([this.response]));
    }
    request.send();
}

TemporaryStorage.prototype.writeFile = function(filePath, blob, successCallback, errorCallback) {
    var self = this;
    var url = URL.createObjectURL(blob);
    self.storage.push({ path: filePath, dataUrl: url }); 
    successCallback(url);
}

TemporaryStorage.prototype.clear = function(successCallback, errorCallback) {
    var self = this;
    self.storage = [];
    successCallback();
}

