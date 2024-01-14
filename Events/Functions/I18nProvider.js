import { fileURLToPath } from 'node:url';
import path from "node:path";
import chalk from "chalk";
import fs from "node:fs";

class I18nProvider {
    constructor() {
        const localesPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', "Assets", "Language");
        this.availableLocales = new Map(fs.readdirSync(localesPath).map((file) => [path.basename(file, '.json'), path.resolve(localesPath, file)]));
        this.messageProviders = new Map();
        this.filepathPrefix = 'file:';
        this.defaultLocale = 'vi';
    };
    loadFromLocale(locale) {
        let filepath = this.availableLocales.get(locale ?? this.defaultLocale);
        let loaded = filepath !== undefined;
        if (!loaded && locale && locale.startsWith(this.filepathPrefix)) {
            filepath = path.resolve(process.cwd(), locale.slice(this.filepathPrefix.length));
        };
        try {
            if (filepath) {
                this.localeData = I18nProvider.flatten(JSON.parse(fs.readFileSync(filepath, 'utf-8')));
                loaded = true;
            }
        } catch (e) { };
        if (!loaded) {
            this.loadFromLocale(this.defaultLocale);
            console.warn(`Không thể tải tệp ngôn ngữ ${filepath ?? locale}. Sử dụng tệp mặc định.`);
        };
    };
    __switchLanguage(key, replacements) {
        if (this.localeData?.[key]) {
            let message = this.messageProviders.get(key)?.() ?? this.localeData[key];
            if(replacements) {
                Object.entries(replacements).forEach((replacement) => {
                    message = message.replace(`{${replacement[0]}}`, replacement[1].toString());
                });
            };
            return message;
        } else {
            console.log(chalk.red(`Không thể tìm thấy ngôn ngữ "${key}". Vui lòng kiểm tra lại.`));
            return key;
        }
    }
    static flatten(object, objectPath = null, separator = '.') {
        return Object.keys(object).reduce((acc, key) => {
            const newObjectPath = [objectPath, key].filter(Boolean).join(separator);
            return typeof object?.[key] === 'object' ? { ...acc, ...I18nProvider.flatten(object[key], newObjectPath, separator) } : { ...acc, [newObjectPath]: object[key] };
        }, {});
    }                                                   
};

const languageHandler = new I18nProvider();
languageHandler.loadFromLocale("vi");

export const switchLanguage = (id, replacements) => languageHandler.__switchLanguage(id, replacements);