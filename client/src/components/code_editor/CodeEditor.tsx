import "../../css/CodeEditor.css";
import React, {Component, KeyboardEvent, UIEvent} from "react";
import {CodeEditorLineNumbers} from "./CodeEditorLineNumbers";
import {DeleteToWordStartCommand} from "./commands/DeleteToWordStartCommand";
import {EnterCommand} from "./commands/EnterCommand";
import InsertIndentationCommand from "./commands/InsertIndentationCommand";
import SelectAllCommand from "./commands/SelectAllCommand";
import {BackspaceCommand} from "./commands/BackspaceCommand";
import {InsertKeyCommand} from "./commands/InsertKeyCommand";
import {CodeEditorCommand} from "./commands/CodeEditorCommand";
import {LanguageOptions} from "./languages/LanguageOptions";
import $ from "jquery";
import {CodeEditorDisplay} from "./CodeEditorDisplay";
import {countOccurrences} from "../../utils/StringUtils";
import {DeleteCommand} from "./commands/DeleteCommand";
import {CommandExecutor} from "./CommandExecutor";
import {MoveLineUpCommand} from "./commands/MoveLineUpCommand";
import {MoveLineDownCommand} from "./commands/MoveLineDownCommand";
import {IFormEvent} from "../../utils/forms/IFormEvent";

interface IProps {
    language: LanguageOptions;
    onInput?: (event: IFormEvent<string>) => void;
}

interface IState {
    text: string;
    selected: number;
    rows: number;
}

class CodeEditor extends Component<IProps, IState> {
    private static readonly commands: CodeEditorCommand[] = [
        new SelectAllCommand(),
        new DeleteToWordStartCommand(),
        new EnterCommand(),
        new InsertIndentationCommand(),
        new MoveLineUpCommand(),
        new MoveLineDownCommand(),
        new BackspaceCommand(),
        new DeleteCommand(),
        new InsertKeyCommand(),
    ];
    
    private executor!: CommandExecutor;
    
    public constructor(props: IProps) {
        super(props);
        this.state = {
            text: "",
            selected: 0,
            rows: 1,
        };
        this.keyDown = this.keyDown.bind(this);
        this.changeText = this.changeText.bind(this);
        this.updateSelectedRow = this.updateSelectedRow.bind(this);
        this.updateRowsAndCols = this.updateRowsAndCols.bind(this);
    }
    
    public render() {
        // noinspection JSJQueryEfficiency
        return (
            <div className="code-editor selected-border">
                <CodeEditorLineNumbers lineCount={this.state.rows}/>
                <div id="code-wrapper">
                    <div id="code-text-wrapper">
                        <CodeEditorDisplay selected={this.state.selected} text={this.state.text} language={this.props.language}/>
                    </div>
                    <textarea id="code-input" name="code" onKeyDown={this.keyDown} autoCorrect={"none"} spellCheck={false}
                              onScroll={CodeEditor.scrollNumbers} onFocus={() => $(".code-editor").addClass("selected")}
                              onBlur={() => $(".code-editor").removeClass("selected")} onSelect={this.updateSelectedRow}
                              rows={1} maxLength={10_000}>
                        
                    </textarea>
                </div>
            </div>
        )
    }
    
    public componentDidMount() {
        let codeInput = document.getElementById("code-input") as HTMLTextAreaElement;
        
        codeInput.addEventListener("input", () => {
            this.changeText();
            this.executor.saveState();
        });
        
        this.executor = new CommandExecutor(codeInput, this.changeText);
    }
    
    private static prepareKey(key: string) {
        // InternetExplorer and Edge use different naming
        switch (key) {
            case "Down":
                return "ArrowDown";
            case "Up":
                return "ArrowUp";
            case "Left":
                return "ArrowLeft";
            case "Right":
                return "ArrowRight";
            case "Esc":
                return "Escape";
            default:
                return key;
        }
    }
    
    private static scrollNumbers(event: UIEvent<HTMLTextAreaElement>) {
        let target = event.currentTarget;
        let lines = document.getElementById("line-numbers");
        let codeText = document.getElementById("code-text-wrapper");
        
        if (lines !== null) {
            lines.style.top = -target.scrollTop + "px";
            lines.style.left = "0";
        }
        
        if (codeText !== null) {
            codeText.style.top = -target.scrollTop + "px";
            codeText.style.left = -target.scrollLeft + "px";
        }
    }
    
    private updateRowsAndCols(target: HTMLTextAreaElement) {
        let lines = (target.value + "\n").match(/.*\n/g) || [];
        let rows = lines.length;
        let longestRow = 0;
        
        for (let line of lines) {
            longestRow = Math.max(longestRow, line.length);
        }
        
        target.rows = rows;
        this.setState({rows: rows});
    }
    
    private keyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
        if (!e.altKey && e.ctrlKey && !e.shiftKey && e.key === "z") {
            this.executor!.undo().then();
            e.preventDefault();
        } else if (!e.altKey && e.ctrlKey && e.shiftKey && e.key === "Z") {
            this.executor!.redo().then();
            e.preventDefault();
        } else {
            let key = CodeEditor.prepareKey(e.key);
            
            for (let command of CodeEditor.commands) {
                if (command.canExecute(e.altKey, e.ctrlKey, e.shiftKey, key)) {
                    this.executor!.execute(command, e, this.props.language).then();
                    break;
                }
            }
        }
    }
    
    private updateSelectedRow(e: KeyboardEvent<HTMLTextAreaElement>) {
        let lineNum = countOccurrences(e.currentTarget.value, "\n", 0, e.currentTarget.selectionEnd);
        this.setState({selected: lineNum});
    }
    
    private changeText() {
        let codeInput = document.getElementById("code-input") as HTMLTextAreaElement;
        this.updateRowsAndCols(codeInput);
        this.setState({text: codeInput.value});
        this.props.onInput?.({currentTarget: codeInput});
    }
}

export {CodeEditor};