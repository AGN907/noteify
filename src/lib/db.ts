import localforage from "localforage";

const localDatabase = localforage.createInstance({
  name: "Noteify",
  storeName: "keyvaluepairs",
  driver: localforage.INDEXEDDB,
});

class Database {
  db: LocalForage;

  constructor() {
    this.db = localDatabase;
  }

  async get<T>(key: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this.db
        .getItem(key)
        .then((value) => {
          return resolve(value as T);
        })
        .catch((error) => {
          if (error instanceof Error) {
            console.error(error.message);
          }
          reject(null);
        });
    });
  }

  async set<T>(key: string, value: T): Promise<T> {
    return new Promise((resolve, reject) => {
      this.db
        .setItem(key, value)
        .then((value) => {
          resolve(value);
        })
        .catch((error) => {
          if (error instanceof Error) {
            console.error(error.message);
          }
          reject(null);
        });
    });
  }

  async remove(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db
        .removeItem(key)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          if (error instanceof Error) {
            console.error(error.message);
          }
          reject();
        });
    });
  }

  async clear(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db
        .clear()
        .then(() => {
          resolve();
        })
        .catch((error) => {
          if (error instanceof Error) {
            console.error(error.message);
          }
          reject();
        });
    });
  }
}

class Storage {
  db: Database;
  constructor() {
    this.db = new Database();
  }
}

const storage = new Storage();

export default storage;
