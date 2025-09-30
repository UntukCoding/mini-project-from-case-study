Backend Service Evaluasi Kandidat Berbasis AI

Sebuah backend service yang dirancang untuk mengotomatisasi proses evaluasi kandidat. Sistem ini menerima CV dan laporan studi kasus, lalu menggunakan pipeline AI yang ditenagai oleh Google Gemini dan RAG (Retrieval-Augmented Generation) untuk menghasilkan laporan evaluasi yang terstruktur dan objektif.

Fitur Utama

-   Proses Asinkron: Menggunakan Redis dan BullMQ untuk menangani evaluasi yang berjalan lama tanpa memblokir API.
-   Evaluasi Berbasis AI: Memanfaatkan LLM Chaining untuk orkestrasi proses evaluasi yang kompleks.
-   Retrieval-Augmented Generation (RAG): Menggunakan ChromaDB sebagai *vector database* untuk memberikan konteks (deskripsi pekerjaan & rubrik penilaian) yang akurat ke LLM.
-   API Terstruktur: Menyediakan endpoint RESTful yang jelas untuk memulai evaluasi dan memeriksa hasil.
-   Penanganan Error yang Tangguh:Worker dirancang agar tidak berhenti total saat satu pekerjaan gagal, memastikan sistem tetap berjalan.

Explanation of Design Choices

Bagian ini menjelaskan beberapa keputusan arsitektur dan teknis utama yang diambil selama pengembangan proyek.

-   Arsitektur Asinkron (Non-Blocking):Keputusan paling fundamental adalah memisahkan API Server dari proses Worker menggunakan task queue (BullMQ & Redis). Ini dipilih untuk memastikan user experience yang optimal. API yang bersifat non-blocking adalah standar industri untuk tugas yang membutuhkan waktu lebih dari beberapa detik (seperti pemanggilan LLM), karena dapat menghindari *request timeout* dan memberikan respons instan kepada pengguna.

-   Integrasi LLM via Custom `EmbeddingFunction`:Daripada melakukan proses embedding secara manual di setiap service yang membutuhkan, sebuah kelas `Qdrant Embedding Function` kustom dibuat. Kelas ini bertindak sebagai "jembatan" antara Gemini dan Qdrant. Pendekatan ini memusatkan semua logika embedding di satu lokasi dan merupakan cara yang direkomendasikan untuk berintegrasi dengan ChromaDB. Hasilnya, kode di `qdrant-db-and-ai-connect.js` dan `qdrant-db-service.js` menjadi jauh lebih bersih dan fokus pada tugas utamanya.

-   **Strategi RAG dengan Multi-Koleksi:** Data untuk deskripsi pekerjaan dan rubrik penilaian sengaja disimpan dalam koleksi terpisah (`job_description` dan `scoring_rubric`) di ChromaDB. Ini adalah sebuah *trade-off* yang sedikit menambah kompleksitas pada saat *ingestion* (pengisian data). Namun, keuntungan dalam akurasi *retrieval* sangat signifikan, karena sistem dapat mengambil konteks yang paling relevan dan spesifik untuk setiap jenis tugas evaluasi yang berbeda (menilai CV vs. menilai proyek).

-   **Penyimpanan File Lokal vs. Cloud Storage:** Untuk lingkup mini project dengan tenggat waktu yang singkat, diputuskan untuk menyimpan file yang diunggah di *filesystem* lokal server. Ini adalah pilihan pragmatis yang mempercepat pengembangan. Disadari bahwa ini adalah sebuah *trade-off*, dan untuk lingkungan produksi, langkah selanjutnya adalah menggantinya dengan layanan *Object Storage* (seperti AWS S3 atau Google Cloud Storage) untuk mencapai persistensi, skalabilitas, dan keandalan yang lebih baik.

## Teknologi yang Digunakan

-   **Backend:** Node.js, Express.js
-   **Database:** MySQL (connection oleh Prisma ORM)
-   **Vector Database:** Qdrant
-   **Task Queue:** BullMQ
-   **Message Broker:** Redis
-   **LLM:** Google Gemini (via `@google/genai`)
-   **File Handling:** Multer
-   **Validation:** Joi

## Setup dan Instalasi

Pastikan Anda telah menginstal prasyarat berikut di sistem Anda:
-   Node.js (v18 atau lebih baru)
-   NPM atau Yarn
-   Docker dan Docker Compose (untuk menjalankan Redis, Qdrant & Mysql )
-   Git

**Langkah-langkah Instalasi:**

1.  **Clone repositori ini:**
    ```bash
    git clone https://github.com/UntukCoding/mini-project-from-case-study.git
    ```

