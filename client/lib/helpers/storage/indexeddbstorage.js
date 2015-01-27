IndexedDBStorage = function() {
    var self = this;

    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    if(!window.indexedDB) {
        throw new Error('Your browser does not support the IndexedDB API.');
    } else if(false) { // TODO
        throw(new Error('Your browser does not support the IndexedDB Blob storage feature.'));
    }

    self._urlPrefix = 'indexeddb:' + window.location.origin + '/persistent/';

    var request = window.indexedDB.open('audiopia', 1);
    request.onsuccess = function(event) {
        self.db = request.result;
        self.db.onerror = function(event) {
            console.warn('Database error', event.target.errorCode);
        }
    }
    request.onupgradeneeded = function(event) {
        var objectStore = request.result.createObjectStore('music');
    }
    request.onerror = function(event) {
        console.warn('IndexedDB error', request.errorCode);
    }
}

IndexedDBStorage.prototype.readFile = function(filePath, successCallback, errorCallback) {
    var self = this;
    var transaction = self.db.transaction(['music'], 'readwrite');
    transaction.onerror = function(event) {
        errorCallback(new Error('Transaction error.'));
    }
    transaction.objectStore('music').get(filePath).onsuccess = function(event) {
        var blob = event.target.result;
        if(!(blob instanceof Blob)) {
            errorCallback(new Error('Failed to decode data.'));
        } else {
            successCallback(blob);
        }
    }
}

IndexedDBStorage.prototype.readFileFromUrl = function(url, successCallback, errorCallback) {
    var self = this;
    if(url.indexOf(self._urlPrefix) == 0) {
        self.readFile(unescape(url.substr(self._urlPrefix.length)), successCallback, errorCallback);
    } else {
        errorCallback(new Error('Invalid URL schema.'));
    }
}

IndexedDBStorage.prototype.writeFile = function(filePath, blob, successCallback, errorCallback) {
    var self = this;
    try {
        var transaction = self.db.transaction(['music'], 'readwrite');
        transaction.onerror = function(event) {
            errorCallback(new Error('Transaction error.'));
        }
        transaction.objectStore('music').put(blob, filePath).onsuccess = function(event) {
            successCallback(self._urlPrefix + escape(filePath));
        }
    } catch(error) {
        errorCallback(error);
    }
}

IndexedDBStorage.prototype.clear = function(successCallback, errorCallback) {
    var self = this;
    var request = window.indexedDB.deleteDatabase('audiopia');
    request.onsuccess = function(event) {
        if(successCallback) {
            successCallback();
        }
    };
    request.onerror = function (event) {
        if(errorCallback) {
            errorCallback(new Error('Failed to delete database.'));
        }
    };
    request.onblocked = function () {
        if(errorCallback) {
            errorCallback(new Error('Couldn\'t delete database due to the operation being blocked.'));
        }
    };
}
