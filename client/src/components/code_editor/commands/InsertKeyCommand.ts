import {CodeEditorCommand} from "./CodeEditorCommand";
import React from "react";
import {countOccurrences} from "../../../utils/StringUtils";

export class InsertKeyCommand extends CodeEditorCommand {
    public constructor() {
        super(true, true);
        this.performAction = this.performAction.bind(this);
        this.placeCloseChar = this.placeCloseChar.bind(this);
    }
    
    public canExecute(alt: boolean, ctrl: boolean, shift: boolean, key: string): boolean {
        return !alt && !ctrl && key.length === 1;
    }
    
    public performAction(component: React.Component, e: React.KeyboardEvent<HTMLTextAreaElement>): void {
        let target = e.currentTarget;
        let key = e.key;
        let selecting = target.selectionStart !== target.selectionEnd;
        let isOpen = CodeEditorCommand.LinkedCharacters.isOpenCharacter(key);
        let isClose = CodeEditorCommand.LinkedCharacters.isCloseCharacter(key);
        
        if (selecting) {
            if (isOpen) {
                // Wrap
            } else {
                this.insertValue(e.currentTarget, key);
            }
        } else {
            if (isClose) {
                let opening = countOccurrences(target.value, CodeEditorCommand.LinkedCharacters.findOpenCharacter(key));
                let closing = countOccurrences(target.value, key);
                
                if (opening === closing && target.selectionStart < target.value.length && target.value.charAt(target.selectionStart) === key) {
                    target.selectionStart++;
                    target.selectionEnd = target.selectionStart;
                } else if (isOpen) {
                    this.placeCloseChar(target, key);
                } else {
                    this.insertValue(e.currentTarget, key);
                }
            } else if (isOpen) {
                this.placeCloseChar(target, key);
            }else{
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