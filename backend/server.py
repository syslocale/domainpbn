from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
import re

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ==================== MODELS ====================

# PBN Site Models
class PBNSiteBase(BaseModel):
    code: str
    domain_real: str
    niche: str
    dr: int
    da: int
    traffic: int
    spam_score: float
    age: int  # in years
    price_per_post: int
    status: str = "active"  # active, hidden
    notes: Optional[str] = None

class PBNSiteCreate(PBNSiteBase):
    pass

class PBNSite(PBNSiteBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PBNSitePublic(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    code: str
    niche: str
    dr: int
    da: int
    traffic: int
    spam_score: float
    age: int
    price_per_post: int

# Package Models
class PackageBase(BaseModel):
    name: str
    slug: str
    backlink_count: int
    price: int
    description: str
    is_popular: bool = False
    sort_order: int = 0
    is_active: bool = True

class PackageCreate(PackageBase):
    pass

class Package(PackageBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Blog Models
class BlogPostBase(BaseModel):
    title: str
    slug: str
    excerpt: str
    content: str
    thumbnail: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    is_published: bool = True

class BlogPostCreate(BlogPostBase):
    pass

class BlogPost(BlogPostBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    published_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# FAQ Models
class FAQBase(BaseModel):
    question: str
    answer: str
    sort_order: int = 0
    is_active: bool = True

class FAQCreate(FAQBase):
    pass

class FAQ(FAQBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Page Models
class PageBase(BaseModel):
    title: str
    slug: str
    content: str
    is_published: bool = True

class PageCreate(PageBase):
    pass

class Page(PageBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Domain Listing Models
class DomainListingBase(BaseModel):
    domain_name: str
    da: int
    pa: int
    ur: int
    dr: int
    tf: int
    cf: int
    price: int
    web_archive_history: Optional[str] = None  # URL to wayback machine
    age: int  # in years
    registrar: str
    status: str = "available"  # available, sold, reserved
    notes: Optional[str] = None

class DomainListingCreate(DomainListingBase):
    pass

class DomainListing(DomainListingBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Settings Models
class SettingsBase(BaseModel):
    site_name: str = "DomainPBN"
    logo: Optional[str] = None
    tagline: str = "Premium PBN Backlinks - Harga Murah, Kualitas Tinggi"
    whatsapp_number: str
    telegram_username: Optional[str] = None
    footer_text: str
    social_links: Optional[Dict[str, str]] = None

class SettingsUpdate(SettingsBase):
    pass

class Settings(SettingsBase):
    model_config = ConfigDict(extra="ignore")
    id: str = "global_settings"
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Page Content Models
class PageContentBase(BaseModel):
    page_key: str
    section: str
    content: Dict[str, Any]

class PageContentCreate(PageContentBase):
    pass

class PageContentUpdate(BaseModel):
    content: Dict[str, Any]

class PageContent(PageContentBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ==================== HELPER FUNCTIONS ====================

def serialize_datetime(obj: Any) -> Any:
    """Convert datetime objects to ISO string for MongoDB"""
    if isinstance(obj, dict):
        return {k: serialize_datetime(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [serialize_datetime(item) for item in obj]
    elif isinstance(obj, datetime):
        return obj.isoformat()
    return obj

def deserialize_datetime(obj: Any) -> Any:
    """Convert ISO string back to datetime objects"""
    if isinstance(obj, dict):
        result = {}
        for k, v in obj.items():
            if isinstance(v, str) and k in ['created_at', 'updated_at', 'published_at']:
                try:
                    result[k] = datetime.fromisoformat(v)
                except:
                    result[k] = v
            else:
                result[k] = deserialize_datetime(v)
        return result
    elif isinstance(obj, list):
        return [deserialize_datetime(item) for item in obj]
    return obj

def create_slug(text: str) -> str:
    """Create URL-friendly slug"""
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text)
    return text.strip('-')

# ==================== ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "DomainPBN API", "version": "1.0"}

# PBN Routes
@api_router.get("/pbn", response_model=List[PBNSitePublic])
async def get_pbn_sites(
    niche: Optional[str] = None,
    min_dr: Optional[int] = None,
    max_price: Optional[int] = None,
    sort_by: str = "dr",
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100)
):
    """Get public PBN listing (domain hidden)"""
    query = {"status": "active"}
    if niche:
        query["niche"] = {"$regex": niche, "$options": "i"}
    if min_dr:
        query["dr"] = {"$gte": min_dr}
    if max_price:
        query["price_per_post"] = {"$lte": max_price}
    
    sort_field = sort_by if sort_by in ["dr", "da", "traffic", "price_per_post"] else "dr"
    skip = (page - 1) * limit
    sites = await db.pbn_sites.find(query, {"_id": 0, "domain_real": 0, "notes": 0}).sort(sort_field, -1).skip(skip).limit(limit).to_list(limit)
    return [deserialize_datetime(site) for site in sites]

@api_router.get("/admin/pbn", response_model=List[PBNSite])
async def get_admin_pbn_sites():
    """Get all PBN sites for admin (includes domain)"""
    sites = await db.pbn_sites.find({}, {"_id": 0}).to_list(1000)
    return [deserialize_datetime(site) for site in sites]

@api_router.post("/admin/pbn", response_model=PBNSite)
async def create_pbn_site(site: PBNSiteCreate):
    site_obj = PBNSite(**site.model_dump())
    doc = serialize_datetime(site_obj.model_dump())
    await db.pbn_sites.insert_one(doc)
    return site_obj

@api_router.put("/admin/pbn/{site_id}", response_model=PBNSite)
async def update_pbn_site(site_id: str, site: PBNSiteCreate):
    doc = serialize_datetime(site.model_dump())
    result = await db.pbn_sites.update_one({"id": site_id}, {"$set": doc})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="PBN site not found")
    updated_site = await db.pbn_sites.find_one({"id": site_id}, {"_id": 0})
    return deserialize_datetime(updated_site)

@api_router.delete("/admin/pbn/{site_id}")
async def delete_pbn_site(site_id: str):
    result = await db.pbn_sites.delete_one({"id": site_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="PBN site not found")
    return {"message": "PBN site deleted"}

# Package Routes
@api_router.get("/packages", response_model=List[Package])
async def get_packages():
    packages = await db.packages.find({"is_active": True}, {"_id": 0}).sort("sort_order", 1).to_list(100)
    return [deserialize_datetime(pkg) for pkg in packages]

@api_router.get("/admin/packages", response_model=List[Package])
async def get_admin_packages():
    packages = await db.packages.find({}, {"_id": 0}).sort("sort_order", 1).to_list(100)
    return [deserialize_datetime(pkg) for pkg in packages]

@api_router.post("/admin/packages", response_model=Package)
async def create_package(package: PackageCreate):
    package_obj = Package(**package.model_dump())
    doc = serialize_datetime(package_obj.model_dump())
    await db.packages.insert_one(doc)
    return package_obj

@api_router.put("/admin/packages/{package_id}", response_model=Package)
async def update_package(package_id: str, package: PackageCreate):
    doc = serialize_datetime(package.model_dump())
    result = await db.packages.update_one({"id": package_id}, {"$set": doc})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Package not found")
    updated_pkg = await db.packages.find_one({"id": package_id}, {"_id": 0})
    return deserialize_datetime(updated_pkg)

@api_router.delete("/admin/packages/{package_id}")
async def delete_package(package_id: str):
    result = await db.packages.delete_one({"id": package_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Package not found")
    return {"message": "Package deleted"}

# Blog Routes
@api_router.get("/blog", response_model=List[BlogPost])
async def get_blog_posts(
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50)
):
    query = {"is_published": True}
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"excerpt": {"$regex": search, "$options": "i"}}
        ]
    
    skip = (page - 1) * limit
    posts = await db.blog_posts.find(query, {"_id": 0}).sort("published_at", -1).skip(skip).limit(limit).to_list(limit)
    return [deserialize_datetime(post) for post in posts]

@api_router.get("/blog/{slug}", response_model=BlogPost)
async def get_blog_post(slug: str):
    post = await db.blog_posts.find_one({"slug": slug, "is_published": True}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return deserialize_datetime(post)

@api_router.get("/admin/blog", response_model=List[BlogPost])
async def get_admin_blog_posts():
    posts = await db.blog_posts.find({}, {"_id": 0}).sort("published_at", -1).to_list(1000)
    return [deserialize_datetime(post) for post in posts]

@api_router.post("/admin/blog", response_model=BlogPost)
async def create_blog_post(post: BlogPostCreate):
    post_obj = BlogPost(**post.model_dump())
    doc = serialize_datetime(post_obj.model_dump())
    await db.blog_posts.insert_one(doc)
    return post_obj

@api_router.put("/admin/blog/{post_id}", response_model=BlogPost)
async def update_blog_post(post_id: str, post: BlogPostCreate):
    doc = serialize_datetime(post.model_dump())
    result = await db.blog_posts.update_one({"id": post_id}, {"$set": doc})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Blog post not found")
    updated_post = await db.blog_posts.find_one({"id": post_id}, {"_id": 0})
    return deserialize_datetime(updated_post)

@api_router.delete("/admin/blog/{post_id}")
async def delete_blog_post(post_id: str):
    result = await db.blog_posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return {"message": "Blog post deleted"}

# FAQ Routes
@api_router.get("/faq", response_model=List[FAQ])
async def get_faqs():
    faqs = await db.faqs.find({"is_active": True}, {"_id": 0}).sort("sort_order", 1).to_list(100)
    return [deserialize_datetime(faq) for faq in faqs]

@api_router.get("/admin/faq", response_model=List[FAQ])
async def get_admin_faqs():
    faqs = await db.faqs.find({}, {"_id": 0}).sort("sort_order", 1).to_list(100)
    return [deserialize_datetime(faq) for faq in faqs]

@api_router.post("/admin/faq", response_model=FAQ)
async def create_faq(faq: FAQCreate):
    faq_obj = FAQ(**faq.model_dump())
    doc = serialize_datetime(faq_obj.model_dump())
    await db.faqs.insert_one(doc)
    return faq_obj

@api_router.put("/admin/faq/{faq_id}", response_model=FAQ)
async def update_faq(faq_id: str, faq: FAQCreate):
    doc = serialize_datetime(faq.model_dump())
    result = await db.faqs.update_one({"id": faq_id}, {"$set": doc})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="FAQ not found")
    updated_faq = await db.faqs.find_one({"id": faq_id}, {"_id": 0})
    return deserialize_datetime(updated_faq)

@api_router.delete("/admin/faq/{faq_id}")
async def delete_faq(faq_id: str):
    result = await db.faqs.delete_one({"id": faq_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="FAQ not found")
    return {"message": "FAQ deleted"}

# Pages Routes
@api_router.get("/pages/{slug}", response_model=Page)
async def get_page(slug: str):
    page = await db.pages.find_one({"slug": slug, "is_published": True}, {"_id": 0})
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return deserialize_datetime(page)

@api_router.get("/admin/pages", response_model=List[Page])
async def get_admin_pages():
    pages = await db.pages.find({}, {"_id": 0}).to_list(100)
    return [deserialize_datetime(page) for page in pages]

@api_router.post("/admin/pages", response_model=Page)
async def create_page(page: PageCreate):
    page_obj = Page(**page.model_dump())
    doc = serialize_datetime(page_obj.model_dump())
    await db.pages.insert_one(doc)
    return page_obj

@api_router.put("/admin/pages/{page_id}", response_model=Page)
async def update_page(page_id: str, page: PageCreate):
    doc = serialize_datetime(page.model_dump())
    result = await db.pages.update_one({"id": page_id}, {"$set": doc})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Page not found")
    updated_page = await db.pages.find_one({"id": page_id}, {"_id": 0})
    return deserialize_datetime(updated_page)

@api_router.delete("/admin/pages/{page_id}")
async def delete_page(page_id: str):
    result = await db.pages.delete_one({"id": page_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Page not found")
    return {"message": "Page deleted"}

# Domain Listing Routes
@api_router.get("/domains", response_model=List[DomainListing])
async def get_domains(
    status: Optional[str] = None,
    min_dr: Optional[int] = None,
    max_price: Optional[int] = None,
    sort_by: str = "dr",
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100)
):
    """Get public domain listings"""
    query = {}
    if status:
        query["status"] = status
    else:
        query["status"] = "available"  # Default to available only
        
    if min_dr:
        query["dr"] = {"$gte": min_dr}
    if max_price:
        query["price"] = {"$lte": max_price}
    
    sort_field = sort_by if sort_by in ["dr", "da", "price", "age"] else "dr"
    skip = (page - 1) * limit
    domains = await db.domain_listings.find(query, {"_id": 0}).sort(sort_field, -1).skip(skip).limit(limit).to_list(limit)
    return [deserialize_datetime(domain) for domain in domains]

@api_router.get("/admin/domains", response_model=List[DomainListing])
async def get_admin_domains():
    """Get all domains for admin"""
    domains = await db.domain_listings.find({}, {"_id": 0}).to_list(1000)
    return [deserialize_datetime(domain) for domain in domains]

@api_router.post("/admin/domains", response_model=DomainListing)
async def create_domain(domain: DomainListingCreate):
    domain_obj = DomainListing(**domain.model_dump())
    doc = serialize_datetime(domain_obj.model_dump())
    await db.domain_listings.insert_one(doc)
    return domain_obj

@api_router.post("/admin/domains/import")
async def import_domains(domains: List[DomainListingCreate]):
    """Bulk import domains from CSV/Excel"""
    domain_objs = [DomainListing(**domain.model_dump()) for domain in domains]
    docs = [serialize_datetime(obj.model_dump()) for obj in domain_objs]
    result = await db.domain_listings.insert_many(docs)
    return {"imported": len(result.inserted_ids), "message": f"{len(result.inserted_ids)} domains imported successfully"}

@api_router.put("/admin/domains/{domain_id}", response_model=DomainListing)
async def update_domain(domain_id: str, domain: DomainListingCreate):
    doc = serialize_datetime(domain.model_dump())
    result = await db.domain_listings.update_one({"id": domain_id}, {"$set": doc})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Domain not found")
    updated_domain = await db.domain_listings.find_one({"id": domain_id}, {"_id": 0})
    return deserialize_datetime(updated_domain)

@api_router.delete("/admin/domains/{domain_id}")
async def delete_domain(domain_id: str):
    result = await db.domain_listings.delete_one({"id": domain_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Domain not found")
    return {"message": "Domain deleted"}

# Settings Routes
@api_router.get("/settings", response_model=Settings)
async def get_settings():
    settings = await db.settings.find_one({"id": "global_settings"}, {"_id": 0})
    if not settings:
        # Return default settings
        default_settings = Settings(
            whatsapp_number="6281234567890",
            telegram_username="domainpbn",
            footer_text="DomainPBN © 2024. Premium Backlinks untuk SEO Anda."
        )
        return default_settings
    return deserialize_datetime(settings)

@api_router.put("/admin/settings", response_model=Settings)
async def update_settings(settings: SettingsUpdate):
    settings_obj = Settings(**settings.model_dump())
    doc = serialize_datetime(settings_obj.model_dump())
    await db.settings.update_one(
        {"id": "global_settings"},
        {"$set": doc},
        upsert=True
    )
    return settings_obj

# Page Content Routes
@api_router.get("/page-content", response_model=List[PageContent])
async def get_all_page_contents():
    """Get all page content templates"""
    contents = await db.page_contents.find({}, {"_id": 0}).to_list(1000)
    return [deserialize_datetime(content) for content in contents]

@api_router.get("/page-content/{page_key}", response_model=PageContent)
async def get_page_content(page_key: str):
    """Get specific page content by key"""
    content = await db.page_contents.find_one({"page_key": page_key}, {"_id": 0})
    if not content:
        raise HTTPException(status_code=404, detail="Page content not found")
    return deserialize_datetime(content)

@api_router.get("/admin/page-content", response_model=List[PageContent])
async def get_admin_page_contents():
    """Get all page contents for admin"""
    contents = await db.page_contents.find({}, {"_id": 0}).to_list(1000)
    return [deserialize_datetime(content) for content in contents]

@api_router.post("/admin/page-content", response_model=PageContent)
async def create_page_content(content: PageContentCreate):
    """Create new page content"""
    content_obj = PageContent(**content.model_dump())
    doc = serialize_datetime(content_obj.model_dump())
    await db.page_contents.insert_one(doc)
    return content_obj

@api_router.put("/admin/page-content/{content_id}", response_model=PageContent)
async def update_page_content(content_id: str, content: PageContentUpdate):
    """Update page content"""
    doc = serialize_datetime(content.model_dump())
    doc['updated_at'] = datetime.now(timezone.utc).isoformat()
    result = await db.page_contents.update_one({"id": content_id}, {"$set": doc})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Page content not found")
    updated_content = await db.page_contents.find_one({"id": content_id}, {"_id": 0})
    return deserialize_datetime(updated_content)

@api_router.delete("/admin/page-content/{content_id}")
async def delete_page_content(content_id: str):
    """Delete page content"""
    result = await db.page_contents.delete_one({"id": content_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Page content not found")
    return {"message": "Page content deleted"}

# SEO Routes
@api_router.get("/sitemap")
async def get_sitemap():
    base_url = "https://linkboost-13.preview.emergentagent.com"
    
    sitemap = ['<?xml version="1.0" encoding="UTF-8"?>']
    sitemap.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    
    # Static pages
    static_pages = ["/", "/paket", "/pbn", "/blog", "/faq", "/about", "/tos", "/privacy"]
    for page in static_pages:
        sitemap.append(f"<url><loc>{base_url}{page}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>")
    
    # Blog posts
    blog_posts = await db.blog_posts.find({"is_published": True}, {"slug": 1, "_id": 0}).to_list(1000)
    for post in blog_posts:
        sitemap.append(f"<url><loc>{base_url}/blog/{post['slug']}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>")
    
    sitemap.append('</urlset>')
    return "\n".join(sitemap)

@api_router.get("/robots")
async def get_robots():
    return """User-agent: *\nAllow: /\n\nSitemap: https://linkboost-13.preview.emergentagent.com/api/sitemap"""

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()