// projects-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'projects';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    projectType: { type: String, required: true },
    photosUrl: { type: Array, required: true },
    cords: { type: Object, required: true },
    user_id: { type: Number, required: true },
    inverstors: { type: Array, defaultValue: [] },
    onGoing: { type: Boolean, defaultValue: false },
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);

};
