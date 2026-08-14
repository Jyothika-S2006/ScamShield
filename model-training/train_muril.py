!pip install transformers datasets torch --quiet
import pandas as pd
from datasets import Dataset
from transformers import AutoTokenizer, AutoModelForSequenceClassification, TrainingArguments, Trainer
# 1. Load CSV (upload it to the Kaggle notebook first)
df = pd.read_csv("/kaggle/working/final_dataset.csv")
dataset = Dataset.from_pandas(df)
dataset = dataset.train_test_split(test_size=0.2)
# 2. Load MuRIL
model_name = "google/muril-base-cased"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=2)
def tokenize(batch):
    return tokenizer(batch["message_text"], padding="max_length", truncation=True, max_length=128)
tokenized = dataset.map(tokenize, batched=True)
tokenized = tokenized.rename_column("is_scam", "labels")
# 3. Train
args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=4,
    per_device_train_batch_size=16,
    eval_strategy="epoch",
    save_strategy="epoch",
)
trainer = Trainer(
    model=model,
    args=args,
    train_dataset=tokenized["train"],
    eval_dataset=tokenized["test"],
)
trainer.train()
# 4. Save the model
model.save_pretrained("./scamshield-muril")
tokenizer.save_pretrained("./scamshield-muril")