// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import { LanguageClient, LanguageClientOptions, ServerOptions } from 'vscode-languageclient/node';
import * as path from 'path';

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

	if(!jarPathEntered()) {
		return;
	}

	getConfigPaths();

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

function jarPathEntered(): boolean {
	let jarPathEntered: boolean = true;

	pathToJar = vscode.workspace.getConfiguration().get('divekit.paths.pathToLanguageServerJar')!;

	if(pathToJar.length <= 0) {
		vscode.window.showInformationMessage('Settings: Bitte den absoluten Pfad zur Divekit Language Server Jar eingeben!');
		jarPathEntered = false;
	} else {
		pathToJar = pathToJar.concat('.jar');
	}

	return jarPathEntered;
}

function getConfigPaths() {
	let rootPath = vscode.workspace.workspaceFolders![0].uri.fsPath;

	pathToVariationsConfig = vscode.workspace.getConfiguration().get('divekit.paths.pathToVariationsConfigJson')!;
	pathToExtensionsConfig = vscode.workspace.getConfiguration().get('divekit.paths.pathToVariableExtensionsConfigJson')!;

	if(pathToVariationsConfig.length <= 0) {
		pathToVariationsConfig = scanWorkspace('variationsConfig.json', rootPath);
	} else {
		pathToVariationsConfig = pathToVariationsConfig.concat('.json');
	}
	if(pathToExtensionsConfig.length <= 0) {
		pathToExtensionsConfig = scanWorkspace('variableExtensionsConfig.json', rootPath);
	} else {
		pathToExtensionsConfig = pathToExtensionsConfig.concat('.json');
	}
}

function scanWorkspace(fileName: string, workspace: string): string {
	let files = fs.readdirSync(workspace);
	let pathToConfigFile: string = '';

	files.forEach((file) => {
		let name = path.join(workspace, file);
		let stat = fs.lstatSync(name);

		if(stat.isDirectory()) {
			if(pathToConfigFile.length <= 0) {
				pathToConfigFile = scanWorkspace(fileName, name);
			}
		} else if (name.indexOf(fileName) >= 0) {
			pathToConfigFile = name;
		}
	});

	return pathToConfigFile;
}

function allFilesFound(): boolean {
	let jarExists: boolean = false;
	let variationsConfigExists: boolean = false;
	let variableExtensionsConfigExists: boolean = false;
	
	fs.existsSync(pathToJar) ? jarExists = true : vscode.window.showInformationMessage('Divekit Language Server JAR nicht gefunden. Pfad richtig angegeben?');
	fs.existsSync(pathToVariationsConfig) ? variationsConfigExists = true : vscode.window.showInformationMessage('variationsConfig.json nicht gefunden.');
	fs.existsSync(pathToExtensionsConfig) ? variableExtensionsConfigExists = true : vscode.window.showInformationMessage('variableExtensionsConfig.json nicht gefunden.');

	return jarExists && variationsConfigExists && variableExtensionsConfigExists;
}

export function deactivate() {}