2.  **Install dependensi proyek:**
    ```bash
    npm install
    ```

3.  **Setup variabel lingkungan:**
    * Buat salinan dari file `.env.example` dan beri nama `.env`.
        ```bash
        cp .env.example .env
        ```
    * Buka file `.env` dan isi semua variabel yang diperlukan, terutama `DATABASE_URL`, `REDIS_URL`, dan `GOOGLE_API_KEY`.

4.  **Setup Database (Prisma):**
    * Jalankan migrasi Prisma untuk membuat tabel `EvaluationJob` di database MySQL Anda.
        ```bash
        npx prisma migrate dev
        ```

5.  **Jalankan Layanan Pendukung (Redis & Qdrant & Mysql):**
    * Cara termudah adalah menggunakan Docker. Pastikan Docker Desktop sedang berjalan, lalu jalankan:
        ```bash
        docker run -d --name redis-stack -p 6379:6379 redis/redis-stack-server:latest
        docker run -d --name redis-stack -p 6379:6379 ${pwd}/var/lib/mysql mysql // abaikan ini jika sudah mempunyai database mysql yang berjalan pada docker atau xampp
        docker run -d --name qdrant -p 6333:6333 -v $(pwd)/qdrant_storage:/qdrant/storage qdrant/qdrant
        ```
    * Pastikan `REDIS_URL` di `.env` Anda sesuai dengan konfigurasi Redis.

6.  **Isi Vector Database (Ingestion):**
    * Jalankan skrip ini **satu kali** untuk mengisi ChromaDB dengan data deskripsi pekerjaan dan rubrik penilaian.
        ```bash
        node lib/utils/qdrant-db-and-ai-connect.js
        ```

## Menjalankan Aplikasi

Aplikasi ini berjalan dalam **dua proses terpisah**. Anda perlu membuka dua terminal.

1.  **Di Terminal 1 - Jalankan API Server:**
    ```bash
    npm run start
    # atau: node lib/index.js
    ```
    Server akan berjalan di `http://localhost:3000`.

2.  **Di Terminal 2 - Jalankan Worker:**
    ```bash
    npm run worker
    # atau: node lib/config/worker_eval.js
    ```
    Worker akan mulai mendengarkan tugas baru dari antrian Redis.

## Dokumentasi API

### 1. Menggungah File

-   **Endpoint:** `POST /uploads`
-   **Deskripsi:** Mengunggah file CV dan Laporan Proyek
-   **Request Body:** `multipart/form-data`
    -   `cv` (File): File CV kandidat (PDF, DOCX, TXT).
    -   `projectReport` (File): File laporan studi kasus (PDF, DOCX, TXT).
-   **Respons Sukses (202 Accepted):**
    ```json
    {
    "status": "success",
    "message": "Files uploaded successfully. Please proceed to evaluation.",
    "data": {
        "cvPath": "path file cv",
        "projectReportPath": "path file project report"
      }
    }
    ```

### 1. Memulai Evaluasi

-   **Endpoint:** `POST /evaluate`
-   **Deskripsi:** Memulai proses evaluasi secara asinkron.
-   **Request Body:** `multipart/form-data`
    -   `cvPath` (String): Path File CV yang didaptkan dari Endpoint /uploads.
    -   `projectReport` (File): Path File Project Report yang didaptkan dari Endpoint /uploads.
-   **Respons Sukses (202 Accepted):**
    ```json
    {
      "id": "c6a2e2d1-8b4e-4c1f-9b2a-3f4e5d6c7b8a",
      "status": "queued"
    }
    ```

### 2. Memeriksa Hasil Evaluasi

-   **Endpoint:** `GET /result/:id`
-   **Deskripsi:** Melakukan *polling* untuk memeriksa status dan hasil dari sebuah pekerjaan evaluasi.
-   **URL Params:**
    -   `id` (string, UUID): ID pekerjaan yang didapat dari endpoint `/evaluate`.
-   **Respons Saat Proses (200 OK):**
    ```json
    {
      "id": "c6a2e2d1-8b4e-4c1f-9b2a-3f4e5d6c7b8a",
      "status": "processing"
    }
    ```
-   **Respons Saat Selesai (200 OK):**
    ```json
    {
      "id": "c6a2e2d1-8b4e-4c1f-9b2a-3f4e5d6c7b8a",
      "status": "completed",
      "result": {
        "cv_match_rate": 0.85,
        "cv_feedback": "Strong candidate with relevant backend and AI experience.",
        "project_score": 8,
        "project_feedback": "The project demonstrates a solid understanding of RAG and async processing.",
        "overall_summary": "This is a highly recommended candidate for the role..."
      }
    }
    ```
