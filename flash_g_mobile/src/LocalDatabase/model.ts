
export class User {
    id : string;
    email : string;
    password : string;
    user_name : string;
    modified_time: string;
    constructor(id: string, email: string, password: string, user_name: string, modified_time:string){
        this.id = id;
        this.email = email;
        this.password = password;
        this.user_name = user_name;
        this.modified_time = modified_time;
    }
}

export class Desk {
    id : string;
    user_id : string;
    title : string;
    primary_color : string;
    new_card : number;
    inprogress_card : number;
    preview_card : number;
    modified_time: string;
    constructor(id: string, user_id: string, title: string, primary_color: string, new_card: number, inprogress_card: number, preview_card: number, modified_time:string){
        this.id = id;
        this.user_id = user_id;
        this.title = title;
        this.primary_color = primary_color;
        this.new_card = new_card;
        this.inprogress_card = inprogress_card;
        this.preview_card = preview_card;
        this.modified_time = modified_time;
    }
}

export class Card {
    id:string;
    desk_id : string;
    status : string;
    level : number;
    last_preview : Date;
    vocab : string;
    description : string;
    sentence : string;
    vocab_audio : string;
    sentence_audio : string;
    type : string;
    modified_time: string;
    constructor(id:string, desk_id: string, status: string, level: number, last_preview: Date, vocab: string, description: string, sentence: string, vocab_audio: string, sentence_audio: string, type: string, modified_time:string){
        this.id = id;
        this.desk_id = desk_id;
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
    }
}





