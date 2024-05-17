
const path = require('path');
const fs = require('fs');

function getLocales() {
    const fileContents = fs.readFileSync('./angular.json');
    const string = fileContents.toString();
    const json = JSON.parse(string);
    const i18n = json['projects']['gren-map-visualization']['i18n'];
    const locales = Object.keys(i18n['locales']);
    locales.unshift(i18n['sourceLocale']);
    return locales;
}

const LOCALES = getLocales();

const DIST_DIRECTORY = '../dist/gren-map-visualization/';

function localizedBundleDir(languageCode) {
    return path.join(__dirname, DIST_DIRECTORY, languageCode);  // nosemgrep : path-join-resolve-traversal
}

exports.LOCALES = LOCALES;
exports.localizedBundleDir = localizedBundleDir;
