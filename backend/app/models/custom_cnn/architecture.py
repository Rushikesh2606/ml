"""
Custom CNN architecture — reconstructed from checkpoint state_dict.

Layer structure confirmed from model.pth keys:
  features.0  : ConvBlock(3  → 32,  3×3)
  features.1  : ConvBlock(32 → 64,  3×3)
  features.2  : ConvBlock(64 → 128, 3×3)
  features.3  : ConvBlock(128→ 256, 3×3)

Each ConvBlock (indices 0,1,3,4 in block):
  block.0  = Conv2d(in, out, 3, padding=1, bias=False)
  block.1  = BatchNorm2d(out)
  block.2  = ReLU (no parameter — not in state_dict)
  block.3  = Conv2d(out, out, 3, padding=1, bias=False)
  block.4  = BatchNorm2d(out)
  + MaxPool2d(2,2) after each block

Classifier (indices from state_dict: 2 and 5 → dropout at 1 and 4):
  AdaptiveAvgPool2d → Flatten
  classifier.0 = Flatten / no-param
  classifier.1 = Dropout(p)      ← no weights
  classifier.2 = Linear(256,128)
  classifier.3 = ReLU            ← no weights
  classifier.4 = Dropout(p)      ← no weights
  classifier.5 = Linear(128, num_classes)
"""

import torch
import torch.nn as nn


class ConvBlock(nn.Module):
    """Two consecutive Conv-BN-ReLU layers followed by MaxPool."""

    def __init__(self, in_channels: int, out_channels: int) -> None:
        super().__init__()
        self.block = nn.Sequential(
            nn.Conv2d(in_channels, out_channels, kernel_size=3, padding=1, bias=False),  # 0
            nn.BatchNorm2d(out_channels),                                                 # 1
            nn.ReLU(inplace=True),                                                        # 2
            nn.Conv2d(out_channels, out_channels, kernel_size=3, padding=1, bias=False), # 3
            nn.BatchNorm2d(out_channels),                                                 # 4
            nn.ReLU(inplace=True),                                                        # 5
            nn.MaxPool2d(kernel_size=2, stride=2),                                        # 6
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.block(x)


class CustomCNN(nn.Module):
    """
    Custom CNN for crop leaf disease classification.
    Input : (B, 3, 128, 128)
    Output: (B, num_classes)  — raw logits
    """

    def __init__(self, num_classes: int = 38, dropout: float = 0.5) -> None:
        super().__init__()
        self.features = nn.Sequential(
            ConvBlock(3,   32),   # 0
            ConvBlock(32,  64),   # 1
            ConvBlock(64,  128),  # 2
            ConvBlock(128, 256),  # 3
        )
        self.pool = nn.AdaptiveAvgPool2d((1, 1))
        self.classifier = nn.Sequential(
            nn.Flatten(),                      # 0 — no weights
            nn.Dropout(p=dropout),             # 1 — no weights
            nn.Linear(256, 128),               # 2
            nn.ReLU(inplace=True),             # 3 — no weights
            nn.Dropout(p=dropout),             # 4 — no weights
            nn.Linear(128, num_classes),       # 5
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.features(x)
        x = self.pool(x)
        x = self.classifier(x)
        return x


def get_model(num_classes: int = 38) -> CustomCNN:
    """Return an un-initialised CustomCNN ready for load_state_dict."""
    return CustomCNN(num_classes=num_classes)
