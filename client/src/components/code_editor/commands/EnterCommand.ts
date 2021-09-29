import {CodeEditorCommand} from "./CodeEditorCommand";
import React from "react";
import {findReversed, regexTestRange} from "../../../utils/StringUtils";
import {LanguageOptions} from "../languages/LanguageOptions";

export class EnterCommand extends CodeEditorCommand {
    
    public canExecute(alt: boolean, ctrl: boolean, shift: boolean, key: string): boolean {
        return key === "Enter";
    }
    
    public async performAction(target: HTMLTextAreaElement, e: React.KeyboardEvent<HTMLTextAreaElement>, options: LanguageOptions): Promise<void> {
        this.saveStateAfter();
        
        if (options.autoIndent) {
            // If there is ] ) or } right after the cursor, send this character to the next line
            if (regexTestRange(target.value, /^ *[})\]]/, target.selectionEnd)) {
                let level = super.calcIndentationLevel(target);
                let firstPart = "\n" + this.generateIndentation(level, options);
                let secondPart = "\n" + this.generateIndentation(level - 1, options);
                this.insertValue(target, firstPart);
                this.insertValue(target, secondPart);
                target.selectionStart -= secondPart.length;
                target.selectionEnd = target.selectionStart;
            } else {
                let indentation = this.generateIndentation(this.calcIndentationLevel(target), options);
                this.insertValue(target, "\n" + indentation);
            }
        } else {
            let lineStart = findReversed(target.value, "\n", 0, target.selectionEnd) ?? 0;
            let spaces = 0;
            let pos = lineStart + 1;
            while (target.value.charAt(pos) === " ") {
                spaces++;
                pos++;
            }
            let indentation = " ".repeat(spaces);
            this.insertValue(target, "\n" + indentation);
        }
        
        if (target.scrollHeight !== 0) {
            target.scrollBy(0, 23);
        }
    }
}