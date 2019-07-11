import { ShellCommand } from "./ShellCommand";
export declare function shellCommand(command: string, args: string[], expectedExitStatus?: number): ShellCommand;
export declare function execute(command: string, args: string[], expectedExitStatus?: number): Promise<{
    shellCommand: ShellCommand;
    success: boolean;
}>;
export declare function execute(command: string, args: string[], expectedExitStatus: number, callback: (shellCommand: ShellCommand, success: boolean) => void): ShellCommand;
