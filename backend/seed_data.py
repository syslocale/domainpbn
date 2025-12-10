import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, timezone
import uuid
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def seed_data():
    print("Starting database seeding...")
    
    # Clear existing data
    await db.pbn_sites.delete_many({})
    await db.packages.delete_many({})
    await db.blog_posts.delete_many({})
    await db.faqs.delete_many({})
    await db.pages.delete_many({})
    await db.settings.delete_many({})
    
    # Seed PBN Sites
    pbn_sites = [
        {
            "id": str(uuid.uuid4()),
            "code": "PBN-001",
            "domain_real": "example1.com",
            "niche": "Technology",
            "dr": 65,
            "da": 62,
            "traffic": 15000,
            "spam_score": 1.2,
            "age": 8,
            "price_per_post": 150000,
            "status": "active",
            "notes": "High authority tech blog",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "code": "PBN-002",
            "domain_real": "example2.com",
            "niche": "Health & Wellness",
            "dr": 58,
            "da": 55,
            "traffic": 12000,
            "spam_score": 0.8,
            "age": 6,
            "price_per_post": 120000,
            "status": "active",
            "notes": "Health niche blog",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "code": "PBN-003",
            "domain_real": "example3.com",
            "niche": "Finance",
            "dr": 72,
            "da": 68,
            "traffic": 25000,
            "spam_score": 0.5,
            "age": 10,
            "price_per_post": 200000,
            "status": "active",
            "notes": "Premium finance authority",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "code": "PBN-004",
            "domain_real": "example4.com",
            "niche": "Travel",
            "dr": 48,
            "da": 45,
            "traffic": 8000,
            "spam_score": 1.5,
            "age": 5,
            "price_per_post": 100000,
            "status": "active",
            "notes": "Travel blog",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "code": "PBN-005",
            "domain_real": "example5.com",
            "niche": "Business",
            "dr": 63,
            "da": 60,
            "traffic": 18000,
            "spam_score": 0.9,
            "age": 7,
            "price_per_post": 140000,
            "status": "active",
            "notes": "Business authority site",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "code": "PBN-006",
            "domain_real": "example6.com",
            "niche": "Lifestyle",
            "dr": 52,
            "da": 50,
            "traffic": 10000,
            "spam_score": 1.1,
            "age": 4,
            "price_per_post": 110000,
            "status": "active",
            "notes": "Lifestyle blog",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "code": "PBN-007",
            "domain_real": "example7.com",
            "niche": "Education",
            "dr": 68,
            "da": 65,
            "traffic": 22000,
            "spam_score": 0.6,
            "age": 9,
            "price_per_post": 170000,
            "status": "active",
            "notes": "Education authority",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "code": "PBN-008",
            "domain_real": "example8.com",
            "niche": "Real Estate",
            "dr": 55,
            "da": 53,
            "traffic": 13000,
            "spam_score": 1.0,
            "age": 6,
            "price_per_post": 130000,
            "status": "active",
            "notes": "Real estate blog",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "code": "PBN-009",
            "domain_real": "example9.com",
            "niche": "Marketing",
            "dr": 60,
            "da": 58,
            "traffic": 16000,
            "spam_score": 0.7,
            "age": 7,
            "price_per_post": 145000,
            "status": "active",
            "notes": "Marketing niche",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "code": "PBN-010",
            "domain_real": "example10.com",
            "niche": "E-commerce",
            "dr": 70,
            "da": 67,
            "traffic": 20000,
            "spam_score": 0.4,
            "age": 8,
            "price_per_post": 180000,
            "status": "active",
            "notes": "E-commerce authority",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    await db.pbn_sites.insert_many(pbn_sites)
    print(f"Inserted {len(pbn_sites)} PBN sites")
    
    # Seed Packages
    packages = [
        {
            "id": str(uuid.uuid4()),
            "name": "Paket Starter",
            "slug": "paket-starter",
            "backlink_count": 5,
            "price": 500000,
            "description": "Cocok untuk website baru yang ingin mulai membangun authority. Termasuk 5 backlink dari PBN berkualitas dengan DR 40-60.",
            "is_popular": False,
            "sort_order": 1,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Paket Professional",
            "slug": "paket-professional",
            "backlink_count": 15,
            "price": 1350000,
            "description": "Paket paling populer! 15 backlink dari PBN premium DR 50-70. Ideal untuk meningkatkan ranking dengan cepat dan aman.",
            "is_popular": True,
            "sort_order": 2,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Paket Enterprise",
            "slug": "paket-enterprise",
            "backlink_count": 30,
            "price": 2400000,
            "description": "Untuk bisnis serius yang butuh dominasi SERP. 30 backlink dari PBN high authority DR 60-75 dengan artikel berkualitas tinggi.",
            "is_popular": False,
            "sort_order": 3,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    await db.packages.insert_many(packages)
    print(f"Inserted {len(packages)} packages")
    
    # Seed Blog Posts
    blog_posts = [
        {
            "id": str(uuid.uuid4()),
            "title": "Apa Itu PBN dan Mengapa Penting untuk SEO?",
            "slug": "apa-itu-pbn-dan-mengapa-penting-untuk-seo",
            "excerpt": "PBN (Private Blog Network) adalah jaringan website yang digunakan untuk membangun backlink berkualitas. Pelajari mengapa PBN masih efektif di 2024.",
            "content": "<h2>Pengertian PBN</h2><p>PBN atau Private Blog Network adalah kumpulan website berkualitas yang dimiliki secara private dan digunakan untuk memberikan backlink ke website utama (money site). Berbeda dengan backlink biasa, PBN memberikan kontrol penuh atas anchor text, konten, dan timing publikasi.</p><h2>Mengapa PBN Efektif?</h2><p>Google masih menganggap backlink sebagai salah satu faktor ranking terpenting. Dengan PBN yang berkualitas:</p><ul><li>Anda mendapat backlink dari domain aged dengan authority tinggi</li><li>Kontrol penuh atas anchor text untuk target keyword</li><li>Artikel contextual yang natural dan relevan</li><li>Hasil ranking yang lebih cepat dan stabil</li></ul><h2>PBN Aman untuk SEO?</h2><p>Ya, selama digunakan dengan benar. Kunci PBN aman adalah:</p><ul><li>Domain berkualitas dengan history bersih</li><li>Hosting yang terdiversifikasi</li><li>Konten berkualitas dan natural</li><li>Drip posting (tidak sekaligus)</li><li>Spam score rendah</li></ul><p>Di DomainPBN, semua faktor ini sudah kami perhatikan untuk memberikan backlink yang aman dan powerful.</p>",
            "thumbnail": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
            "meta_title": "Apa Itu PBN? Panduan Lengkap Private Blog Network untuk SEO 2024",
            "meta_description": "Pelajari apa itu PBN (Private Blog Network), mengapa efektif untuk SEO, dan bagaimana menggunakan PBN dengan aman untuk meningkatkan ranking website Anda.",
            "is_published": True,
            "published_at": datetime.now(timezone.utc).isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "5 Kesalahan Fatal Saat Membeli Backlink PBN",
            "slug": "5-kesalahan-fatal-saat-membeli-backlink-pbn",
            "excerpt": "Hindari kesalahan ini saat membeli backlink PBN! Dari memilih vendor abal-abal hingga anchor text yang salah, ini yang harus Anda perhatikan.",
            "content": "<h2>1. Membeli dari Vendor Tanpa Transparansi</h2><p>Banyak vendor PBN tidak menunjukkan metrics real domain mereka. Pastikan vendor memberikan data DR/DA, traffic, dan spam score yang jelas. Di DomainPBN, semua metrics PBN kami transparan dan bisa dicek.</p><h2>2. Menggunakan Exact Match Anchor Text Berlebihan</h2><p>Anchor text yang terlalu exact match (100% keyword) akan terlihat unnatural. Google bisa mendeteksi pola ini. Gunakan variasi anchor text: branded, generic, dan LSI keyword.</p><h2>3. Posting Backlink Sekaligus</h2><p>Mendapat 20 backlink dalam 1 hari sangat mencurigakan. Gunakan drip posting untuk distribusi backlink secara natural dalam beberapa minggu.</p><h2>4. Mengabaikan Relevance Niche</h2><p>Backlink dari blog teknologi ke website properti kurang natural. Pilih PBN yang niche-nya relevan atau general untuk hasil optimal.</p><h2>5. Hanya Fokus pada DR Tinggi</h2><p>DR 70 dengan spam score 30% lebih bahaya daripada DR 50 dengan spam score 1%. Perhatikan semua metrics, bukan hanya DR/DA.</p><p>Hindari 5 kesalahan ini dan backlink PBN Anda akan memberikan hasil maksimal tanpa risiko penalty!</p>",
            "thumbnail": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
            "meta_title": "5 Kesalahan Fatal Membeli Backlink PBN - Hindari Penalty Google!",
            "meta_description": "Jangan sampai salah beli backlink PBN! Pelajari 5 kesalahan fatal yang sering dilakukan dan cara menghindari penalty dari Google.",
            "is_published": True,
            "published_at": datetime.now(timezone.utc).isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Berapa Lama Hasil Backlink PBN Terlihat?",
            "slug": "berapa-lama-hasil-backlink-pbn-terlihat",
            "excerpt": "Penasaran kapan ranking website naik setelah beli backlink PBN? Ini timeline realistis yang bisa Anda harapkan dan faktor yang mempengaruhinya.",
            "content": "<h2>Timeline Umum Hasil Backlink PBN</h2><p>Berdasarkan pengalaman ratusan client kami, ini timeline realistis:</p><ul><li><strong>Minggu 1-2:</strong> Google mulai crawl dan index backlink</li><li><strong>Minggu 3-4:</strong> Ranking mulai bergerak naik untuk low-medium competition keyword</li><li><strong>Minggu 5-8:</strong> Peningkatan ranking signifikan terlihat</li><li><strong>Bulan 3+:</strong> Ranking stabil di posisi target</li></ul><h2>Faktor Yang Mempengaruhi Kecepatan Hasil</h2><h3>1. Kompetisi Keyword</h3><p>Keyword dengan kompetisi rendah bisa naik dalam 2-3 minggu. High competition keyword butuh 2-3 bulan atau lebih.</p><h3>2. Kualitas On-Page SEO</h3><p>Backlink hanya satu faktor. Website dengan on-page SEO bagus akan lebih cepat naik ranking.</p><h3>3. Jumlah dan Kualitas Backlink</h3><p>Semakin banyak backlink berkualitas, semakin cepat hasilnya. Paket Enterprise kami memberikan 30 backlink untuk hasil maksimal.</p><h3>4. Age Domain Website Anda</h3><p>Website baru butuh waktu lebih lama untuk naik ranking dibanding domain aged.</p><h2>Tips Mempercepat Hasil</h2><ul><li>Gunakan drip posting untuk distribusi natural</li><li>Kombinasikan dengan content marketing</li><li>Perbaiki technical SEO website</li><li>Build internal linking yang kuat</li></ul><p>Sabar adalah kunci! SEO adalah marathon, bukan sprint. Dengan strategi yang tepat, hasil yang stabil akan datang.</p>",
            "thumbnail": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
            "meta_title": "Berapa Lama Hasil Backlink PBN Terlihat? Timeline Realistis 2024",
            "meta_description": "Kapan ranking website naik setelah beli backlink PBN? Pelajari timeline realistis dan faktor yang mempengaruhi kecepatan hasil backlink PBN.",
            "is_published": True,
            "published_at": datetime.now(timezone.utc).isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    await db.blog_posts.insert_many(blog_posts)
    print(f"Inserted {len(blog_posts)} blog posts")
    
    # Seed FAQs
    faqs = [
        {
            "id": str(uuid.uuid4()),
            "question": "Apakah backlink PBN aman untuk website saya?",
            "answer": "Ya, sangat aman selama menggunakan PBN berkualitas. Semua domain kami memiliki metrics bagus, spam score rendah, dan history bersih. Kami juga menggunakan drip posting untuk distribusi backlink yang natural.",
            "sort_order": 1,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "question": "Berapa lama proses pengerjaannya?",
            "answer": "Setelah pembayaran dikonfirmasi, kami akan mulai posting dalam 1-3 hari kerja. Untuk hasil optimal, kami merekomendasikan drip posting 2-3 artikel per minggu untuk distribusi yang natural.",
            "sort_order": 2,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "question": "Apakah saya bisa memilih niche PBN sendiri?",
            "answer": "Ya, Anda bisa request niche tertentu atau memilih dari list PBN kami. Kami punya PBN di berbagai niche: teknologi, finance, health, lifestyle, dan lainnya.",
            "sort_order": 3,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "question": "Apakah artikel backlink ditulis sendiri atau pakai AI?",
            "answer": "Kami menggunakan kombinasi AI dan human editing untuk menghasilkan artikel berkualitas tinggi yang readable, natural, dan SEO-friendly. Semua artikel lolos plagiarism check.",
            "sort_order": 4,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "question": "Bagaimana cara melihat laporan backlink yang sudah dipasang?",
            "answer": "Setelah proses selesai, kami akan mengirimkan laporan lengkap berisi URL artikel, anchor text, dan metrics PBN yang digunakan melalui email atau Telegram.",
            "sort_order": 5,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    await db.faqs.insert_many(faqs)
    print(f"Inserted {len(faqs)} FAQs")
    
    # Seed Pages
    pages = [
        {
            "id": str(uuid.uuid4()),
            "title": "Tentang Kami",
            "slug": "about",
            "content": "<h2>Tentang DomainPBN</h2><p>DomainPBN adalah penyedia layanan backlink PBN premium terpercaya di Indonesia. Kami memahami betapa pentingnya backlink berkualitas untuk kesuksesan SEO website Anda.</p><h3>Mengapa Memilih DomainPBN?</h3><ul><li><strong>Domain Berkualitas:</strong> Semua PBN kami menggunakan aged domain dengan authority tinggi, history bersih, dan metrics terbukti.</li><li><strong>Harga Terjangkau:</strong> Kami percaya backlink berkualitas tidak harus mahal. Paket kami dirancang untuk semua budget.</li><li><strong>Transparansi Penuh:</strong> Anda bisa melihat metrics semua PBN kami sebelum order. No hidden domain.</li><li><strong>Support Responsif:</strong> Tim kami siap membantu Anda via WhatsApp atau Telegram untuk konsultasi strategi backlink.</li></ul><h3>Pengalaman Kami</h3><p>Sejak 2020, kami telah membantu ratusan website mencapai ranking page 1 Google. Dari bisnis lokal hingga e-commerce besar, DomainPBN adalah partner SEO terpercaya mereka.</p><h3>Komitmen Kami</h3><p>Kami berkomitmen memberikan layanan backlink PBN yang:</p><ul><li>Aman dan tidak berisiko penalty</li><li>Natural dan contextual</li><li>Memberikan hasil nyata</li><li>Dengan harga yang kompetitif</li></ul><p>Mulai tingkatkan ranking website Anda bersama DomainPBN hari ini!</p>",
            "is_published": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Syarat dan Ketentuan",
            "slug": "tos",
            "content": "<h2>Syarat dan Ketentuan Layanan DomainPBN</h2><p>Dengan menggunakan layanan DomainPBN, Anda menyetujui syarat dan ketentuan berikut:</p><h3>1. Layanan</h3><ul><li>DomainPBN menyediakan layanan backlink dari Private Blog Network</li><li>Semua backlink bersifat permanent (tidak dihapus)</li><li>Waktu pengerjaan 1-7 hari kerja tergantung paket dan drip posting</li></ul><h3>2. Pembayaran</h3><ul><li>Pembayaran dilakukan sebelum proses pengerjaan dimulai</li><li>Metode pembayaran: Transfer Bank, E-wallet, atau Cryptocurrency</li><li>Harga dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya</li></ul><h3>3. Kebijakan Refund</h3><ul><li>Refund hanya diberikan jika kami tidak dapat memenuhi order dalam 14 hari kerja</li><li>Tidak ada refund setelah backlink dipublish</li><li>Kami tidak bertanggung jawab atas hasil ranking yang tidak sesuai ekspektasi</li></ul><h3>4. Konten</h3><ul><li>Klien bertanggung jawab atas URL dan anchor text yang diberikan</li><li>Kami berhak menolak URL atau konten yang melanggar hukum, spam, atau adult content</li><li>Artikel backlink ditulis oleh tim kami dan tidak dapat dikustomisasi 100%</li></ul><h3>5. Penggunaan Wajar</h3><ul><li>Klien tidak diperbolehkan menyalahgunakan layanan untuk spam atau black hat SEO</li><li>Kami berhak membatalkan order yang mencurigakan tanpa refund</li></ul><h3>6. Garansi dan Disclaimer</h3><ul><li>Kami menjamin backlink permanent dan metrics PBN sesuai yang tertera</li><li>Kami tidak menjamin ranking atau traffic website klien</li><li>SEO adalah proses kompleks yang dipengaruhi banyak faktor</li></ul><h3>7. Perubahan Syarat</h3><p>DomainPBN berhak mengubah syarat dan ketentuan ini kapan saja. Perubahan akan efektif segera setelah dipublikasikan di website.</p><p>Jika Anda tidak setuju dengan syarat ini, mohon jangan menggunakan layanan kami.</p>",
            "is_published": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Kebijakan Privasi",
            "slug": "privacy",
            "content": "<h2>Kebijakan Privasi DomainPBN</h2><p>DomainPBN menghormati privasi Anda. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda.</p><h3>Informasi Yang Kami Kumpulkan</h3><ul><li><strong>Informasi Kontak:</strong> Nama, email, nomor WhatsApp/Telegram</li><li><strong>Informasi Order:</strong> URL website, anchor text, keyword target</li><li><strong>Informasi Pembayaran:</strong> Nomor rekening, bukti transfer (kami tidak menyimpan data kartu kredit)</li></ul><h3>Bagaimana Kami Menggunakan Informasi</h3><ul><li>Memproses order dan memberikan layanan backlink</li><li>Mengirimkan update dan laporan order via email/WhatsApp</li><li>Meningkatkan layanan kami</li><li>Mengirim newsletter dan promosi (Anda bisa unsubscribe kapan saja)</li></ul><h3>Keamanan Data</h3><ul><li>Semua data disimpan dengan enkripsi</li><li>Hanya tim internal yang memiliki akses ke data klien</li><li>Kami tidak menjual atau membagikan data Anda ke pihak ketiga</li></ul><h3>Cookie dan Tracking</h3><ul><li>Website kami menggunakan cookie untuk meningkatkan pengalaman pengguna</li><li>Kami menggunakan Google Analytics untuk memahami traffic website</li><li>Anda dapat disable cookie di browser Anda</li></ul><h3>Hak Anda</h3><p>Anda memiliki hak untuk:</p><ul><li>Mengakses data pribadi yang kami simpan</li><li>Meminta penghapusan data Anda</li><li>Meminta koreksi data yang salah</li><li>Menolak marketing communication</li></ul><h3>Perubahan Kebijakan</h3><p>Kami dapat mengubah kebijakan privasi ini sewaktu-waktu. Perubahan akan dipublikasikan di halaman ini.</p><h3>Kontak</h3><p>Jika Anda punya pertanyaan tentang kebijakan privasi ini, silakan hubungi kami via WhatsApp atau email.</p>",
            "is_published": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    await db.pages.insert_many(pages)
    print(f"Inserted {len(pages)} pages")
    
    # Seed Settings
    settings = {
        "id": "global_settings",
        "site_name": "DomainPBN",
        "logo": None,
        "tagline": "Premium PBN Backlinks - Harga Murah, Kualitas Tinggi",
        "whatsapp_number": "6281234567890",
        "telegram_username": "domainpbn",
        "footer_text": "DomainPBN © 2024. Premium Backlinks untuk SEO Anda. Trusted by 500+ Clients.",
        "social_links": {
            "instagram": "https://instagram.com/domainpbn",
            "twitter": "https://twitter.com/domainpbn",
            "facebook": "https://facebook.com/domainpbn"
        },
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    await db.settings.insert_one(settings)
    print("Inserted settings")
    
    # Seed Aged Domains
    aged_domains = [
        {
            "id": str(uuid.uuid4()),
            "domain_name": "techinsights.com",
            "da": 58,
            "pa": 52,
            "ur": 45,
            "dr": 62,
            "tf": 35,
            "cf": 42,
            "price": 8500000,
            "web_archive_history": "https://web.archive.org/web/*/techinsights.com",
            "age": 12,
            "registrar": "GoDaddy",
            "status": "available",
            "notes": "Clean tech blog with strong backlink profile",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "domain_name": "healthylivingtoday.com",
            "da": 65,
            "pa": 60,
            "ur": 55,
            "dr": 68,
            "tf": 45,
            "cf": 50,
            "price": 12000000,
            "web_archive_history": "https://web.archive.org/web/*/healthylivingtoday.com",
            "age": 10,
            "registrar": "Namecheap",
            "status": "available",
            "notes": "High authority health & wellness domain",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "domain_name": "financeguide.net",
            "da": 72,
            "pa": 68,
            "ur": 62,
            "dr": 75,
            "tf": 50,
            "cf": 55,
            "price": 18000000,
            "web_archive_history": "https://web.archive.org/web/*/financeguide.net",
            "age": 15,
            "registrar": "GoDaddy",
            "status": "available",
            "notes": "Premium finance domain with excellent metrics",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "domain_name": "travelworldwide.org",
            "da": 48,
            "pa": 44,
            "ur": 38,
            "dr": 52,
            "tf": 30,
            "cf": 35,
            "price": 6000000,
            "web_archive_history": "https://web.archive.org/web/*/travelworldwide.org",
            "age": 8,
            "registrar": "Namecheap",
            "status": "available",
            "notes": "Travel niche domain with global reach",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "domain_name": "digitalbusiness.co",
            "da": 55,
            "pa": 50,
            "ur": 48,
            "dr": 58,
            "tf": 38,
            "cf": 45,
            "price": 9500000,
            "web_archive_history": "https://web.archive.org/web/*/digitalbusiness.co",
            "age": 9,
            "registrar": "GoDaddy",
            "status": "available",
            "notes": "Business & marketing focused domain",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "domain_name": "ecommerceexperts.com",
            "da": 70,
            "pa": 65,
            "ur": 60,
            "dr": 73,
            "tf": 48,
            "cf": 53,
            "price": 15000000,
            "web_archive_history": "https://web.archive.org/web/*/ecommerceexperts.com",
            "age": 11,
            "registrar": "Namecheap",
            "status": "available",
            "notes": "E-commerce authority site with strong SEO",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    await db.domain_listings.insert_many(aged_domains)
    print(f"Inserted {len(aged_domains)} aged domains")
    
    print("\n✅ Database seeding completed successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_data())