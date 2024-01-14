import { Database } from "st.db";
import mongodb from "mongodb";
import path from "node:path";
import fs from "node:fs";
/*========================================================
# Tạo mongoDriver cho database package
========================================================*/
const mongoDriver = class {
    constructor(options) {
        this.mongoURL = options.setMongoURL;
        this.databaseName = options.databaseName;
        this.collectionName = options.collectionName;
        this.connectionOptions = options.connectionOptions;
        this.data = null;
        this.collection = null;
    }
    async connect() {
        if (!this.data) {
            this.data = await mongodb.MongoClient.connect(this.mongoURL, this.connectionOptions);
            const db = this.data.db(this.databaseName);
            this.collection = db.collection(this.collectionName);
        };
    }
    async disconnect() {
        if (this.data) {
            await this.data.close();
            this.data = null;
            this.collection = null;
        }
    }
    async clear() {
        var _a;
        await this.connect();
        await ((_a = this.collection) === null || _a === void 0 ? void 0 : _a.deleteMany({}));
    }
    async all() {
        var _a;
        await this.connect();
        const documents = await ((_a = this.collection) === null || _a === void 0 ? void 0 : _a.find().toArray());
        return (documents === null || documents === void 0 ? void 0 : documents.map((doc) => {
            try {
                return { ID: doc._id, data: doc.data };
            } catch (error) {
                return { ID: doc._id, data: null };
            }
        }));
    }
    async has(key) {
        var _a;
        await this.connect();
        const count = await ((_a = this.collection) === null || _a === void 0 ? void 0 : _a.countDocuments({ _id: key }));
        return count !== undefined && count > 0;
    }
    async get(key) {
        var _a;
        await this.connect();
        const document = await ((_a = this.collection) === null || _a === void 0 ? void 0 : _a.findOne({ _id: key }));
        return document && document.data ? document.data : undefined;
    }
    async set(key, value) {
        var _a;
        await this.connect();
        await ((_a = this.collection) === null || _a === void 0 ? void 0 : _a.updateOne({ _id: key }, { $set: { _id: key, data: value } }, { upsert: true }));
        return value;
    }
    async delete(key) {
        var _a;
        await this.connect();
        await ((_a = this.collection) === null || _a === void 0 ? void 0 : _a.deleteOne({ _id: key }));
    }
};

// kết nối đến file config.json
const config = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config.json'), 'utf8'));
// autoresume
export const autoresume = new Database({
    driver: new mongoDriver({
        setMongoURL: config.mongourl || process.env.mongourl, /*url của mongodb*/
        databaseName: "BlackCat-Club", /* tên database của dự án */
        collectionName: "autoresume" /*tên gói database*/
    }),
});
// music data
export const music = new Database({
    driver: new mongoDriver({
        setMongoURL: config.mongourl || process.env.mongourl, /*url của mongodb*/
        databaseName: "BlackCat-Club", /* tên database của dự án */
        collectionName: "music-database" /*tên gói database*/
    }),
});
// welcomeGoodbye
export const welcomeGoodbye = new Database({
    driver: new mongoDriver({
        setMongoURL: config.mongourl || process.env.mongourl, /*url của mongodb*/
        databaseName: "BlackCat-Club", /* tên database của dự án */
        collectionName: "welcomeGoodbye" /*tên gói database*/
    }),
});
// Playlist
export const Playlist = new Database({
    driver: new mongoDriver({
        setMongoURL: config.mongourl || process.env.mongourl, /*url của mongodb*/
        databaseName: "BlackCat-Club", /* tên database của dự án */
        collectionName: "playlist" /*tên gói database*/
    }),
});
// Prefix 
export const Prefix = new Database({
    driver: new mongoDriver({
        setMongoURL: config.mongourl || process.env.mongourl, /*url của mongodb*/
        databaseName: "BlackCat-Club", /* tên database của dự án */
        collectionName: "prefix" /*tên gói database*/
    }),
});
// afkSchema 
export const afkSchema = new Database({
    driver: new mongoDriver({
        setMongoURL: config.mongourl || process.env.mongourl, /*url của mongodb*/
        databaseName: "BlackCat-Club", /* tên database của dự án */
        collectionName: "afk" /*tên gói database*/
    }),
});
// giveawayModel 
export const giveawayModel = new Database({
    driver: new mongoDriver({
        setMongoURL: config.mongourl || process.env.mongourl, /*url của mongodb*/
        databaseName: "BlackCat-Club", /* tên database của dự án */
        collectionName: "giveaways" /*tên gói database*/
    }),
});
// channelSchema 
export const channelSchema = new Database({
    driver: new mongoDriver({
        setMongoURL: config.mongourl || process.env.mongourl, /*url của mongodb*/
        databaseName: "BlackCat-Club", /* tên database của dự án */
        collectionName: "idchannels" /*tên gói database*/
    }),
});

// ranking 
export const setupDefault = new Database({
    driver: new mongoDriver({
        setMongoURL: config.mongourl || process.env.mongourl, /*url của mongodb*/
        databaseName: "BlackCat-Club", /* tên database của dự án */
        collectionName: "setup-default" /*tên gói database*/
    }),
});