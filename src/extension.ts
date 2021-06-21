// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import { LanguageClient, LanguageClientOptions, ServerOptions } from 'vscode-languageclient/node';

// Name of the launcher class which contains the main.
const main: string = 'StdioLauncher';

let pathToJar: string = "";
let pathToVariationsConfig: string = "";
let pathToExtensionsConfig: string = "";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	if(!isActive()) {
		return;
	}

	if(!allPathsEntered()) {
		return;
	}

	// Get the java home from the process environment.
	const { JAVA_HOME } = process.env;

	if(!JAVA_HOME) {
		vscode.window.showInformationMessage('Das JAVA_HOME Environment wurde nicht in der Prozessumgebung gefunden. Bitte fügen Sie JAVA_HOME zu Ihren Systemumgebungsvariablen hinzu.');
	}

	// If JAVA_HOME and all needed files are present, start the language server
	if (JAVA_HOME && allFilesFound()) {
		const args: string[] = ["-jar", pathToJar, pathToVariationsConfig, pathToExtensionsConfig];

		// Set the server options 
		// -- java execution path
		// -- argument to be pass when executing the java command
		let serverOptions: ServerOptions = {
			command: 'java',
			args: [...args, main],
			options: {}
		};

		// Options to control the language client
		let clientOptions: LanguageClientOptions = {
			// Register the server for plain text documents
			documentSelector: [{ scheme: 'file', language: 'divekit' }]
		};

		// Create the language client and start the client.
		let disposable = new LanguageClient('divekit', 'Divekit Language Server', serverOptions, clientOptions).start();

		vscode.window.showInformationMessage('Der Divekit Language Server wurde gestartet!');

		// Disposables to remove on deactivation.
		context.subscriptions.push(disposable);
	}	
}

function isActive(): boolean|undefined {
	return vscode.workspace.getConfiguration().get('divekit.general.active');
}

function allPathsEntered(): boolean {
	let allPathsEntered: boolean = true;

	pathToJar = vscode.workspace.getConfiguration().get('divekit.paths.pathToLanguageServerJar')!;
	pathToVariationsConfig = vscode.workspace.getConfiguration().get('divekit.paths.pathToVariationsConfigJson')!;
	pathToExtensionsConfig = vscode.workspace.getConfiguration().get('divekit.paths.pathToVariableExtensionsConfigJson')!;

	if(pathToJar.length <= 0) {
		vscode.window.showInformationMessage('Settings: Bitte den absoluten Pfad zur Divekit Language Server Jar eingeben!');
		allPathsEntered = false;
	}
	if(pathToVariationsConfig.length <= 0) {
		vscode.window.showInformationMessage('Settings: Bitte den absoluten Pfad zur variationsConfig.json eingeben!');
		allPathsEntered = false;
	}
	if(pathToExtensionsConfig.length <= 0) {
		vscode.window.showInformationMessage('Settings: Bitte den absoluten Pfad zur variableExtensionsConfig.json eingeben!');
		allPathsEntered = false;
	}

	return allPathsEntered;
}

function allFilesFound(): boolean {
	let jarExists: boolean = false;
	let variationsConfigExists: boolean = false;
	let variableExtensionsConfigExists: boolean = false;
	
	fs.existsSync(pathToJar) ? jarExists = true : vscode.window.showInformationMessage('Divekit Language Server JAR nicht gefunden. Pfad richtig angegeben?');
	fs.existsSync(pathToVariationsConfig) ? variationsConfigExists = true : vscode.window.showInformationMessage('variationsConfig.json nicht gefunden. Pfad richtig angegeben?');
	fs.existsSync(pathToExtensionsConfig) ? variableExtensionsConfigExists = true : vscode.window.showInformationMessage('variableExtensionsConfig.json nicht gefunden. Pfad richtig angegeben?');

	return jarExists && variationsConfigExists && variableExtensionsConfigExists;
}

export function deactivate() {}