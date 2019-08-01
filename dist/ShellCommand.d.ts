/// <reference types="node" />
import { ChildProcessWithoutNullStreams } from 'child_process';
import { EventEmitter } from 'events';
export interface ShellCommandEvents extends EventEmitter {
    on(event: 'pid', listener: (pid: number) => void): this;
    on(event: 'stdout', listener: (stdout: string) => void): this;
    on(event: 'stderr', listener: (stderr: string) => void): this;
    on(event: 'error', listener: (error: Error) => void): this;
    on(event: 'exit', listener: (exitStatus: number) => void): this;
}
export declare class ShellCommand {
    command: string;
    args: string[];
    processedCommand: string;
    spawn: ChildProcessWithoutNullStreams | null;
    pid: number;
    error: Error | null;
    stdout: string;
    stderr: string;
    working: boolean;
    executed: boolean;
    expectedExitStatus: number;
    exitStatus: number;
    exitSignal: string | null;
    events: ShellCommandEvents;
    constructor(command: string, args: string[], expectedExitStatus?: number);
    private processCommand;
    execute(): Promise<boolean>;
    execute(callback: (success: boolean) => void): void;
    ok(): boolean;
    exitStatusOk(): boolean;
    kill(signal?: string): boolean;
}
