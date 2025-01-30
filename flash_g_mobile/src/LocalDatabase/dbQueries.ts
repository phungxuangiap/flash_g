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
        author_id TEXT,
        original_id TEXT,
        access_status TEXT,
        title TEXT,
        description TEXT,
        primary_color TEXT,
        new_card INTEGER,
        inprogress_card INTEGER,
        preview_card INTEGER,
        modified_time TEXT,
        active_status TEXT DEFAULT 'active'
   )
`;
const card = `
   CREATE TABLE IF NOT EXISTS Card (
        _id TEXT PRIMARY KEY,
        desk_id TEXT,
        user_id TEXT,
        status TEXT,
        level INTEGER,
        last_preview TEXT,
        vocab TEXT,
        description TEXT,
        sentence TEXT,
        vocab_audio TEXT,
        sentence_audio TEXT,
        type TEXT,
        modified_time TEXT,
        active_status TEXT DEFAULT 'active'
   )
`;
const createNewDeskQuery = `
    INSERT INTO Desk (
        _id, 
        user_id, 
        author_id,
        original_id,
        access_status,
        title, 
        description,
        primary_color, 
        new_card, 
        inprogress_card, 
        preview_card,
        modified_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;
const createNewUserQuery = `
    INSERT INTO User (
        _id, 
        email,
        password, 
        user_name,
        modified_time) VALUES (?, ?, ?, ?, ?)
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
        author_id,
        original_id,
        access_status,
        title,
        description,
        primary_color,
        new_card,
        inprogress_card,
        preview_card,
        modified_time
    ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(_id) DO UPDATE SET 
        _id = excluded._id,
        user_id = excluded.user_id,
        author_id = excluded.author_id,
        original_id = excluded.original_id,
        access_status = excluded.access_status,
        title = excluded.title,
        description = excluded.description,
        primary_color = excluded.primary_color,
        new_card = excluded.new_card,
        inprogress_card = excluded.inprogress_card,
        preview_card = excluded.preview_card,
        modified_time = excluded.modified_time
`;
const deleteDeskQuery = `
    UPDATE Desk
    SET active_status = 'deleted'
    WHERE _id = ?
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
        user_id,
        status,
        level,
        last_preview,
        vocab,
        description,
        sentence,
        vocab_audio,
        sentence_audio,
        type,
        modified_time,
        active_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;
const updateCardQuery = `
    INSERT INTO Card (
        _id,
        desk_id,
        user_id,
        status,
        level,
        last_preview,
        vocab,
        description,
        sentence,
        vocab_audio,
        sentence_audio,
        type,
        modified_time,
        active_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(_id) DO UPDATE SET
        _id = excluded._id,
        desk_id = excluded.desk_id,
        user_id = excluded.user_id,
        status = excluded.status,
        level = excluded.level,
        last_preview = excluded.last_preview,
        vocab = excluded.vocab,
        description = excluded.description,
        sentence = excluded.sentence,
        vocab_audio = excluded.vocab_audio,
        sentence_audio = excluded.sentence_audio,
        type = excluded.type,
        modified_time = excluded.modified_time,
        active_status = excluded.active_status
`;

const deleteCardQuery = `
    UPDATE Card
    SET active_status = 'deleted',
        modified_time = ?
    WHERE _id = ?
`;
const removeCardQuery = `
    DELETE FROM Card WHERE _id = ?
`
const removeDeskQuery = `
    DELETE FROM Desk WHERE _id = ?
`
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
    removeCardQuery,
    removeDeskQuery,
};


