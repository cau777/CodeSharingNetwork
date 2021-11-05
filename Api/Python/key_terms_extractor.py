# Modified version of my previous project: Key-Terms-Extractor (https://github.com/cau777/Key-Terms-Extractor)
import string

from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from collections import defaultdict
from math import log
import json
import argparse
import base64

text: str
count: int
dataset_path: str
document_count: int
dataset_terms: dict[str, int]
save_keywords: bool


def parse_args():
    global text, count, dataset_path, document_count, dataset_terms, save_keywords
    
    parser = argparse.ArgumentParser()
    parser.add_argument("--text")  # Text to analyse encoded in base64
    parser.add_argument("--count")  # Number of key terms to output
    parser.add_argument("--dataset")  # Path to the dataset
    parser.add_argument("--save")  # Flag to determine whether the found keywords need to be saved in the dataset  (1 == True, 0 == False)
    
    args = parser.parse_args()
    text = base64.b64decode(args.text, validate=True).decode("utf-8")
    count = int(args.count)
    save_keywords = int(args.save) == 1
    
    dataset_path = args.dataset
    
    try:
        with open(dataset_path, "r") as f:
            dataset: dict = json.load(f)
    except (ValueError, OSError):
        dataset = {"document_count": 0, "terms": dict()}
    
    document_count = int(dataset["document_count"])
    dataset_terms = defaultdict(int, dataset["terms"])


def main():
    lemmatizer = WordNetLemmatizer()
    words_to_remove = set(list(stopwords.words("english")) + list(string.punctuation))
    tokens = word_tokenize(text.lower().replace("\n", " "))
    word_freq = defaultdict(int)
    total_words = 0
    
    for token in tokens:
        word = lemmatizer.lemmatize(token)
        if word not in words_to_remove:
            total_words += 1
            word_freq[word] += 1
    
    word_scores: dict[str, float] = dict()
    for word, freq in word_freq.items():
        tf = freq / total_words
        idf = log((document_count + 1) / (dataset_terms[word] + 1)) + 1
        score = tf * idf
        word_scores[word] = score
    
    # Output the specified number of words
    print(*map(lambda item: item[0], sorted(word_scores.items(), key=lambda item: -item[1])[:count]))
    
    if save_keywords:
        # Adds the words in the document to the dataset
        for word in word_freq:
            dataset_terms[word] += 1
        
        with open(dataset_path, "w") as f:
            json.dump({"document_count": document_count + 1, "terms": dataset_terms}, f)


if __name__ == "__main__":
    parse_args()
    main()
