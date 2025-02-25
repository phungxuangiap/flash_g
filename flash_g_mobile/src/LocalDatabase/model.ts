import { ActiveStatus } from "../constants";

export class User {
    _id : string;
    email : string;
    password : string;
    user_name : string;
    modified_time: string;
    constructor(_id: string, email: string, password: string, user_name: string, modified_time:string){
        this._id = _id;
        this.email = email;
        this.password = password;
        this.user_name = user_name;
        this.modified_time = modified_time;
    }
}
export class UserPreference{
    _id: number;
    colorPreference: string;
    languagePreference: string;
    modePreference: number;
    restrictModePreference: number;
    constructor(_id: number, colorPreference: string, languagePreference: string, modePreference: number, restrictmodePreference: number){
        this._id = _id;
        this.colorPreference = colorPreference;
        this.languagePreference =  languagePreference;
        this.modePreference = modePreference;
        this.restrictModePreference = restrictmodePreference;
    }
}

export class Desk {
    _id : string;
    user_id : string;
    author_id: string;
    original_id: string;
    access_status: string;
    title : string;
    description:string;
    primary_color : string;
    new_card : number;
    inprogress_card : number;
    preview_card : number;
    modified_time: string;
    active_status: string;
    remote_id: string;
    constructor(_id: string, user_id: string, author_id:string, original_id:string, access_status: string, title: string, description: string, primary_color: string, new_card: number, inprogress_card: number, preview_card: number, modified_time:string, active_status: string = ActiveStatus, remote_id:string = ""){
        this._id = _id;
        this.user_id = user_id;
        this.author_id = author_id;
        this.original_id = original_id;
        this.access_status = access_status;
        this.title = title;
        this.description = description;
        this.primary_color = primary_color;
        this.new_card = new_card;
        this.inprogress_card = inprogress_card;
        this.preview_card = preview_card;
        this.modified_time = modified_time;
        this.active_status = active_status;
        this.remote_id = remote_id;
    }
}

export class Card {
    _id:string;
    desk_id : string;
    user_id: string;
    author_id: string;
    original_id: string;
    status : string;
    level : number;
    last_preview : string;
    vocab : string;
    description : string;
    sentence : string;
    vocab_audio : string;
    sentence_audio : string;
    type : string;
    modified_time: string;
    active_status:string;
    remote_id: string;
    remote_desk_id: string;
    constructor(_id:string, desk_id: string, user_id:string, author_id:string, original_id:string, status: string, level: number, last_preview: string, vocab: string, description: string, sentence: string, vocab_audio: string, sentence_audio: string, type: string, modified_time:string, active_status:string = ActiveStatus, remote_id:string = "", remote_desk_id: string = ""){
        this._id = _id;
        this.desk_id = desk_id;
        this.user_id = user_id;
        this.author_id = author_id;
        this.original_id = original_id;
        this.status = status;
        this.level = level;
        this.last_preview = last_preview;
        this.vocab = vocab;
        this.description = description;
        this.sentence = sentence;
        this.vocab_audio = vocab_audio;
        this.sentence_audio = sentence_audio;
        this.type = type;
        this.modified_time = modified_time;
        this.active_status = active_status;
        this.remote_id = remote_id;
        this.remote_desk_id = remote_desk_id;
    }
}


export class Image {
    _id: string;
    remote_id: string;
    remote_desk_id: string;
    desk_id: string;
    type: string;
    img_url: string;
    modified_time: string;
    constructor(_id:string, remote_id: string, remote_desk_id: string, desk_id: string, type:string, img_url:string, modified_time:string){
        this._id = _id;
        this.remote_id = remote_id;
        this.remote_desk_id = remote_desk_id;
        this.desk_id = desk_id;
        this.type = type;
        this.img_url = img_url;
        this.modified_time = modified_time;
    }

}





