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

const updateDeskQuery = `
    UPDATE Desk SET 
        title = ?,
        primary_color = ?,
        new_card = ?,
        inprogress_card = ?,
        preview_card = ?,
        modified_time = ${JSON.stringify(new Date())}        
    WHERE _id = ?
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
    SELECT * FROM Card
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
    UPDATE Card SET 
        status = ?,
        level = ?,
        last_preview = ?,
        vocab = ?,
        description = ?,
        sentence = ?,
        vocab_audio = ?,
        sentence_audio = ?,
        type = ?,
        modified_time = ${JSON.stringify(new Date())}
    WHERE _id = ?
`;
const deleteCardQuery = `
    DELETE FROM Card WHERE _id = ?
`;

export {
    card, desk, user, userPreferencesQuery
    , createNewDeskQuery, createNewUserQuery
    , updateDeskQuery, deleteDeskQuery
    , getListDesksQuery, getListCurrentCardsOfDeskQuery
    , getAllCardsQuery, createNewCardQuery
    , updateCardQuery, deleteCardQuery,
    getListCurrentCardsQuery,
};


