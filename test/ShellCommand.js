/* eslint-disable no-undef */
var platform = require('os').platform;
var ShellCommand = require('../dist/ShellCommand').ShellCommand;
var shellCommand = require('../dist/index').shellCommand;
var execute = require('../dist/index').execute;
var assert = require('assert');

describe('#shellCommand', () => {
	if (platform() === 'linux') {
		it('#Kill and signal', (done) => {
			try {
				var kill = false;
				var sc = shellCommand('sleep 10', []);
				sc.events.on('pid', () => {
					if (sc.kill('SIGKILL')) {
						kill = true;
					} else {
						done(new Error('Should have been killed'));
					}
				});
				sc.events.on('exit', (exitStatus, exitSignal) => {
					if (kill === true) {
						if (exitSignal === 'SIGKILL') {
							done();
						} else {
							done(`The expected exit signal was 'SIGKILL' but ${exitSignal} recieved`);
						}
					}
				});
				sc.execute(() => { });
			} catch (e) {
				done(new Error(`Didn't expected an error to happend\nError:\n${e}`));
			}
		});
	} else {
		it('#Bad platform', (done) => {
			execute('ls \'!?!\'', ['/']).then(() => {
				done(new Error('Shouldn\'t work on this platform'));
			}).catch(() => {
				done();
			});
		});
	}
});

describe('#execute (Promise)', () => {
	if (platform() === 'linux') {
		it('#Bad number of arguments', (done) => {
			execute('ls', ['/']).then(() => {
				done(new Error('Should have thrown an exception: too many arguments'));
			}).catch(() => {
				execute('ls \'!?!\'', []).then(() => {
					done(new Error('Should have thrown an exception: to few arguments'));
				}).catch(() => {
					done();
				});
			});
		});
		it('#Known command', (done) => {
			execute('ls \'!?!\' ', ['/']).then((result) => {
				if (result.success) {
					done();
				} else {
					done(result.shellCommand.error);
				}
			}).catch((e) => {
				done(new Error(`Didn't expected an error to happend\nError:\n${e}`));
			});
		});
		it('#Unknown command', (done) => {
			execute('vfduisvbfiudnvfdkxu', []).then((result) => {
				if (result.success) {
					done(new Error('Shouldn\'t succeed'));
				} else {
					done();
				}
			}).catch((e) => {
				done(new Error(`Didn't expected an error to happend\nError:\n${e}`));
			});
		});
		it('#Expected exit status to be 1', (done) => {
			execute('exit \'!?!\'', ['1'], 1).then((result) => {
				if (result.success) {
					done();
				} else {
					done(new Error(`The exit status should be equals to ${result.shellCommand.expectedExitStatus} but it is ${result.shellCommand.exitStatus}`));
				}
			}).catch((e) => {
				done(new Error(`Didn't expected an error to happend\nError:\n${e}`));
			});
		});
	} else {
		it('#Bad platform', (done) => {
			execute('ls \'!?!\'', ['/']).then(() => {
				done(new Error('Shouldn\'t work on this platform'));
			}).catch(() => {
				done();
			});
		});
	}
});

describe('#execute (Callback)', () => {
	if (platform() === 'linux') {
		it('#Bad number of arguments', () => {
			assert.throws(() => execute('ls', ['/'], undefined, () => { }), 'Should have thrown an exception: too many arguments');
			assert.throws(() => execute('ls \'!?!\'', [], undefined, () => { }), 'Should have thrown an exception: to few arguments');
		});
		it('#Retrieve the shellCommand', (done) => {
			var scOk = false;
			var sc = execute('ls', undefined, undefined, (shellCommand, success) => {
				if (success === true) {
					if (shellCommand instanceof ShellCommand) {
						if(scOk === true){
							done();
						}else{
							done(new Error('The sc variable should be an instanceof "ShellCommand" but it isn\'t '));
						}
					} else {
						done(new Error('The shellCommand variable should be an instanceof "ShellCommand" but it isn\'t'));
					}
				} else {
					done(sc.error);
				}
			});
			scOk = sc instanceof ShellCommand;
		});
		it('#Known command', (done) => {
			try {
				execute('ls \'!?!\' ', ['/'], undefined, (sc, success) => {
					if (success) {
						done();
					} else {
						done(sc.error);
					}
				});
			} catch (e) {
				done(new Error(`Didn't expected an error to happend\nError:\n${e}`));
			}
		});
		it('#Unknown command', (done) => {
			try {
				execute('vfduisvbfiudnvfdkxu', [], undefined, (_, success) => {
					if (success) {
						done(new Error('Shouldn\'t succeed'));
					} else {
						done();
					}
				});
			} catch (e) {
				done(new Error(`Didn't expected an error to happend\nError:\n${e}`));
			}
		});
		it('#Expected exit status to be 1', (done) => {
			try {
				execute('exit \'!?!\'', ['1'], 1, (sc, success) => {
					if (success) {
						done();
					} else {
						done(new Error(`The exit status should be equals to ${sc.expectedExitStatus} but it is ${sc.exitStatus}`));
					}
				});
			} catch (e) {
				done(new Error(`Didn't expected an error to happend\nError:\n${e}`));
			}
		});
	} else {
		it('#Bad platform', () => {
			assert.throws(() => execute('ls \'!?!\'', ['/'], undefined, () => { }), 'Shouldn\'t work on this platform');
		});
	}
});
