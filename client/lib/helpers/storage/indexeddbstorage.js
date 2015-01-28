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
        request.result.createObjectStore('music');
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
            if(blob.indexOf('data:') != 0) {
                errorCallback(new Error('Invalid format.'));
            } else {
                var b64ToUint6 = function(nChr) {
                  return nChr > 64 && nChr < 91 ?  nChr - 65 : nChr > 96 && nChr < 123 ?  nChr - 71 : nChr > 47 && nChr < 58 ?  nChr + 4 : nChr === 43 ?  62 : nChr === 47 ?  63 : 0;
                }
                var base64DecToArr = function(sBase64, nBlocksSize) {
                    var sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, ""), nInLen = sB64Enc.length,
                    nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2, taBytes = new Uint8Array(nOutLen);
                    for(var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
                        nMod4 = nInIdx & 3;
                        nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
                        if(nMod4 === 3 || nInLen - nInIdx === 1) {
                            for(nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
                                taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
                            }
                            nUint24 = 0;
                        }
                    }

                    return taBytes;
                }
                var dataUrl = blob.split(',');
                successCallback(new Blob([base64DecToArr(dataUrl[1]).buffer], { type: dataUrl[0].split(':')[1].split(';')[0] }));
            }
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
    var storeCallback = function(blob, filePath) {
        var transaction = self.db.transaction(['music'], 'readwrite');
        transaction.onerror = function(event) {
            errorCallback(new Error('Transaction error.'));
        }
        transaction.objectStore('music').put(blob, filePath).onsuccess = function(event) {
            successCallback(self._urlPrefix + escape(filePath));
        }
    }

    try {
        storeCallback(blob, filePath);
    } catch(error) {
      if(error.name == 'DataCloneError') {
          var reader = new FileReader();
          reader.onload = function(event) {
              storeCallback(event.target.result, filePath);
          };
          reader.onerror = function(event) {
              errorCallback(event.target.error);
          }
          reader.readAsDataURL(blob);
      } else {
          errorCallback(error);
      }
    }
}

IndexedDBStorage.prototype.clear = function(successCallback, errorCallback) {
    var self = this;
    var transaction = self.db.transaction(['music'], 'readwrite');
    transaction.onerror = function(event) {
        errorCallback(new Error('Transaction error.'));
    }
    transaction.objectStore('music').clear().onsuccess = function(event) {
        successCallback();
    }
}
