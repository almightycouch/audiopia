PersistentStorage = function() {
    var self = this;
    if(!window.webkitRequestFileSystem) {
        throw new TypeError('Your browser does not support the Filesystem API.');
    }
    navigator.webkitPersistentStorage.requestQuota(2*1024*1024*1024 /* 2GB */, function(grantedBytes) {
        window.webkitRequestFileSystem(window.PERSISTENT, grantedBytes, function(filesystem) {
            self.root = filesystem.root;
        });
    });
}

PersistentStorage.prototype.readFile = function(filePath, successCallback, errorCallback) {
    var self = this;
    self.root.getFile(filePath, {}, function(fileEntry) {
        successCallback(fileEntry);
    }, errorCallback);
}

PersistentStorage.prototype.readFileFromUrl = function(url, successCallback, errorCallback) {
    window.webkitResolveLocalFileSystemURL(url, successCallback, errorCallback);
}

PersistentStorage.prototype.createPath = function(path, successCallback, errorCallback) {
    var self = this;
    var createDir = function(root, folders) {
        root.getDirectory(folders[0], {create: true}, function(dirEntry) {
            if(folders.length) {
                createDir(dirEntry, folders.slice(1));
            } else {
                successCallback(dirEntry);
            }
        }, errorCallback);
    }
    var folders = path.split('/');
    folders.pop();
    createDir(self.root, folders);
}


PersistentStorage.prototype.writeFile = function(filePath, blob, successCallback, errorCallback) {
    var self = this;
    self.root.getFile(filePath, {create: true, exclusive: true}, function(fileEntry) {
        fileEntry.createWriter(function(fileWriter) {
            fileWriter.onwriteend = function(event) {
                successCallback(fileEntry);
            };
            fileWriter.write(blob);
        }, errorCallback);
    }, function(error) {
        if(error instanceof FileError) {
            if(error.name == 'NotFoundError') {
                self.createPath(filePath, function(dirEntry) {
                    self.writeFile(filePath, blob, successCallback, errorCallback);
                }, errorCallback);
            } else if(error.name == 'InvalidModificationError') {
                self.readFile(filePath, successCallback, errorCallback);
            } else {
                errorCallback(error);
            }
        } else {
            errorCallback(error);
        }
    });
}
