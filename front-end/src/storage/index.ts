class LocalStorage {
  key: string;
  constructor(key: string) {
    this.key = key;
  }

  get data() {
    const data = localStorage.getItem(this.key);    
    if (typeof data === 'string') {
      return JSON.parse(data);
    }
    return null;
  }

  set data(data: any) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  delete() {
    localStorage.removeItem(this.key);
  }
}

const AuthStorage = new LocalStorage('token');

export default AuthStorage;