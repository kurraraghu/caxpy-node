"use strict";
var model;
(function (model) {
    var ResponseStatus = (function () {
        function ResponseStatus() {
            this.message = "Success";
            this.success = true;
        }
        return ResponseStatus;
    }());
    model.ResponseStatus = ResponseStatus;
})(model = exports.model || (exports.model = {}));
//# sourceMappingURL=model.js.map