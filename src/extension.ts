// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import { LanguageClient, LanguageClientOptions, ServerOptions } from 'vscode-languageclient';

// Name of the launcher class which contains the main.
const main: string = 'StdioLauncher';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let pathToJar: string | undefined = vscode.workspace.getConfiguration().get('divekit.paths.pathToLanguageServerJar');
	let pathToVariationsConfig: string | undefined = vscode.workspace.getConfiguration().get('divekit.paths.pathToVariationsConfigJson');
	let pathToExtensionsConfig: string | undefined = vscode.workspace.getConfiguration().get('divekit.paths.pathToVariableExtensionsConfigJson');

	if(pathToJar === undefined || pathToJar.length <= 0) {
		vscode.window.showInformationMessage('Settings: Bitte den absoluten Pfad zur Divekit Language Server Jar eingeben!');
		return;
	}
	if(pathToVariationsConfig === undefined || pathToVariationsConfig.length <= 0) {
		vscode.window.showInformationMessage('Settings: Bitte den absoluten Pfad zur variationsConfig.json eingeben!');
		return;
	}
	if(pathToExtensionsConfig === undefined || pathToExtensionsConfig.length <= 0) {
		vscode.window.showInformationMessage('Settings: Bitte den absoluten Pfad zur variableExtensionsConfig.json eingeben!');
		return;
	}

	let jarExists: boolean = false;
	let variationsConfigExists: boolean = false;
	let variableExtensionsConfigExists: boolean = false;
	
	fs.existsSync(pathToJar) ? jarExists = true : vscode.window.showInformationMessage('Divekit Language Server JAR nicht gefunden. Pfad richtig angegeben?');
	fs.existsSync(pathToVariationsConfig) ? variationsConfigExists = true : vscode.window.showInformationMessage('variationsConfig.json nicht gefunden. Pfad richtig angegeben?');
	fs.existsSync(pathToExtensionsConfig) ? variableExtensionsConfigExists = true : vscode.window.showInformationMessage('variableExtensionsConfig.json nicht gefunden. Pfad richtig angegeben?');

	// Get the java home from the process environment.
	const { JAVA_HOME } = process.env;

	if(!JAVA_HOME) {
		vscode.window.showInformationMessage('Das JAVA_HOME Environment wurde nicht in der Prozessumgebung gefunden. Bitte fügen Sie JAVA_HOME zu Ihren Systemumgebungsvariablen hinzu.');
	}

	// If JAVA_HOME and all needed files are present, start the language server
	if (JAVA_HOME && jarExists && variationsConfigExists && variableExtensionsConfigExists) {
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

export function deactivate() {}