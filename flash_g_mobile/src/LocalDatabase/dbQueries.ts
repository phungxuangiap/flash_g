const userPreferencesQuery = `
    CREATE TABLE IF NOT EXISTS UserPreference (
        _id INTEGER DEFAULT 1,
        colorPreference TEXT,
        languagePreference TEXT,
        modePreference INTEGER,
        restrictModePreference INTEGER,
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
        active_status TEXT DEFAULT 'active',
        remote_id TEXT DEFAULT ''
   )
`;
const card = `
   CREATE TABLE IF NOT EXISTS Card (
        _id TEXT PRIMARY KEY,
        desk_id TEXT,
        user_id TEXT,
        author_id TEXT,
        original_id TEXT,
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
        active_status TEXT DEFAULT 'active',
        remote_id TEXT DEFAULT '',
        remote_desk_id TEXT DEFAULT ''
   )
`;
const image = `
    CREATE TABLE IF NOT EXISTS Image (
        _id TEXT PRIMARY KEY,
        remote_id TEXT,
        remote_desk_id TEXT,
        desk_id TEXT,
        type TEXT,
        img_url TEXT,
        modified_time TEXT
    )
`;
const getUserPreferenceQuery = `
    SELECT * FROM UserPreference WHERE _id = ?
`;
const createNewUserPreferenceQuery = `
    INSERT INTO UserPreference (
        _id,
        colorPreference,
        languagePreference,
        modePreference,
        restrictModePreference
    ) VALUES (?, ?, ?, ?, ?)
`;
const updateUserPreferenceQuery = `
    INSERT INTO UserPreference (
        _id,
        colorPreference,
        languagePreference,
        modePreference,
        restrictModePreference
    ) VALUES(?, ?, ?, ?, ?)
    ON CONFLICT(_id) DO UPDATE SET 
        _id = excluded._id,
        colorPreference = excluded.colorPreference,
        languagePreference = excluded.languagePreference,
        modePreference = excluded.modePreference,
        restrictModePreference = excluded.restrictModePreference
`;
const deleteUserPreferenceQuery = `
    DELETE FROM UserPreference
`;
const createNewImageQuery = `
    INSERT INTO Image (
        _id,
        remote_id,
        remote_desk_id,
        desk_id,
        type,
        img_url,
        modified_time) VALUES (?, ?, ?, ?, ?, ?, ?)    
`;

const getImageQuery = `
    SELECT * FROM Image WHERE desk_id = ?
`;
const getAllImageQuery = `
    SELECT * FROM Image
`;
const updateImageQuery = `
    INSERT INTO Image (
        _id,
        remote_id,
        remote_desk_id,
        desk_id,
        type,
        img_url,
        modified_time
    ) VALUES(?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(_id) DO UPDATE SET 
        _id = excluded._id,
        remote_id = excluded.remote_id,
        remote_desk_id = excluded.remote_desk_id,
        desk_id = excluded.desk_id,
        type = excluded.type,
        img_url = excluded.img_url,
        modified_time = excluded.modified_time
`;
const deleteImageQuery = `
    DELETE FROM Image WHERE desk_id = ?
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
        modified_time,
        remote_id,
        active_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        modified_time,
        remote_id,
        active_status
    ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        modified_time = excluded.modified_time,
        remote_id = excluded.remote_id,
        active_status = excluded.active_status
`;
const deleteDeskQuery = `
    UPDATE Desk
    SET active_status = 'deleted'
    WHERE _id = ?
`;

const getListDesksQuery = `
    SELECT * FROM Desk
`;
const getDeskQuery = `
    SELECT * FROM Desk WHERE _id = ?
`
const getListCurrentCardsOfDeskQuery = `
    SELECT * FROM Card WHERE desk_id = ? AND last_preview <= ?
`;
const getListCurrentCardsQuery = `
    SELECT * FROM Card WHERE last_preview <=?
`;
const getAllDesksQuery = `
    SELECT * FROM Desk WHERE user_id = ?
`;
const getAllCardsQuery = `
    SELECT * FROM Card WHERE user_id = ?
`;
const getAllCardsOfDeskQuery = `
    SELECT * FROM Card WHERE desk_id = ?
`;
const getDeskOfRemoteDeskIdQuery = `
    SELECT * FROM Desk WHERE remote_id = ?
`;
const createNewCardQuery = `
    INSERT INTO Card (
        _id,
        desk_id,
        user_id,
        author_id,
        original_id,
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
        active_status,
        remote_id, 
        remote_desk_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;
const updateCardQuery = `
    INSERT INTO Card (
        _id,
        desk_id,
        user_id,
        author_id,
        original_id,
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
        active_status,
        remote_id,
        remote_desk_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(_id) DO UPDATE SET
        _id = excluded._id,
        desk_id = excluded.desk_id,
        user_id = excluded.user_id,
        author_id = excluded.author_id,
        original_id = excluded.original_id,
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
        active_status = excluded.active_status,
        remote_id = excluded.remote_id,
        remote_desk_id = excluded.remote_desk_id
`;

const updateCardOfRemoteIdQuery = `
    INSERT INTO Card (
        _id,
        desk_id,
        user_id,
        author_id,
        original_id,
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
        active_status,
        remote_id,
        remote_desk_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(remote_id) DO UPDATE SET
        _id = excluded._id,
        desk_id = excluded.desk_id,
        user_id = excluded.user_id,
        author_id = excluded.author_id,
        original_id = excluded.original_id,
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
        active_status = excluded.active_status,
        remote_id = excluded.remote_id,
        remote_desk_id = excluded.remote_desk_id
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

const removeCardOfRemoteIdQuery = `
    DELETE FROM Card WHERE remote_id = ? AND _id = ""
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
const cleanImageQuery = `
    DELETE FROM Image
`;

export {
    card, desk, user, image, userPreferencesQuery
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
    getImageQuery,
    updateImageQuery,
    deleteImageQuery,
    createNewImageQuery,
    getAllImageQuery,
    getAllDesksQuery,
    getDeskQuery,
    getDeskOfRemoteDeskIdQuery,
    updateCardOfRemoteIdQuery,
    removeCardOfRemoteIdQuery,
    cleanImageQuery,
    createNewUserPreferenceQuery,
    updateUserPreferenceQuery,
    deleteUserPreferenceQuery,
    getUserPreferenceQuery,
};


