import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Leaf, Cpu, Zap, Layers, Clock, AlertTriangle, Loader2, CheckCircle } from 'lucide-react';
import { useModels } from '../hooks/useModels';
import { predictDisease } from '../services/api';

const MODEL_ICONS = { custom_cnn: Layers, resnet: Cpu, efficientnet: Zap };
const MODEL_FRAMEWORK = { custom_cnn: 'PyTorch', resnet: 'PyTorch', efficientnet: 'TFLite' };

function formatClassLabel(rawLabel) {
  if (!rawLabel) return { crop: 'Unknown', condition: 'Unknown', isHealthy: false, fullFormatted: 'Unknown' };
  const parts = rawLabel.split('___');
  const crop = (parts[0] || 'Unknown').replace(/_/g, ' ').replace(/\(maize\)/gi, '').trim();
  const rawCondition = (parts[1] || 'Unknown').replace(/_/g, ' ').trim();
  const isHealthy = rawCondition.toLowerCase().includes('healthy');
  const condition = isHealthy ? 'Healthy Foliage' : rawCondition;
  return {
    crop: crop.charAt(0).toUpperCase() + crop.slice(1),
    condition,
    isHealthy,
    fullFormatted: `${crop} — ${condition}`,
  };
}

export default function ImageUploadSection() {
  const { models, loading: modelsLoading } = useModels();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [fileError, setFileError] = useState(null);
  const inputRef = useRef();

  const handleFile = useCallback((f) => {
    setFileError(null);
    setResult(null);
    setError(null);
    if (!f) return;
    if (!['image/jpeg', 'image/png'].includes(f.type)) {
      setFileError('Only JPG/JPEG and PNG images are accepted.');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setFileError('File size must be under 10 MB.');
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!file || !selectedModel) return;
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('model_id', selectedModel);
      const res = await predictDisease(fd);
      setResult(res);
    } catch (err) {
      setError(err?.response?.data?.detail || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const availableModels = models.filter(m => m.status === 'AVAILABLE');
  const canSubmit = file && selectedModel && !isLoading && availableModels.some(m => m.model_id === selectedModel);

  return (
    <section className="py-20 px-4 bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10">

          {/* LEFT: Upload + Model Select */}
          <div className="space-y-6">
            {/* Drop zone */}
            <div>
              <label className="block text-gray-300 font-semibold mb-3">1. Upload Leaf Image</label>
              {!preview ? (
                <div
                  onClick={() => inputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={onDrop}
                  className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-16 flex flex-col items-center justify-center gap-4 transition-all duration-200
                    ${isDragging ? 'border-leaf-400 bg-leaf-900/20' : 'border-gray-600 hover:border-leaf-600 bg-gray-900/40 hover:bg-gray-800/40'}`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-leaf-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-gray-200 font-medium">Drop a leaf image here</p>
                    <p className="text-gray-500 text-sm mt-1">or click to browse</p>
                    <p className="text-gray-600 text-xs mt-2">JPG, JPEG, PNG · Max 10 MB</p>
                  </div>
                  <input ref={inputRef} type="file" accept="image/jpeg,image/png" className="hidden"
                    onChange={e => handleFile(e.target.files[0])} />
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-gray-700/50 bg-gray-900">
                  <img src={preview} alt="Preview" className="w-full h-64 object-contain bg-gray-950" />
                  <div className="absolute top-3 right-3">
                    <button onClick={removeFile}
                      className="w-8 h-8 rounded-full bg-gray-900/90 border border-gray-700 flex items-center justify-center hover:bg-red-900/50 hover:border-red-700 transition-colors">
                      <X className="w-4 h-4 text-gray-300" />
                    </button>
                  </div>
                  <div className="p-3 border-t border-gray-800">
                    <p className="text-gray-300 text-sm font-medium truncate">{file.name}</p>
                    <p className="text-gray-500 text-xs">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
              )}
              {fileError && (
                <div className="mt-2 flex items-center gap-2 text-red-400 text-sm">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {fileError}
                </div>
              )}
            </div>

            {/* Model selector */}
            <div>
              <label className="block text-gray-300 font-semibold mb-3">2. Select Architecture</label>
              {modelsLoading ? (
                <div className="flex items-center gap-2 text-gray-400 text-sm py-4">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading models…
                </div>
              ) : (
                <div className="space-y-3">
                  {models.map(m => {
                    const Icon = MODEL_ICONS[m.model_id] || Cpu;
                    const isAvailable = m.status === 'AVAILABLE';
                    const isSelected = selectedModel === m.model_id;
                    return (
                      <button
                        key={m.model_id}
                        onClick={() => isAvailable && setSelectedModel(m.model_id)}
                        disabled={!isAvailable}
                        title={!isAvailable ? 'Model pending integration — weights not yet uploaded' : undefined}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left
                          ${isSelected ? 'border-leaf-500 bg-leaf-900/20' : ''}
                          ${isAvailable && !isSelected ? 'border-gray-700/50 bg-gray-800/40 hover:border-leaf-700/60 hover:bg-gray-800/60' : ''}
                          ${!isAvailable ? 'border-gray-800/50 bg-gray-900/20 opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-leaf-700/40' : 'bg-gray-800'}`}>
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-leaf-300' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-gray-200'}`}>{m.name}</p>
                          <p className="text-xs text-gray-500">{MODEL_FRAMEWORK[m.model_id]}</p>
                        </div>
                        {isAvailable ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-leaf-900/50 border border-leaf-700/40 text-leaf-400 text-xs">
                            <CheckCircle className="w-3 h-3" /> Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-900/30 border border-amber-700/40 text-amber-400 text-xs">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        )}
                      </button>
                    );
                  })}
                  {availableModels.length === 0 && (
                    <p className="text-amber-400 text-xs mt-2 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      No models are available yet. Upload model weights to enable inference.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full py-4 rounded-xl font-semibold text-sm transition-all duration-200
                bg-leaf-600 hover:bg-leaf-500 text-white
                disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400
                flex items-center justify-center gap-2"
            >
              {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing…</> : <><Scan className="w-5 h-5" /> Analyze Leaf</>}
            </button>
            <p className="text-xs text-gray-600 text-center">
              Research predictions only. Not for actual agricultural decision-making.
            </p>
          </div>

          {/* RIGHT: Results */}
          <div>
            <label className="block text-gray-300 font-semibold mb-3">3. Result</label>
            <AnimatePresence mode="wait">
              {!result && !isLoading && !error && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="rounded-2xl border border-dashed border-gray-700 bg-gray-900/40 p-16 flex flex-col items-center justify-center gap-4 text-center h-full min-h-80">
                  <div className="w-14 h-14 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center">
                    <Leaf className="w-7 h-7 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium">Upload a leaf image to begin</p>
                    <p className="text-gray-600 text-sm mt-1">Your prediction will appear here</p>
                  </div>
                </motion.div>
              )}

              {isLoading && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="rounded-2xl border border-leaf-700/40 bg-gray-900/40 p-16 flex flex-col items-center justify-center gap-4 text-center h-full min-h-80">
                  <Loader2 className="w-12 h-12 text-leaf-400 animate-spin" />
                  <p className="text-gray-300 font-medium">Analyzing leaf image…</p>
                </motion.div>
              )}

              {error && (
                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="rounded-2xl border border-red-700/40 bg-red-900/10 p-8 flex flex-col gap-3 h-full min-h-80">
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-semibold">Prediction Error</span>
                  </div>
                  <p className="text-gray-300 text-sm">{error}</p>
                </motion.div>
              )}

              {result && (
                <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="rounded-2xl border border-leaf-700/40 bg-gray-900/60 overflow-hidden">
                  {preview && <img src={preview} alt="Uploaded" className="w-full h-48 object-contain bg-gray-950 border-b border-gray-800" />}
                  <div className="p-6 space-y-4">
                    {result.status === 'unavailable' ? (
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-900/20 border border-amber-700/40">
                        <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-amber-300 font-semibold text-sm">Model Not Available</p>
                          <p className="text-amber-500 text-xs mt-1">{result.message}</p>
                        </div>
                      </div>
                    ) : result.status === 'error' ? (
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-red-900/20 border border-red-700/40">
                        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-red-300 font-semibold text-sm">Inference Error</p>
                          <p className="text-red-400 text-xs mt-1">{result.message}</p>
                        </div>
                      </div>
                    ) : (() => {
                        const info = formatClassLabel(result.predicted_class);
                        return (
                          <>
                            <div className={`p-4 rounded-xl border ${
                              info.isHealthy
                                ? 'bg-emerald-950/30 border-emerald-600/40'
                                : 'bg-leaf-950/30 border-leaf-600/40'
                            }`}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                                  Identified Diagnosis
                                </span>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                  info.isHealthy
                                    ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
                                    : 'bg-amber-900/60 text-amber-300 border border-amber-700/50'
                                }`}>
                                  {info.isHealthy ? '🌿 Healthy Foliage' : '⚠️ Foliar Pathology'}
                                </span>
                              </div>

                              <div className="mb-1">
                                <span className="text-xs text-leaf-400 font-medium">Crop Species: {info.crop}</span>
                                <h3 className="text-white font-display font-bold text-xl">{info.condition}</h3>
                              </div>

                              {result.confidence != null && (
                                <div className="mt-3 pt-3 border-t border-white/5">
                                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                                    <span>Model Confidence</span>
                                    <span className="font-bold text-leaf-400">{(result.confidence * 100).toFixed(2)}%</span>
                                  </div>
                                  <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                                    <div
                                      className="h-full rounded-full bg-leaf-500 transition-all duration-500"
                                      style={{ width: `${(result.confidence * 100).toFixed(1)}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            {result.top_predictions?.length > 0 && (
                              <div className="p-3.5 rounded-xl bg-gray-850/60 border border-gray-800">
                                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2.5">
                                  Top Prediction Distribution
                                </p>
                                <div className="space-y-2">
                                  {result.top_predictions.slice(0, 5).map((p, i) => {
                                    const pInfo = formatClassLabel(p.class_label);
                                    return (
                                      <div key={i} className="space-y-1">
                                        <div className="flex items-center justify-between text-xs">
                                          <span className="text-gray-300 truncate font-medium">
                                            {pInfo.crop} — {pInfo.condition}
                                          </span>
                                          <span className="text-leaf-400 font-mono font-semibold ml-2">
                                            {(p.confidence * 100).toFixed(2)}%
                                          </span>
                                        </div>
                                        <div className="h-1 rounded-full bg-gray-800 overflow-hidden">
                                          <div
                                            className="h-full rounded-full bg-leaf-600/70"
                                            style={{ width: `${Math.min(100, p.confidence * 100)}%` }}
                                          />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                              <div className="flex items-center gap-1.5">
                                <span>Architecture:</span>
                                <span className="px-2 py-0.5 rounded-full bg-gray-800 border border-gray-700 text-gray-300 font-medium">
                                  {result.model_name}
                                </span>
                              </div>
                              {result.processing_time_ms && (
                                <span className="font-mono text-gray-400">
                                  ⚡ {result.processing_time_ms.toFixed(1)} ms
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-gray-600 border-t border-gray-800 pt-2 text-center">
                              ⚠️ Academic research tool. Results are produced from deep learning models trained on PlantVillage.
                            </p>
                          </>
                        );
                      })()}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function Scan(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/>
      <path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
      <line x1="7" y1="12" x2="17" y2="12"/>
    </svg>
  );
}
