"""
ResNet-50 architecture — confirmed from checkpoint metadata field:
  ckpt['architecture'] == 'resnet50'
  ckpt['num_classes']  == 38
  ckpt['fc.weight']    shape (38, 2048)

The final fully-connected layer (fc) is replaced with Linear(2048, num_classes).
"""

import torch.nn as nn
import torchvision.models as models


class ResNetModel(nn.Module):
    """ResNet-50 fine-tuned for crop leaf disease classification."""

    def __init__(self, num_classes: int = 38) -> None:
        super().__init__()
        base = models.resnet50(weights=None)
        base.fc = nn.Linear(base.fc.in_features, num_classes)
        # Expose all ResNet50 children directly so the state_dict keys
        # (conv1, bn1, layer1 … layer4, fc) match the checkpoint exactly.
        self.conv1   = base.conv1
        self.bn1     = base.bn1
        self.relu    = base.relu
        self.maxpool = base.maxpool
        self.layer1  = base.layer1
        self.layer2  = base.layer2
        self.layer3  = base.layer3
        self.layer4  = base.layer4
        self.avgpool = base.avgpool
        self.fc      = base.fc

    def forward(self, x):
        x = self.conv1(x)
        x = self.bn1(x)
        x = self.relu(x)
        x = self.maxpool(x)
        x = self.layer1(x)
        x = self.layer2(x)
        x = self.layer3(x)
        x = self.layer4(x)
        x = self.avgpool(x)
        x = x.flatten(1)
        x = self.fc(x)
        return x


def get_model(num_classes: int = 38) -> ResNetModel:
    """Return an uninitialised ResNetModel ready for load_state_dict."""
    return ResNetModel(num_classes=num_classes)
