import {CodeEditorCommand} from "./CodeEditorCommand";
import React from "react";
import {countOccurrences} from "../../../utils/StringUtils";
import {CodeEditorOptions} from "../CodeEditorOptions";

export class InsertKeyCommand extends CodeEditorCommand {
    public canExecute(alt: boolean, ctrl: boolean, shift: boolean, key: string): boolean {
        return !alt && !ctrl && key.length === 1;
    }
    
    public async performAction(target: HTMLTextAreaElement, e: React.KeyboardEvent<HTMLTextAreaElement>, options: CodeEditorOptions): Promise<void> {
        let key = e.key;
        let isSelecting = target.selectionStart !== target.selectionEnd;
        let isOpen = CodeEditorCommand.LinkedCharacters.isOpenCharacter(key);
        let isClose = CodeEditorCommand.LinkedCharacters.isCloseCharacter(key);
        
        if (isSelecting) {
            if (isOpen) {
                // Wrap selection (example: '{selection}')
                let selection = target.value.substring(target.selectionStart, target.selectionEnd);
                this.insertValue(target, key + selection + CodeEditorCommand.LinkedCharacters.findCloseCharacter(key));
            } else {
                // Replace the selection with the new letter
                this.insertValue(target, key);
            }
        } else {
            
            if (isClose) {
                let opening = countOccurrences(target.value, CodeEditorCommand.LinkedCharacters.findOpenCharacter(key));
                let closing = countOccurrences(target.value, key);
                
                if (opening === closing && target.selectionStart < target.value.length && target.value.charAt(target.selectionStart) === key) {
                    // Just advance one letter
                    target.selectionStart++;
                    target.selectionEnd = target.selectionStart;
                } else if (isOpen) {
                    // Place the closing character (example: '}')
                    this.placeCloseChar(target, key);
                } else {
                    // Just insert the letter
                    this.insertValue(e.currentTarget, key);
                }
            } else if (isOpen) {
                // Place the closing character (example: '}')
                this.placeCloseChar(target, key);
            } else {
                // Just insert the letter
                this.insertValue(e.currentTarget, key);
            }
        }
    }
    
    private placeCloseChar(target: HTMLTextAreaElement, key: string) {
        this.insertValue(target, key + CodeEditorCommand.LinkedCharacters.findCloseCharacter(key));
        target.selectionStart--;
        target.selectionEnd--;
    }
}