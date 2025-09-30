Backend Service Evaluasi Kandidat Berbasis AI

Sebuah backend service yang dirancang untuk mengotomatisasi proses evaluasi kandidat. Sistem ini menerima CV dan laporan studi kasus, lalu menggunakan pipeline AI yang ditenagai oleh Google Gemini dan RAG (Retrieval-Augmented Generation) untuk menghasilkan laporan evaluasi yang terstruktur dan objektif.
Fitur Utama

-   **Proses Asinkron:** Menggunakan Redis dan BullMQ untuk menangani evaluasi yang berjalan lama tanpa memblokir API.
-   **Evaluasi Berbasis AI:** Memanfaatkan LLM Chaining untuk orkestrasi proses evaluasi yang kompleks.
-   **Retrieval-Augmented Generation (RAG):** Menggunakan ChromaDB sebagai *vector database* untuk memberikan konteks (deskripsi pekerjaan & rubrik penilaian) yang akurat ke LLM.
-   **API Terstruktur:** Menyediakan endpoint RESTful yang jelas untuk mengunggah dokumen, memulai evaluasi, dan memeriksa hasil.
-   **Penanganan Error yang Tangguh:** Worker dirancang agar tidak berhenti total saat satu pekerjaan gagal, memastikan sistem tetap berjalan.

Diagram Arsitektur

Arsitektur sistem ini memisahkan API server dari proses worker untuk mencapai responsivitas dan ketahanan yang tinggi.
