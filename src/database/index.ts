import * as SQLite from 'expo-sqlite';

// ✅ Nova API (expo-sqlite v14+)
const database = SQLite.openDatabaseSync('myapp.db');

export default database;