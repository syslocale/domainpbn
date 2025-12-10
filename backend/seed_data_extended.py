import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, timezone, timedelta
import uuid
from dotenv import load_dotenv
from pathlib import Path
import random

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def seed_extended_data():
    print("Starting extended database seeding with 20+ items...")
    
    # Clear existing data
    await db.pbn_sites.delete_many({})
    await db.blog_posts.delete_many({})
    await db.domain_listings.delete_many({})
    await db.page_contents.delete_many({})
    
    # Generate 25 PBN Sites
    niches = ["Technology", "Health & Wellness", "Finance", "Travel", "Business", 
              "Lifestyle", "Education", "Real Estate", "Marketing", "E-commerce",
              "Food & Recipe", "Fashion", "Sports", "Gaming", "Automotive"]
    
    pbn_sites = []
    for i in range(1, 26):
        niche = random.choice(niches)
        dr = random.randint(45, 75)
        da = dr - random.randint(0, 5)
        pbn_sites.append({
            "id": str(uuid.uuid4()),
            "code": f"PBN-{i:03d}",
            "domain_real": f"example{i}.com",
            "niche": niche,
            "dr": dr,
            "da": da,
            "traffic": random.randint(5000, 30000),
            "spam_score": round(random.uniform(0.3, 2.5), 1),
            "age": random.randint(4, 12),
            "price_per_post": random.choice([100000, 120000, 140000, 150000, 170000, 180000, 200000]),
            "status": "active",
            "notes": f"{niche} authority site",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
    
    await db.pbn_sites.insert_many(pbn_sites)
    print(f"✅ Inserted {len(pbn_sites)} PBN sites")
    
    # Generate 25 Blog Posts
    blog_titles = [
        "Apa Itu PBN dan Mengapa Penting untuk SEO?",
        "5 Kesalahan Fatal Saat Membeli Backlink PBN",
        "Berapa Lama Hasil Backlink PBN Terlihat?",
        "Cara Memilih PBN Berkualitas untuk Website Anda",
        "PBN vs Guest Post: Mana yang Lebih Baik?",
        "Panduan Lengkap Backlink Strategy 2024",
        "10 Metrics PBN yang Harus Anda Perhatikan",
        "Aged Domain: Investasi Terbaik untuk SEO",
        "Cara Cek Kualitas PBN Sebelum Membeli",
        "Backlink Natural vs PBN: Pro dan Kontra",
        "SEO Lokal: Pentingnya Backlink Berkualitas",
        "Cara Meningkatkan Domain Authority dengan PBN",
        "Link Building Strategy untuk E-commerce",
        "Menghindari Google Penalty dari Backlink",
        "White Hat vs Black Hat SEO: Panduan Lengkap",
        "Cara Tracking Hasil Backlink PBN",
        "PBN untuk Website Baru: Worth It?",
        "Diversifikasi Anchor Text untuk Backlink",
        "Cara Membangun PBN Network Sendiri",
        "Backlink Pyramid Strategy Explained",
        "Local SEO dengan Backlink Strategy",
        "Niche Relevance dalam PBN: Seberapa Penting?",
        "Cara Nego Harga Backlink dengan Vendor",
        "PBN Maintenance: Tips dan Best Practices",
        "Future of Link Building: Trend 2025"
    ]
    
    blog_posts = []
    for i, title in enumerate(blog_titles, 1):
        slug = title.lower().replace(":", "").replace("?", "").replace(" ", "-")
        blog_posts.append({
            "id": str(uuid.uuid4()),
            "title": title,
            "slug": slug,
            "excerpt": f"Pelajari {title.lower()} dengan panduan lengkap ini. Tips praktis dan strategi yang terbukti efektif untuk SEO.",
            "content": f"<h2>{title}</h2><p>Konten lengkap tentang {title}. Artikel ini membahas secara mendalam strategi dan best practices dalam SEO dan backlink management.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>",
            "thumbnail": f"https://images.unsplash.com/photo-{random.choice(['1460925895917', '1551288049', '1504868584819'])}?w=800",
            "meta_title": f"{title} | DomainPBN",
            "meta_description": f"Panduan lengkap {title}. Tips dan strategi SEO untuk meningkatkan ranking website Anda.",
            "is_published": True,
            "published_at": (datetime.now(timezone.utc) - timedelta(days=i)).isoformat(),
            "created_at": (datetime.now(timezone.utc) - timedelta(days=i)).isoformat()
        })
    
    await db.blog_posts.insert_many(blog_posts)
    print(f"✅ Inserted {len(blog_posts)} blog posts")
    
    # Generate 25 Aged Domains
    tlds = [".com", ".net", ".org", ".co", ".io"]
    keywords = ["tech", "health", "finance", "travel", "business", "lifestyle", 
                "education", "property", "marketing", "shop", "digital", "global",
                "prime", "expert", "pro", "best", "top", "smart", "fast", "secure"]
    
    domains = []
    for i in range(1, 26):
        keyword = random.choice(keywords)
        tld = random.choice(tlds)
        dr = random.randint(40, 75)
        da = dr - random.randint(0, 8)
        
        domains.append({
            "id": str(uuid.uuid4()),
            "domain_name": f"{keyword}{random.choice(['hub', 'zone', 'guide', 'site', 'web', ''])}{i}{tld}",
            "da": da,
            "pa": da - random.randint(5, 15),
            "ur": random.randint(30, 60),
            "dr": dr,
            "tf": random.randint(25, 55),
            "cf": random.randint(30, 60),
            "price": random.choice([5000000, 7500000, 10000000, 12000000, 15000000, 18000000, 20000000]),
            "web_archive_history": f"https://web.archive.org/web/*/{keyword}{i}{tld}",
            "age": random.randint(5, 15),
            "registrar": random.choice(["GoDaddy", "Namecheap", "Google Domains"]),
            "status": "available",
            "notes": f"Clean {keyword} domain with good metrics",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
    
    await db.domain_listings.insert_many(domains)
    print(f"✅ Inserted {len(domains)} aged domains")
    
    # Seed Page Contents for easy text editing
    page_contents = [
        {
            "id": str(uuid.uuid4()),
            "page_key": "homepage_hero",
            "section": "Homepage - Hero Section",
            "content": {
                "title": "Premium PBN –",
                "title_highlight": "Harga Murah, Kualitas Tinggi",
                "description": "Backlink Powerful, Ranking Naik, Budget Aman. Tingkatkan authority website Anda dengan PBN premium."
            },
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "page_key": "pbn_page_header",
            "section": "PBN Network Page - Header",
            "content": {
                "title": "PBN Network Kami",
                "description": "Transparansi penuh! Lihat metrics semua PBN kami sebelum order. Domain aged dengan authority tinggi dan spam score rendah."
            },
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "page_key": "domains_page_header",
            "section": "Domains Page - Header",
            "content": {
                "title": "Aged Domain Premium",
                "description": "Domain expired & deleted berkualitas dengan authority tinggi. Perfect untuk PBN atau project baru Anda."
            },
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "page_key": "blog_page_header",
            "section": "Blog Page - Header",
            "content": {
                "title": "Blog SEO",
                "description": "Tips, panduan, dan strategi SEO untuk memaksimalkan hasil backlink PBN Anda"
            },
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "page_key": "packages_page_header",
            "section": "Packages Page - Header",
            "content": {
                "title": "Paket Backlink Premium",
                "description": "Pilih paket yang sesuai dengan budget dan kebutuhan SEO Anda. Harga transparan, kualitas terjamin."
            },
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "page_key": "homepage_features",
            "section": "Homepage - Why Choose Us",
            "content": {
                "title": "Mengapa Pilih DomainPBN?",
                "description": "Backlink berkualitas tinggi dengan harga yang terjangkau untuk semua ukuran bisnis"
            },
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "page_key": "homepage_cta",
            "section": "Homepage - Bottom CTA",
            "content": {
                "title": "Siap Tingkatkan Ranking Website Anda?",
                "description": "Mulai bangun authority website Anda dengan backlink PBN premium hari ini. Konsultasi gratis dengan tim kami!"
            },
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.page_contents.insert_many(page_contents)
    print(f"✅ Inserted {len(page_contents)} page content templates")
    
    print("\n🎉 Extended database seeding completed successfully!")
    print(f"   - {len(pbn_sites)} PBN Sites")
    print(f"   - {len(blog_posts)} Blog Posts")
    print(f"   - {len(domains)} Aged Domains")
    print(f"   - {len(page_contents)} Page Content Templates")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_extended_data())
