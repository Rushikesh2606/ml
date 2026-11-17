# ResNet Model

## Purpose
This directory holds the trained ResNet model checkpoint and its architecture definition.

## ⚠️ Confirm the Exact Variant First
ResNet comes in many variants (ResNet-18, 34, 50, 101, 152, Wide-ResNet, etc.).
**Do not assume any variant.** Check the training script / paper before proceeding.
The variant determines the layer structure — loading the wrong architecture will silently produce garbage predictions.

## Files Required

| File | Description |
|------|-------------|
| `model.pth` | PyTorch checkpoint — **must** contain a `model_state_dict` key |
| `architecture.py` | Python module defining or importing the exact ResNet variant used |

## Integration Checklist

1. **Confirm the ResNet variant** (e.g. `resnet50`) from your training configuration.

2. **Place `model.pth` here.**
   The checkpoint must have been saved with:
   ```python
   torch.save({'model_state_dict': model.state_dict(), ...}, 'model.pth')
   ```

3. **Create `architecture.py`.**
   Either import from `torchvision.models` or define a custom subclass.
   The service imports it as:
   ```python
   from app.models.resnet.architecture import ResNetModel
   ```
   Export a callable that returns an instantiated model ready for `load_state_dict`.

4. **Populate `app/data/class_mapping.json`** (shared with other models — verify consistency).

5. **Populate `app/data/preprocessing_config.json` → `resnet` section.**
   Set `input_size`, `mean`, and `std`. ImageNet defaults are `mean=[0.485, 0.456, 0.406]`
   and `std=[0.229, 0.224, 0.225]` — but **only use these if your training used them**.

6. **Verify via API.**
   POST a test image to `/api/predict/resnet` and confirm sane predictions.

## Notes
- Do **not** commit `model.pth` to version control — it is in `.gitignore`.
- The variant must be documented here once confirmed. Update this README.
