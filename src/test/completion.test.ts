import * as vscode from 'vscode';
import * as assert from 'assert';
import { getDocUri, activate, resetConfig} from './helper';

suite('Divekit Completion', () => {
    const docUri = getDocUri('completion.md');
    const noCompletionDocUri = getDocUri('no_completion.txt');

    test('should autocomplete', async () => {
        await testCompletion(docUri, new vscode.Position(0, 0), 
            [
                '$Vehicle$',
                '$vehicle$',
                '$Vehicle_Attr_Built$',
                '$Vehicle_Attr_BuiltType$',
                '$Vehicle_Attr_BuiltValue$',
                '$Vehicle_Attr_Power$',
                '$Vehicle_Attr_PowerType$',
                '$Vehicle_Attr_PowerValue$',
                '$VehicleClass$',
                '$VehicleClassPath$',
                '$VehicleGetToMany$',
                '$VehicleGetToOne$',
            ]
        );
    });

    test('should not autocomplete', async () => {
        await testNoCompletion(noCompletionDocUri, new vscode.Position(0, 0));
    });
});

async function testCompletion(
    docUri: vscode.Uri,
    position: vscode.Position,
    expectedCompletionList: string[]
) {
    try{
        await activate(docUri);

        const actualCompletionList = (await vscode.commands.executeCommand(
            'vscode.executeCompletionItemProvider',
            docUri,
            position
          )) as vscode.CompletionList;
    
          assert.ok(actualCompletionList.items.length >= 11);
    
          actualCompletionList.items.forEach((item) => {
            assert.ok(expectedCompletionList.includes(item.label));
          });
    } finally {
        await resetConfig();
    }
}

async function testNoCompletion(
    docUri: vscode.Uri,
    position: vscode.Position,
) {
    try{
        await activate(docUri);

        const actualCompletionList = (await vscode.commands.executeCommand(
            'vscode.executeCompletionItemProvider',
            docUri,
            position
          )) as vscode.CompletionList;
    
          assert.ok(actualCompletionList.items.length === 0);
    
    } finally {
        await resetConfig();
    }
}