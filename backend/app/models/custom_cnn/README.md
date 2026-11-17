# Custom CNN Model

## Purpose
This directory holds the trained Custom CNN model checkpoint and its architecture definition.

## Files Required

| File | Description |
|------|-------------|
| `model.pth` | PyTorch checkpoint — **must** contain a `model_state_dict` key |
| `architecture.py` | Python module defining the model class (e.g. `CustomCNN`) |

## Integration Checklist

1. **Place `model.pth` here.**
   The checkpoint must have been saved with:
   ```python
   torch.save({'model_state_dict': model.state_dict(), ...}, 'model.pth')
   ```
   The inference service will call `torch.load('model.pth')['model_state_dict']`.

2. **Create `architecture.py`.**
   Define a class (e.g. `CustomCNN`) that inherits from `torch.nn.Module`.
   The service imports it as:
   ```python
   from app.models.custom_cnn.architecture import CustomCNN
   ```

3. **Populate `app/data/class_mapping.json`.**
   Set `classes` (dict of `"int_index": "label"`), `num_classes`, and `dataset`.

4. **Populate `app/data/preprocessing_config.json` → `custom_cnn` section.**
   Set `input_size` (e.g. `[224, 224]`), `mean`, and `std` to match training normalization.

5. **Verify via API.**
   Start the backend and POST a test image to `/api/predict/custom_cnn`.
   Confirm predictions are sane before recording evaluation results.

## Notes
- Do **not** commit `model.pth` to version control — it is in `.gitignore`.
- Keep `architecture.py` in sync with the checkpoint's layer names.
