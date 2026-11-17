# EfficientNet Model (TFLite)

## Purpose
This directory holds the trained EfficientNet model in TFLite format for inference via `tflite-runtime`.

## ⚠️ Confirm Variant and Quantization Before Proceeding
EfficientNet variants (B0–B7, Lite0–Lite4) differ in input resolution, depth, and expected normalization.
Quantized models (INT8, FP16) have different input `dtype` and normalization ranges.
**Do not assume any variant or quantization level.** Check the export script / paper.

## Files Required

| File | Description |
|------|-------------|
| `model.tflite` | Exported TFLite flatbuffer |

## Integration Checklist

1. **Confirm the EfficientNet variant** (e.g. `efficientnet-b0`) and whether quantized (INT8/FP16/None).

2. **Place `model.tflite` here.**

3. **Populate `app/data/preprocessing_config.json` → `efficientnet` section:**
   - `input_size`: e.g. `[224, 224]` for B0, `[260, 260]` for B1, etc.
   - `mean` / `std`: normalization values used during export.
   - `dtype`: `"float32"` for unquantized, `"uint8"` or `"int8"` for quantized.
   - `quantized`: `true` or `false`.
   - `notes`: record variant name here.

4. **Populate `app/data/class_mapping.json`** (shared — verify consistency with other models).

5. **Verify via API.**
   POST a test image to `/api/predict/efficientnet` and confirm:
   - Input tensor dtype matches your `preprocessing_config`.
   - Output class indices align with `class_mapping`.

## Notes
- Do **not** commit `model.tflite` to version control — it is in `.gitignore`.
- TFLite inference uses `tflite_runtime.interpreter.Interpreter`.
- Quantized INT8 models typically expect inputs in `[0, 255]` uint8 without normalization,
  while float32 models expect normalized `[0, 1]` or `[-1, 1]` depending on training.
