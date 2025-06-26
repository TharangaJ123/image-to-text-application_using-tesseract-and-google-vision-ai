# 📸✨ **Image Text Extractor**  

**Extract text from images effortlessly using Tesseract OCR & Google Vision AI!**  

A powerful yet simple web app that converts text from images (PNG, JPG, etc.) into editable and searchable content. Perfect for digitizing documents, receipts, or handwritten notes.  

---

## 🚀 **Features**  

✔ **Dual OCR Power** – Combines **Tesseract** (open-source) & **Google Vision AI** (high accuracy) for best results.  
✔ **Easy Upload** – Drag & drop or browse to upload images.  
✔ **Clean Output** – Extracted text is displayed in a readable, formatted way.  
✔ **Compare Results** – Optionally view outputs from both OCR engines side by side.  
✔ **Multi-Language Support** – Works with multiple languages.  

---

## 🛠 **Tech Stack**  

### **Backend**  
- **Tesseract OCR** (Offline text extraction)  
- **Google Vision AI** (Cloud-based high-accuracy OCR)  
- **Node.js / Express** (API server)  

### **Frontend**  
- **React.js** (Interactive UI)  
- **Tailwind CSS / Material UI** (Styling)  
- **Axios** (API calls)  

---

## ⚡ **Quick Start**  

### **1. Clone & Install**  
```bash
git clone https://github.com/yourusername/image-text-extractor.git  
cd image-text-extractor  
npm install  
cd client  
npm install  
```

### **2. Set Up Google Vision API**  
- Get a **Google Cloud API key** and add it to `.env`:  
```env
GOOGLE_APPLICATION_CREDENTIALS="path/to/your-key.json"
```

### **3. Run the App**  
```bash
npm run dev   # Starts both backend & frontend
```
Open **[http://localhost:3000](http://localhost:3000)** and start extracting text!  

---

## 📸 **Screenshots**  

| Upload Image | Extracted Text |
|-------------|----------------|
| ![Upload Screen](https://via.placeholder.com/400x200?text=Upload+Image) | ![Result Screen](https://via.placeholder.com/400x200?text=Extracted+Text) |

---

## 📜 **License**  
MIT License – Free for personal and commercial use.  

---

**🔍 Need accurate text extraction? Just upload an image and let the magic happen!** 🎉  

👉 *Try it now!* 🚀  

--- 
