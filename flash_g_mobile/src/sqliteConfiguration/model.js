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
        user_name TEXT
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
        preview_card INTEGER
   )
`;
const card = `
   CREATE TABLE IF NOT EXISTS Card (
        desk_id TEXT,
        status TEXT,
        level INTEGER,
        last_preview TIMESTAMP,
        vocab TEXT,
        description TEXT,
        sentence TEXT,
        vocab_audio TEXT,
        sentence_audio TEXT,
        type TEXT
   )
`;

export {card, desk, user, userPreferencesQuery};
