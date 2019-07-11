var platform = require('os').platform;
var execute = require('../dist/index').execute;
var shellCommand = require('../dist/index').shellCommand;
var assert = require('assert');

describe('#ShellCommand', () => {
	if (platform() === 'linux') {
		it('#Bad number of arguments (callback)', () => {
			assert.throws(() => execute('ls', ['/'], undefined, () => { }), 'Should have thrown an exception: too many arguments');
			assert.throws(() => execute('ls \'!?!\'', [], undefined, () => { }), 'Should have thrown an exception: to few arguments');
		});
		it('#Bad number of arguments (promise)', (done) => {
			execute('ls', ['/']).then(() => {
				done(new Error('Should fail'));
			}).catch(() => {
				execute('ls \'!?!\'', []).then(() => {
					done(new Error('Should fail'));
				}).catch(() => {
					done();
				});
			});
		});
		it('#Known command', (done) => {
			try{
				execute('ls \'!?!\' ', ['/'], undefined, (sc, success) => {
					if (success) {
						execute('ls \'!?!\' ', ['/']).then((result) => {
							if (result.success) {
								done();
							} else {
								done(result.shellCommand.error);
							}
						}).catch(()=>{
							done(new Error('Shouldn\'t throw an error'));
						});
					} else {
						done(sc.error);
					}
				});
			}catch(e){
				done(new Error('Shouldn\'t throw an error'));
			}
		});
		it('#Unknown command', (done) => {
			try{
				execute('vfduisvbfiudnvfdkxu', [], undefined, (_, success) => {
					if (success) {
						done(new Error('Shouldn\'t succeed'));
					} else {
						execute('vfduisvbfiudnvfdkxu', []).then((result) => {
							if(result.success){
								done(new Error('Shouldn\'t succeed'));
							}else{
								done();
							}
						}).catch(() => {
							done(new Error('Shouldn\'t throw an error'));
						});
					}
				});
			}catch(e){
				done(new Error('Shouldn\'t throw an error'));
			}
		});
		it('#Exit status 1', (done) => {
			try{
				execute('exit \'!?!\'', ['1'], 1, (sc, success) => {
					if (success) {
						execute('exit \'!?!\'', ['1'], 1).then((result)=>{
							if(result.success){
								done();
							}else{
								done(new Error(`The exit status should be equals to ${result.shellCommand.expectedExitStatus} but it is ${result.shellCommand.exitStatus}`))
							}
						}).catch(()=>{
							done(new Error('Shouldn\'t throw an error'));
						});
					} else {
						done(new Error(`The exit status should be equals to ${sc.expectedExitStatus} but it is ${sc.exitStatus}`));
					}
				});
			}catch(e){
				done(new Error('Shouldn\'t throw an error'));
			}
		});
		it('#Kill and signal', (done)=>{
			try{
				var kill = false;
				var sc = shellCommand('sleep 10', []);
				sc.events.on('pid', ()=>{
					if(sc.kill('SIGKILL')){
						kill = true;
					}else{
						done(new Error('Should have been killed'));
					}
				});
				sc.events.on('exit', (exitStatus, exitSignal) => {
					if(kill === true){
						if(exitSignal === 'SIGKILL'){
							done();
						}else{
							done(`The expected exit signal was 'SIGKILL' but ${exitSignal} recieved`);
						}
					}
				});
				sc.execute(()=>{});
			}catch(e){
				done(new Error('Shouldn\'t throw an error'));
			}
		});
	} else {
		it('#Bad platform (callback)', () => {
			assert.throws(() => execute('ls \'!?!\'', ['/'], undefined, () => { }), 'Shouldn\'t work on this platform');
		});
		it('#Bad platform (promise)', (done) => {
			execute('ls \'!?!\'', ['/']).then(() => {
				done(new Error('Shouldn\'t work on this platform'));
			}).catch(() => {
				done();
			});
		});
	}
});
