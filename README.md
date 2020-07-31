# Hoard

## Why?

Because sometimes you need to store sensitive data on disk but maybe you don't have access to a database, or the database (sqlite) does not support encryption by default (yes, I know about sqlcipher but that's not free).

So this way is a simple way you can keep your sensitive data (JS objects for now) on the disk in a relatively secure mode (AES encrypted).

## API

|function|parameters|returns|description|
|--|--|--|--|
|lock|hoard - Buffer, key - Buffer|string|encrypts the data from the hoard using the key|
|unlock|hoard - String, key - Buffer|object|decrypts the data from the hoard using the key|
|save|hoard - Buffer, path - String|nothing|saves the hoard to the disk|
|load|path - String, key - Buffer|object|loads the hoard from the disk|

Basically _lock_ and _unlock_ are used inside _save_ and _load_

## Future?

Maybe allow saving any kind of data not only JS objects
