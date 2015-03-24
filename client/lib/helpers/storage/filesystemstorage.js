FilesystemStorage = function(successCallback, errorCallback) {
    var self = this;
    if(!window.webkitRequestFileSystem) {
        setTimeout(function() {
            errorCallback(new Error('Your browser does not support the Filesystem API.'));
        }, 100);
    } else {
        navigator.webkitPersistentStorage.requestQuota(2*1024*1024*1024 /* 2GB */, function(grantedBytes) {
            window.webkitRequestFileSystem(window.PERSISTENT, grantedBytes, function(filesystem) {
                self.root = filesystem.root;
                successCallback();
            }, errorCallback);
        });
    }
}

FilesystemStorage.prototype.readFile = function(filePath, successCallback, errorCallback) {
    var self = this;
    self.root.getFile(filePath, {}, function(fileEntry) {
        if(successCallback) {
            successCallback(fileEntry);
        }
    }, errorCallback);
}

FilesystemStorage.prototype.readFileFromUrl = function(url, successCallback, errorCallback) {
    window.webkitResolveLocalFileSystemURL(url, successCallback, errorCallback);
}

FilesystemStorage.prototype.createPath = function(path, successCallback, errorCallback) {
    var self = this;
    var createDir = function(root, folders) {
        root.getDirectory(folders[0], {create: true}, function(dirEntry) {
            if(folders.length) {
                createDir(dirEntry, folders.slice(1));
            } else if(successCallback) {
                successCallback(dirEntry);
            }
        }, errorCallback);
    }
    var folders = path.split('/');
    folders.pop();
    createDir(self.root, folders);
}


FilesystemStorage.prototype.writeFile = function(filePath, blob, successCallback, errorCallback) {
    var self = this;
    self.root.getFile(filePath, {create: true, exclusive: true}, function(fileEntry) {
        fileEntry.createWriter(function(fileWriter) {
            fileWriter.onwriteend = function(event) {
                if(successCallback) {
                    successCallback(fileEntry.toURL());
                }
            };
            fileWriter.write(blob);
        }, errorCallback);
    }, function(error) {
        if(error instanceof FileError) {
            if(error.name == 'NotFoundError') {
                self.createPath(filePath, function(dirEntry) {
                    self.writeFile(filePath, blob, successCallback, errorCallback);
                }, errorCallback);
         /* } else if(error.name == 'InvalidModificationError') {
                self.readFile(filePath, successCallback, errorCallback); */
            } else {
                errorCallback(error);
            }
        } else {
            errorCallback(error);
        }
    });
}

FilesystemStorage.prototype.clear = function(successCallback, errorCallback) {
    var self = this;
    var successCallback2 = function() {
        if(successCallback) {
            successCallback();
        }
    }
    var errorCallback2 = function(error) {
        if(errorCallback) {
            errorCallback(error);
        }
    }
    self.root.createReader().readEntries(function(results) {
        for(var i in results) {
            var entry = results[i];
            if(!entry.isFile) {
                entry.removeRecursively(function() {
                }, errorCallback2);
            } else {
                entry.remove(function() {
                }, errorCallback2);
            }
        }

        successCallback2();
    }, function(error) {
        errorCallback2(error);
    });
}
