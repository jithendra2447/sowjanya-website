import mongoose from 'mongoose';

const cmsSettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  updated_at: { type: Date, default: Date.now }
});

export const CmsSetting = mongoose.models.CmsSetting || mongoose.model('CmsSetting', cmsSettingSchema);
