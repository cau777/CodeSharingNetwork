import {CodeEditorCommand} from "./CodeEditorCommand";
import {CodeEditorOptions} from "../CodeEditorOptions";
import React from "react";
import {regexTestRange} from "../../../utils/StringUtils";

export class BackspaceCommand extends CodeEditorCommand {
    
    public canExecute(alt: boolean, ctrl: boolean, shift: boolean, key: string): boolean {
        return !alt && !ctrl && !shift && key === "Backspace";
    }
    
    public async performAction(target: HTMLTextAreaElement, e: React.KeyboardEvent<HTMLTextAreaElement>, options: CodeEditorOptions): Promise<void> {
        if (target.selectionStart === target.selectionEnd) {
            if (regexTestRange(target.value, new RegExp(options.indentation + "$"), 0, target.selectionStart)) {
                target.selectionStart = Math.max(0, target.selectionStart - options.indentation.length);
            } else {
                target.selectionStart = Math.max(0, target.selectionStart - 1);
                
                if (target.selectionEnd !== target.value.length) {
                    let currentChar = target.value[target.selectionEnd - 1]
                    let nextChar = target.value[target.selectionEnd];
                    let closeChar = CodeEditorCommand.LinkedCharacters.findCloseCharacter(currentChar);
                    
                    if (nextChar === closeChar) {
                        target.selectionEnd++;
                    }
                }
            }
        }
        
        this.insertValue(target, "");
    }
}