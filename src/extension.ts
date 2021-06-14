// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import { LanguageClient, LanguageClientOptions, ServerOptions } from 'vscode-languageclient';

// Name of the launcher class which contains the main.
const main: string = 'StdioLauncher';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "divekit" is now active!');

	let pathToJar: string | undefined = vscode.workspace.getConfiguration().get('divekit.paths.pathToLanguageServerJar');
	let pathToVariationsConfig: string | undefined = vscode.workspace.getConfiguration().get('divekit.paths.pathToVariationsConfigJson');
	let pathToExtensionsConfig: string | undefined = vscode.workspace.getConfiguration().get('divekit.paths.pathToVariableExtensionsConfigJson');

	if(pathToJar === undefined || pathToJar.length <= 0) {
		vscode.window.showInformationMessage('Settings: Please do not forget to enter the absolute path to the Divekit Language Server Jar!');
		return;
	}
	if(pathToVariationsConfig === undefined || pathToVariationsConfig.length <= 0) {
		vscode.window.showInformationMessage('Settings: Please do not forget to enter the absolute path to the variationsConfig.json!');
		return;
	}
	if(pathToExtensionsConfig === undefined || pathToExtensionsConfig.length <= 0) {
		vscode.window.showInformationMessage('Settings: Please do not forget to enter the absolute path to the variableExtensionsConfig.json!');
		return;
	}

	// Get the java home from the process environment.
	const { JAVA_HOME } = process.env;

	console.log(`Using java from JAVA_HOME: ${JAVA_HOME}`);
	// If java home is available continue.
	if (JAVA_HOME) {
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

		vscode.window.showInformationMessage('Divekit Language Server started!');

		// Disposables to remove on deactivation.
		context.subscriptions.push(disposable);
	}
}

// this method is called when your extension is deactivated
export function deactivate() {}
