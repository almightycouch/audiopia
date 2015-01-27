TemporaryStorage = function() {
    var self = this;
    self.storage = [];
}

TemporaryStorage.prototype.readFile = function(filePath, successCallback, errorCallback) {
    var self = this;
    errorCallback('Not implemented.');
}

TemporaryStorage.prototype.readFileFromUrl = function(url, successCallback, errorCallback) {
    var self = this;
    errorCallback('Not implemented.');
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

