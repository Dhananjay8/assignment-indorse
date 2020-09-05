const rootPrefix = '..';

class Validator {
  constructor() {}

  static validateName(name) {
    if (typeof name !== 'string') {
      return false;
    }

    return /^[a-zA-Z]+$/.test(name);
  }

  static validateGenericUrl(url) {
    if (url == '') {
      return false;
    }

    if (typeof url !== 'string') {
      return false;
    }

    return /^(http(s)?:\/\/)?([a-z0-9-_]{1,256}\.)+[a-z]{2,15}\b([a-z0-9@:%_+.\[\]\-{}!'",~#?&;/=*]*)$/i.test(url);
  }
}

module.exports = Validator;
