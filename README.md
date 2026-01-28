# Library System with Geolocation

* **Fitur Utama:**
    * CRUD Buku (Create, Read, Update, Delete).
    * Simulasi Autentikasi menggunakan Header (`x-user-role`).
    * Peminjaman Buku dengan pencatatan koordinat (Latitude & Longitude).

## Teknologi yang Digunakan
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MySQL
* **ORM:** Sequelize
* **Tools:** Postman (untuk testing API)

## Dokumentasi API 

| Method | Endpoint | Deskripsi | Headers (Auth) | Body Payload (JSON) |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/books` | Menampilkan semua buku | - | - |
| **GET** | `/api/books/:id` | Menampilkan detail buku | - | - |
| **POST** | `/api/books` | Menambah buku baru | `x-user-role: admin` | `{"title": "Judul", "author": "Penulis", "stock": 10}` |
| **PUT** | `/api/books/:id` | Mengupdate data buku | `x-user-role: admin` | `{"title": "Judul Baru", "author": "Penulis", "stock": 5}` |
| **DELETE** | `/api/books/:id` | Menghapus buku | `x-user-role: admin` | - |
| **POST** | `/api/borrow` | Meminjam buku & Lokasi | `x-user-role: user`<br>`x-user-id: [ID_Angka]` | `{"bookId": 1, "latitude": -6.2088, "longitude": 106.8456}` |

> **Catatan:**
> * **Admin Mode:** Memerlukan header `x-user-role: admin`.
> * **User Mode:** Memerlukan header `x-user-role: user` dan `x-user-id` (sebagai simulasi login).
> * **Geolocation:** Endpoint `/api/borrow` wajib menyertakan latitude & longitude.

## Logika Sistem

### 1. Simulasi Otentikasi & Hak Akses
Sistem tidak menggunakan login/JWT, melainkan validasi manual melalui **Header HTTP**:

* **Role Admin (`x-user-role: admin`)**
    * **Boleh:** Menambah buku (`POST`), Mengedit buku (`PUT`), Menghapus buku (`DELETE`).
    * **Boleh:** Melihat semua daftar buku.
* **Role User (`x-user-role: user`)**
    * **Boleh:** Meminjam buku (`POST /borrow`) dan melihat daftar buku.
    * **DILARANG:** Menambah, mengedit, atau menghapus buku.
    * *Respon:* Jika User mencoba akses endpoint Admin, server akan menolak dengan status `403 Forbidden`.

### 2. Validasi & Manipulasi Data
* **Validasi Input:** Judul buku (`title`) dan Penulis (`author`) tidak boleh kosong saat ditambahkan.
* **Manajemen Stok:**
    * Saat buku dipinjam, stok buku di database otomatis **berkurang 1**.
    * Jika stok buku 0, peminjaman akan gagal (validasi stok).

### 3. Fitur Geolocation
* Setiap kali User meminjam buku, sistem **wajib** menerima data lokasi (`latitude` & `longitude`) dari Request Body.
* Data koordinat ini disimpan ke tabel `BorrowLogs` sebagai bukti lokasi peminjaman.


## Bukti Eksekusi Postman
### POST Book
<img width="1920" height="1080" alt="Screenshot (660)" src="https://github.com/user-attachments/assets/922677aa-1ac6-4687-be39-d5b002060c33" />
<img width="1920" height="1080" alt="Screenshot (661)" src="https://github.com/user-attachments/assets/0272bb35-5cc8-47ba-bbab-2af2db156fb5" />

### GET Book
<img width="1920" height="1080" alt="Screenshot (662)" src="https://github.com/user-attachments/assets/a50ad7aa-2b65-4744-9c3d-ad52e63a804f" />

### POST Borrow
<img width="1920" height="1080" alt="Screenshot (663)" src="https://github.com/user-attachments/assets/f6ce202a-5fd3-4d81-921d-5755be3b0154" />
<img width="1920" height="1080" alt="Screenshot (664)" src="https://github.com/user-attachments/assets/6340e519-b5eb-4053-9600-23e4bc8390f0" />

### PUT Book
<img width="1920" height="1080" alt="Screenshot (669)" src="https://github.com/user-attachments/assets/cb2cdd3c-aac5-4d0b-ba20-434e0d1b4edf" />
<img width="1920" height="1080" alt="Screenshot (670)" src="https://github.com/user-attachments/assets/8cf9a314-45a5-40c1-820a-a5d73a46bbb3" />

### DELETE Book
<img width="1920" height="1080" alt="Screenshot (671)" src="https://github.com/user-attachments/assets/1ef592c3-7938-4050-bd0a-2f01df6c1794" />
* **Bukti jika bukan admin, maka request akan ditolak.
  <img width="1920" height="1080" alt="Screenshot (672)" src="https://github.com/user-attachments/assets/08adfcb8-a83f-4ffe-83d9-b8b279c869db" />
