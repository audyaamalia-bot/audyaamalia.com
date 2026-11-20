# audya amalia — website + admin

Remake tampilan audyaamalia.com dengan Next.js 15. Semua konten diisi lewat panel admin di `/admin`.

## Fitur
- **Halaman publik:** Home (slideshow full-screen), Works (grid 1 kolom persegi + judul di atas foto), detail karya (teks kiri, foto kanan, galeri), Texts, Biography, Publications, Press, Contact, dan menu hamburger overlay.
- **Admin (`/admin`):** login password, CRUD Works (upload banyak gambar, pilih cover, urutan, draft/tampil), Texts, Home Slides, Biography & Contact (foto, bio, CV), Publications, dan Press.
- Teks memakai **Markdown**. Gambar otomatis dikecilkan di browser (maks 2400px) sebelum diupload.

## Stack
| | Lokal | Vercel |
|---|---|---|
| Database | PGlite (file `.data/pglite`, tanpa setup) | Neon Postgres (`DATABASE_URL`) |
| Gambar | `.data/uploads` | Vercel Blob (`BLOB_READ_WRITE_TOKEN`) |

Tabel dibuat otomatis saat pertama jalan.

## Jalankan lokal
```bash
npm install
npm run seed        # isi struktur awal: 14 judul karya + placeholder
npm run dev         # http://localhost:3000  — admin: /admin  (password dev: "admin")
```

## Deploy ke Vercel
1. Push folder ini ke GitHub, lalu **Import Project** di Vercel.
2. Di tab **Storage** project, buat & connect:
   - **Neon** (Postgres) → otomatis menambah `DATABASE_URL`
   - **Blob** → otomatis menambah `BLOB_READ_WRITE_TOKEN`
3. Di **Settings → Environment Variables**, tambahkan:
   - `ADMIN_PASSWORD` — password login admin
   - `AUTH_SECRET` — string acak panjang (mis. hasil `openssl rand -hex 32`)
4. Redeploy.
5. (Opsional) Isi struktur awal ke database produksi:
   `DATABASE_URL="postgres://..." npm run seed`
   Gambar placeholder seed ada di `public/placeholder`. Ganti dengan foto asli lewat admin.

## Mengisi konten
- **Works:** Admin → Works → Edit → isi deskripsi, upload foto. Foto pertama di galeri tampil di samping teks. Cover tampil di grid Works.
- **Urutan Works:** angka "Urutan", yang kecil tampil di atas.
- **Biography CV:** pakai `## EDUCATION`, `## SOLO EXHIBITIONS`, lalu `- item` per baris.
- **Texts:** selama belum ada tulisan yang tampil, halaman ini menampilkan "Coming soon".

> Batas upload per request di Vercel 4.5 MB. Kompresi otomatis di admin menjaga ukuran tetap di bawah itu.

## Keamanan
- **Login admin:** password dibandingkan secara constant-time. Setelah 5 kali gagal dalam 15 menit, IP tersebut dikunci (data tersimpan di tabel `login_attempts`). Sesi memakai cookie JWT `httpOnly` + `secure` + `sameSite=lax` yang berlaku 7 hari.
- **Akses admin dicek dua lapis:** di middleware dan di setiap halaman/aksi server. Server Actions Next.js juga sudah otomatis menolak request dari origin lain (CSRF).
- **Upload:** hanya menerima gambar (JPG/PNG/WebP/GIF/AVIF) yang dicek dari isi file, bukan dari ekstensinya. SVG/HTML ditolak dan ukuran maksimal 4.5 MB.
- **Konten:** Markdown disanitasi dengan whitelist tag. `<script>`, `on*=`, `javascript:`, dan `<iframe>` dibuang. Field URL hanya menerima `http(s)`. Daftar gambar karya hanya menerima URL milik karya itu sendiri.
- **Header:** CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy. Halaman admin diberi `noindex` + `no-store`.
- **Logout paksa semua sesi:** ganti `AUTH_SECRET` di Vercel lalu redeploy.

### Tanggung jawab saat deploy
- Pakai `ADMIN_PASSWORD` yang panjang (≥ 16 karakter, unik) dan `AUTH_SECRET` acak (`openssl rand -hex 32`). Tanpa kedua variabel ini, admin tidak bisa dipakai di production.
- Aktifkan 2FA di akun Vercel, GitHub, dan Neon.
- Neon sudah menyediakan point-in-time restore. Cek retensinya di dashboard Neon.
- Jalankan `npm audit` dan update dependensi secara berkala.
