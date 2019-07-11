"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ShellCommand_1 = require("./ShellCommand");
function shellCommand(command, args, expectedExitStatus) {
    if (expectedExitStatus === void 0) { expectedExitStatus = 0; }
    try {
        var sc = new ShellCommand_1.ShellCommand(command, args, expectedExitStatus);
        return sc;
    }
    catch (e) {
        throw e;
    }
}
exports.shellCommand = shellCommand;
function execute(command, args, expectedExitStatus, callback) {
    if (expectedExitStatus === void 0) { expectedExitStatus = 0; }
    if (typeof callback === 'undefined') {
        return new Promise(function (resolve, reject) {
            try {
                var sc_1 = shellCommand(command, args, expectedExitStatus);
                sc_1.execute(function (success) { return resolve({ shellCommand: sc_1, success: success }); });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    else {
        try {
            var sc_2 = shellCommand(command, args, expectedExitStatus);
            sc_2.execute(function (success) { return callback(sc_2, success); });
            return sc_2;
        }
        catch (e) {
            throw e;
        }
    }
}
exports.execute = execute;
