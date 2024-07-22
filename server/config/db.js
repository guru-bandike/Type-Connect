import mongoose from 'mongoose';

const dbName = 'type-n-connect';

export const connectToMongoDbAtlas = async () => {
  const atlasUserName = process.env.MONGODB_ATLAS_USER_NAME;
  const atlasPassword = process.env.MONGODB_ATLAS_USER_PASSWORD;
  const url = `mongodb+srv://${atlasUserName}:${atlasPassword}@cluster0.xvzfzw2.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

  await mongoose.connect(url);
  console.log('Successfully conneted to DB.');
};
