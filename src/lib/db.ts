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

  async get<T>(key: string) {
    try {
      const result = this.db.getItem(key);

      return result as T;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }

  async getAll<T>(keys: string[]) {
    try {
      const result = (
        await Promise.all(keys.map((key) => this.get<T>(key)))
      ).reduce<T[]>((acc, value) => {
        if (value) {
          acc.push(value);
          return acc;
        }
        return acc;
      }, []);

      return result;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }

  async set<T>(key: string, value: T) {
    try {
      const result = this.db.setItem(key, value);

      return result as T;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }

  async setAll<T extends { id: string }>(items: T[]) {
    if (items.length === 0) return;
    if (!items[0].id) {
      console.error("Items must have an id!");
      return;
    }

    try {
      (await Promise.all(items.map((item) => this.set(item.id, item)))).reduce<
        T[]
      >((acc, value) => {
        if (value) {
          acc.push(value);
          return acc;
        }
        return acc;
      }, []);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }

  async remove(key: string) {
    try {
      this.db.removeItem(key);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }

  async clear(): Promise<void> {
    try {
      this.db.clear();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
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
