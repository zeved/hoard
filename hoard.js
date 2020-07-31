/*
 * Copyright (c) 2020 Zevedei Ionut
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const crypto = require('crypto-js');
const fs = require('fs');

/**
 * check is the provided JSON string is valid
 *
 * @param {string} JSON
 * @returns {boolean} JSON is valid
 */
const isValidJSON = (json) => {
  try {
    JSON.parse(json);
    return true;
  }
  catch (err) {
    return false;
  }
};

/**
 * checks if the key is a Buffer of 16 bytes
 *
 * @param {Buffer} key
 * @returns {boolean} key is valid
 */
const isValidKey = (key) => {
  try {
    if (key instanceof Buffer === false) {
      throw new Error('[isValidKey]: key must be Buffer');
    }

    if (key.length < 32) {
      throw new Error('[isValidKey]: key must be exactly 16 bytes long');
    }

    return true;
  }
  catch (error) {
    console.error(error);
    return false;
  }
};

/**
 * encrypts the hoard with AES using the provided key
 *
 * @param {Buffer} hoard
 * @param {Buffer} key
 * @returns {string} encrypted hoard
 */
const lock = (hoard, key) => {
  try {
    if (!isValidKey(key)) {
      throw new Error('[lock]: invalid key');
    }

    if (hoard instanceof Buffer === false) {
      throw new Error('[lock]: invalid hoard; must be a Buffer');
    }

    return crypto.AES.encrypt(hoard.toString(), key.toString()).toString();
  }
  catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * decrypts the hoard using the specified key
 *
 * @param {string} hoard
 * @param {Buffer} key
 * @returns {object} resulting object
 */
const unlock = (hoard, key) => {
  try {
    if (!isValidKey(key)) {
      throw new Error('[lock]: invalid key');
    }

    if (typeof(hoard) !== 'string') {
      throw new Error('[lock]: invalid hoard; must be a String');
    }

    const decryptedHoard = crypto.AES.decrypt(hoard, key.toString()).toString(crypto.enc.Utf8);

    if (isValidJSON(decryptedHoard)) {
      return JSON.parse(decryptedHoard);
    }
    else {
      throw new Error('[unlock]: result is not a valid JSON');
    }
  }
  catch (error) {
    console.error(`[unlock]: ${error}`);
    return null;
  }
}

/**
 * save the hoard to a file
 *
 * @param {string} encrypted hoard
 * @param {string} path
 */
const save = async (hoard, path) => {
  try {
    if (typeof(hoard) !== 'string') {
      throw new Error('[save]: invalid hoard; must be a string');
    }

    await fs.writeFileSync(`${path}.hoard`, hoard);
  }
  catch (error) {
    console.error(error);
  }
};

/**
 * loads a hoard from a file
 *
 * @param {string} path
 * @param {Buffer} key
 * @returns {object} the unlocked hoard
 */
const load = async (path, key) => {
  try {
    if (isValidKey(key)) {
      const found = await fs.existsSync(path);
      if (found) {
        let data = await fs.readFileSync(path);
        data = data.toString();
        data = unlock(data, key);
        return data;
      }
      else {
        throw new Error('[load]: hoard not found');
      }
    }
    else {
      throw new Error('[load]: invalid key provided');
    }
  }
  catch (error) {
    console.error(error);
    return null;
  }
}

module.exports = {
  lock,
  unlock,
  save,
  load,
};