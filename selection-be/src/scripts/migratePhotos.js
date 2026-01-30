import mongoose from 'mongoose';
import Selection from '../models/Selection.js';
import connectDB from '../config.js/config.js';

const migratePhotos = async () => {
    try {
        await connectDB();
        const selections = await Selection.find({});

        for (const item of selections) {
            // If photo exists but photos array is empty/non-existent
            if (item.photo && (!item.photos || item.photos.length === 0)) {
                item.photos = [item.photo];
                await item.save();
                console.log(`Migrated ${item.name}`);
            }
        }
        console.log('Migration complete');
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

migratePhotos();
