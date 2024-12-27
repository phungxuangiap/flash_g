const userPreferencesQuery = `
    CREATE TABLE IF NOT EXISTS UserPreferences (
        id INTEGER DEFAULT 1,
        colorPreference TEXT,
        languagePreference TEXT,
        PRIMARY KEY(id)
    )
`;
const user = `
    CREATE TABLE IF NOT EXISTS User (
        id TEXT PRIMARY KEY,
        email TEXT,
        password TEXT,
        user_name TEXT,
        modified_time TEXT
    )
`;
const desk = `
   CREATE TABLE IF NOT EXISTS Desk (
        id TEXT PRIMARY KEY,
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
        id TEXT PRIMARY KEY,
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
        id, 
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
        id, 
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
    WHERE id = ?
`;
const deleteDeskQuery = `
    DELETE FROM Desk WHERE id = ?
`;

const getListCurrentDesksQuery = `
    SELECT * FROM Desk
`;

const getListCurrentCardsQuery = `
    SELECT * FROM Card WHERE desk_id = ? AND last_preview <= ?
`;
const getAllCardsQuery = `
    SELECT * FROM Card
`;
const createNewCardQuery = `
    INSERT INTO Card (
        id,
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
    WHERE id = ?
`;
const deleteCardQuery = `
    DELETE FROM Card WHERE id = ?
`;

export {
    card, desk, user, userPreferencesQuery
    , createNewDeskQuery, createNewUserQuery
    , updateDeskQuery, deleteDeskQuery
    , getListCurrentDesksQuery, getListCurrentCardsQuery
    , getAllCardsQuery, createNewCardQuery
    , updateCardQuery, deleteCardQuery,
};
