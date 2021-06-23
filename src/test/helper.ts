import * as vscode from 'vscode';
import * as path from 'path';

export let doc: vscode.TextDocument;
export let editor: vscode.TextEditor;
export let documentEol: string;
export let platformEol: string;

let active: boolean | undefined;
let pathToJar: string;
let pathToVariationsConfig: string;
let pathToExtensionsConfig: string;

export async function activate(docUri: vscode.Uri) {

    await setTestingConfiguration();

    await sleep(500);

    const ext = vscode.extensions.getExtension('Divekit.divekit')!;
    await ext.activate();

    try {
        doc = await vscode.workspace.openTextDocument(docUri);
        editor = await vscode.window.showTextDocument(doc);

        await sleep(500);
    } catch (e) {
        console.error(e);
    }
}

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const getDocUri = (p: string) => {
    return vscode.Uri.file(getDocPath(p));
};

export const getDocPath = (p: string) => {
    return path.resolve(__dirname, '../../testFixture', p);
};

export async function setTestingConfiguration() {
    active = vscode.workspace.getConfiguration().get('divekit.general.active');
    pathToJar = vscode.workspace.getConfiguration().get('divekit.paths.pathToLanguageServerJar')!;
    pathToVariationsConfig = vscode.workspace.getConfiguration().get('divekit.paths.pathToVariationsConfigJson')!;
    pathToExtensionsConfig = vscode.workspace.getConfiguration().get('divekit.paths.pathToVariableExtensionsConfigJson')!;

    await vscode.workspace.getConfiguration().update('divekit.general.active', true, vscode.ConfigurationTarget.Global);
    await vscode.workspace.getConfiguration().update('divekit.paths.pathToLanguageServerJar', 'C:/Users/Marco/IdeaProjects/automated-repo-setup/DivekitLanguageServer-0.95-jar-with-dependencies.jar', vscode.ConfigurationTarget.Global);
    await vscode.workspace.getConfiguration().update('divekit.paths.pathToVariationsConfigJson', getDocPath('variationsConfig.json'), vscode.ConfigurationTarget.Global);
    await vscode.workspace.getConfiguration().update('divekit.paths.pathToVariableExtensionsConfigJson', getDocPath('variableExtensionsConfig.json').toString(), vscode.ConfigurationTarget.Global);
}

export async function resetConfig() {

    await vscode.workspace.getConfiguration().update('divekit.general.active', active, vscode.ConfigurationTarget.Global);
    await vscode.workspace.getConfiguration().update('divekit.paths.pathToLanguageServerJar', pathToJar, vscode.ConfigurationTarget.Global);
    await vscode.workspace.getConfiguration().update('divekit.paths.pathToVariationsConfigJson', pathToVariationsConfig, vscode.ConfigurationTarget.Global);
    await vscode.workspace.getConfiguration().update('divekit.paths.pathToVariableExtensionsConfigJson', pathToExtensionsConfig, vscode.ConfigurationTarget.Global);

}