import os
import re
import pandas as pd
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from torch.optim import Adam
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import kagglehub

# -----------------------------
# 1. Data Loading & Cleaning
# -----------------------------
def download_dataset(dataset_name: str, filename: str) -> pd.DataFrame:
    """Download Kaggle dataset and load as pandas DataFrame."""
    dataset_path = kagglehub.dataset_download(dataset_name)
    file_path = os.path.join(dataset_path, filename)
    df = pd.read_csv(file_path, encoding='latin-1')
    print(f"Dataset loaded: {file_path}")
    return df

def clean_text(text: str) -> str:
    """Lowercase, remove punctuation, and extra whitespace."""
    if pd.isna(text):
        return ""
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

def create_combined_text(df: pd.DataFrame, desired_fields: list) -> pd.Series:
    """Combine multiple text fields into a single cleaned text column."""
    fields_to_use = [f for f in desired_fields if f in df.columns]
    print("Using fields for combined_text:", fields_to_use)
    combined = df[fields_to_use].fillna('').agg(' '.join, axis=1)
    return combined.apply(clean_text)

# -----------------------------
# 2. Pair Generation
# -----------------------------
def compute_embeddings(texts: list, model_name='paraphrase-MiniLM-L6-v2') -> np.ndarray:
    """Compute normalized embeddings for a list of texts."""
    model = SentenceTransformer(model_name)
    return model.encode(texts, convert_to_numpy=True, normalize_embeddings=True)

def generate_pairs(embeddings: np.ndarray, pos_thresh=0.85, neg_thresh=0.3, categories=None):
    """Generate positive and negative pairs based on cosine similarity."""
    cos_sim_matrix = cosine_similarity(embeddings)
    n = len(embeddings)
    
    pos_pairs = []
    neg_pairs = []

    for i in range(n):
        similar_idx = np.where(cos_sim_matrix[i, i+1:] > pos_thresh)[0] + (i+1)
        for j in similar_idx:
            if categories is None or categories[i] == categories[j]:
                pos_pairs.append((i, j))
        
        dissimilar_idx = np.where(cos_sim_matrix[i, :] < neg_thresh)[0]
        for j in dissimilar_idx:
            if i != j:
                neg_pairs.append((i, j))

    return pos_pairs, neg_pairs

# -----------------------------
# 3. PyTorch Dataset
# -----------------------------
class SiameseDataset(Dataset):
    def __init__(self, df, pos_pairs, neg_pairs):
        self.df = df
        self.texts = df['combined_text'].tolist()
        self.pairs = [(i,j,1) for i,j in pos_pairs] + [(i,j,0) for i,j in neg_pairs]

    def __len__(self):
        return len(self.pairs)

    def __getitem__(self, idx):
        i, j, label = self.pairs[idx]
        return self.texts[i], self.texts[j], torch.tensor(label, dtype=torch.float32)

# -----------------------------
# 4. Siamese Model
# -----------------------------
class SiameseNetwork(nn.Module):
    def __init__(self, model_name='paraphrase-MiniLM-L6-v2'):
        super().__init__()
        self.encoder = SentenceTransformer(model_name)

    def forward(self, text_list):
        # Trainable embeddings
        embeddings = self.model(text_list)
        return embeddings

# -----------------------------
# 5. Contrastive Loss
# -----------------------------
class ContrastiveLoss(nn.Module):
    def __init__(self, margin=1.0):
        super().__init__()
        self.margin = margin

    def forward(self, output1, output2, label):
        euclidean_distance = nn.functional.pairwise_distance(output1, output2)
        loss = torch.mean(
            label * euclidean_distance**2 +
            (1 - label) * torch.clamp(self.margin - euclidean_distance, min=0.0)**2
        )
        return loss

# -----------------------------
# 6. Training Loop
# -----------------------------
def train_siamese(model, dataloader, optimizer, loss_fn, device):
    model.train()
    total_loss = 0
    for text1, text2, label in dataloader:
        optimizer.zero_grad()
        text1 = list(text1)
        text2 = list(text2)
        emb1 = model(text1).to(device)
        emb2 = model(text2).to(device)
        label = label.to(device)
        loss = loss_fn(emb1, emb2, label)
        loss.backward()
        optimizer.step()
        total_loss += loss.item()
    return total_loss / len(dataloader)

# -----------------------------
# 7. Main Execution
# -----------------------------
def main():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    # Load dataset
    df = download_dataset(
        "devi5723/e-commerce-cosmetics-dataset",
        "E-commerce  cosmetic dataset.csv"
    )
    desired_fields = ['brand', 'product_name', 'category', 'shades', 'ingredients', 'form', 'type', 'color']
    df['combined_text'] = create_combined_text(df, desired_fields)

    # Compute embeddings & generate pairs
    texts = df['combined_text'].tolist()
    embeddings = compute_embeddings(texts)
    categories = df['category'].tolist() if 'category' in df.columns else None
    pos_pairs, neg_pairs = generate_pairs(embeddings, pos_thresh=0.85, neg_thresh=0.3, categories=categories)
    print(f"Generated {len(pos_pairs)} positive pairs and {len(neg_pairs)} negative pairs.")

    # Dataset & DataLoader
    dataset = SiameseDataset(df, pos_pairs, neg_pairs)
    dataloader = DataLoader(dataset, batch_size=16, shuffle=True)

    # Model, Loss, Optimizer
    model = SiameseNetwork().to(device)
    loss_fn = ContrastiveLoss(margin=0.8)
    optimizer = Adam(model.parameters(), lr=2e-5)

    # Training
    epochs = 5
    for epoch in range(epochs):
        avg_loss = train_siamese(model, dataloader, optimizer, loss_fn, device)
        print(f"Epoch {epoch+1}/{epochs}, Avg Loss: {avg_loss:.4f}")

    # Save embeddings for nearest neighbor search
    final_embeddings = model(texts).detach().cpu().numpy()
    np.save("product_embeddings.npy", final_embeddings)
    print("Training complete. Embeddings saved to 'product_embeddings.npy'.")

if __name__ == "__main__":
    main()