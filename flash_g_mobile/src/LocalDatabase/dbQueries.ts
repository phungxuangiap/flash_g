const userPreferencesQuery = `
    CREATE TABLE IF NOT EXISTS UserPreferences (
        _id INTEGER DEFAULT 1,
        colorPreference TEXT,
        languagePreference TEXT,
        PRIMARY KEY(_id)
    )
`;
const user = `
    CREATE TABLE IF NOT EXISTS User (
        _id TEXT PRIMARY KEY,
        email TEXT,
        password TEXT,
        user_name TEXT,
        modified_time TEXT
    )
`;
const desk = `
   CREATE TABLE IF NOT EXISTS Desk (
        _id TEXT PRIMARY KEY,
        user_id TEXT,
        title TEXT,
        primary_color TEXT,
        new_card INTEGER,
        inprogress_card INTEGER,
        preview_card INTEGER,
        modified_time TEXT
   )
`;
const card = `
   CREATE TABLE IF NOT EXISTS Card (
        _id TEXT PRIMARY KEY,
        desk_id TEXT,
        status TEXT,
        level INTEGER,
        last_preview TEXT,
        vocab TEXT,
        description TEXT,
        sentence TEXT,
        vocab_audio TEXT,
        sentence_audio TEXT,
        type TEXT,
        modified_time TEXT
   )
`;
const createNewDeskQuery = `
    INSERT INTO Desk (
        _id, 
        user_id, 
        title, 
        primary_color, 
        new_card, 
        inprogress_card, 
        preview_card,
        modified_time) VALUES (?, ?, ?, ?, ?, ?, ?, ${JSON.stringify(new Date())})
`;
const createNewUserQuery = `
    INSERT INTO User (
        _id, 
        email,
        password, 
        user_name,
        modified_time) VALUES (?, ?, ?, ?, ${JSON.stringify(new Date())})
`;
const getUserQuery = `
    SELECT * FROM User
`;
const deleteUserQuery = `
    DELETE FROM User WHERE _id = ?
`;
const updateDeskQuery = `
    INSERT INTO Desk (
        _id,
        user_id,
        title,
        primary_color,
        new_card,
        inprogress_card,
        preview_card,
        modified_time
    ) VALUES(?, ?, ?, ?, ?, ?, ?, ${JSON.stringify(new Date())})
    ON CONFLICT(_id) DO UPDATE SET 
        _id = excluded._id,
        user_id = excluded.user_id,
        title = excluded.title,
        primary_color = excluded.primary_color,
        new_card = excluded.new_card,
        inprogress_card = excluded.inprogress_card,
        preview_card = excluded.preview_card,
        modified_time = ${JSON.stringify(new Date())}    
`;
const deleteDeskQuery = `
    DELETE FROM Desk WHERE _id = ?
`;

const getListDesksQuery = `
    SELECT * FROM Desk
`;

const getListCurrentCardsOfDeskQuery = `
    SELECT * FROM Card WHERE desk_id = ? AND last_preview <= ?
`;
const getListCurrentCardsQuery = `
    SELECT * FROM Card WHERE last_preview <=?
`;
const getAllCardsQuery = `
    SELECT * FROM Card WHERE user_id = ?
`;
const getAllCardsOfDeskQuery = `
    SELECT * FROM Card WHERE desk_id = ?
`;
const createNewCardQuery = `
    INSERT INTO Card (
        _id,
        desk_id,
        status,
        level,
        last_preview,
        vocab,
        description,
        sentence,
        vocab_audio,
        sentence_audio,
        type,
        modified_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ${JSON.stringify(new Date())})
`;
const updateCardQuery = `
    INSERT INTO Card (
        _id,
        desk_id,
        status,
        level,
        last_preview,
        vocab,
        description,
        sentence,
        vocab_audio,
        sentence_audio,
        type,
        modified_time
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ${JSON.stringify(new Date())})
    ON CONFLICT(_id) DO UPDATE SET
        _id = excluded._id,
        desk_id = excluded.desk_id,
        status = excluded.status,
        level = excluded.level,
        last_preview = excluded.last_preview,
        vocab = excluded.vocab,
        description = excluded.description,
        sentence = excluded.sentence,
        vocab_audio = excluded.vocab_audio,
        sentence_audio = excluded.sentence_audio,
        type = excluded.type,
        modified_time = ${JSON.stringify(new Date())};
`;

const deleteCardQuery = `
    DELETE FROM Card WHERE _id = ?
`;

const cleanAllDeskQuery = `
    DELETE FROM Desk
`;

const cleanAllCardQuery = `
    DELETE FROM Card
`;
const cleanAllUserQuery = `
    DELETE FROM User
`;

export {
    card, desk, user, userPreferencesQuery
    , createNewDeskQuery, createNewUserQuery
    , updateDeskQuery, deleteDeskQuery
    , getListDesksQuery, getListCurrentCardsOfDeskQuery
    , getAllCardsQuery, createNewCardQuery
    , updateCardQuery, deleteCardQuery,
    getListCurrentCardsQuery,
    getUserQuery,
    deleteUserQuery,
    getAllCardsOfDeskQuery,
    cleanAllDeskQuery,
    cleanAllCardQuery,
    cleanAllUserQuery,
};


