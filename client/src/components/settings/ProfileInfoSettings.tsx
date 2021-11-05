import React, {Component} from "react";
import AppContext from "../app/AppContext";
import {SimpleForm} from "../forms/SimpleForm";
import {FormBodyController} from "../../utils/forms/FormBodyController";
import {Button} from "react-bootstrap";
import Loading from "../Loading";
import api from "../../utils/api";
import {IUserInfo} from "../IUserInfo";

interface IState {
    info?: IUserInfo;
}

export class ProfileInfoSettings extends Component<any, IState> {
    private readonly formController: FormBodyController<any>;
    
    static contextType = AppContext;
    context!: React.ContextType<typeof AppContext>;
    
    public constructor(props: any) {
        super(props);
        
        this.state = {}
        
        this.formController = new FormBodyController<any>("/profile/info", "post", undefined,
            () => alert("Successfully updated profile info"));
    }
    
    public render() {
        let credentials = this.context.credentials;
        let info = this.state.info;
        if (credentials === undefined || info === undefined) return <Loading/>;
        
        return (
            <div>
                <SimpleForm name="Additional Information" target={this.formController}>
                    <div className="form-section">
                        <label htmlFor="name">Name</label><br/>
                        <input id="name" name="name" minLength={1} maxLength={500} defaultValue={info.name}
                               onInput={this.formController.inputChange}/>
                    </div>
                    
                    <div className="form-section">
                        <label htmlFor="bio">Bio</label><br/>
                        <textarea className="long-text selected-border" rows={5} id="bio" name="bio"
                                  maxLength={500} defaultValue={info.bio} onInput={this.formController.inputChange}/>
                    </div>
                    
                    <Button type="submit" variant="primary">Save</Button>
                    <Button className="ms-1" type="reset" variant="secondary">Discard</Button>
                </SimpleForm>
                <hr/>
            </div>
        );
    }
    
    public componentDidMount() {
        api.get<IUserInfo>("/users/" + this.context.credentials?.username + "/info").then(r => {
            this.setState({info: r.data});
            this.formController.setValue("name", r.data.name);
            this.formController.setValue("bio", r.data.bio);
        });
    }
}