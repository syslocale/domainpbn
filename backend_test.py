#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime
from typing import Dict, List, Any

class DomainPBNAPITester:
    def __init__(self, base_url="https://linkpremium.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.test_results = []

    def log_test(self, name: str, success: bool, details: str = ""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
            self.failed_tests.append({"test": name, "error": details})
        
        self.test_results.append({
            "test_name": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })

    def test_api_root(self):
        """Test API root endpoint"""
        try:
            response = requests.get(f"{self.base_url}/api/", timeout=10)
            success = response.status_code == 200 and "DomainPBN API" in response.text
            self.log_test("API Root", success, f"Status: {response.status_code}")
            return success
        except Exception as e:
            self.log_test("API Root", False, str(e))
            return False

    def test_pbn_endpoints(self):
        """Test PBN-related endpoints"""
        # Test public PBN listing
        try:
            response = requests.get(f"{self.base_url}/api/pbn", timeout=10)
            success = response.status_code == 200
            if success:
                data = response.json()
                success = isinstance(data, list)
            self.log_test("PBN Public Listing", success, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("PBN Public Listing", False, str(e))

        # Test PBN with filters
        try:
            response = requests.get(f"{self.base_url}/api/pbn?niche=tech&min_dr=50", timeout=10)
            success = response.status_code == 200
            self.log_test("PBN Filtering", success, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("PBN Filtering", False, str(e))

        # Test admin PBN listing
        try:
            response = requests.get(f"{self.base_url}/api/admin/pbn", timeout=10)
            success = response.status_code == 200
            self.log_test("PBN Admin Listing", success, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("PBN Admin Listing", False, str(e))

    def test_packages_endpoints(self):
        """Test Package-related endpoints"""
        # Test public packages
        try:
            response = requests.get(f"{self.base_url}/api/packages", timeout=10)
            success = response.status_code == 200
            if success:
                data = response.json()
                success = isinstance(data, list)
            self.log_test("Packages Public", success, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Packages Public", False, str(e))

        # Test admin packages
        try:
            response = requests.get(f"{self.base_url}/api/admin/packages", timeout=10)
            success = response.status_code == 200
            self.log_test("Packages Admin", success, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Packages Admin", False, str(e))

    def test_blog_endpoints(self):
        """Test Blog-related endpoints"""
        # Test blog listing
        try:
            response = requests.get(f"{self.base_url}/api/blog", timeout=10)
            success = response.status_code == 200
            if success:
                data = response.json()
                success = isinstance(data, list)
            self.log_test("Blog Listing", success, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Blog Listing", False, str(e))

        # Test blog search
        try:
            response = requests.get(f"{self.base_url}/api/blog?search=seo&page=1&limit=5", timeout=10)
            success = response.status_code == 200
            self.log_test("Blog Search", success, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Blog Search", False, str(e))

        # Test admin blog
        try:
            response = requests.get(f"{self.base_url}/api/admin/blog", timeout=10)
            success = response.status_code == 200
            self.log_test("Blog Admin", success, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Blog Admin", False, str(e))

    def test_faq_endpoints(self):
        """Test FAQ-related endpoints"""
        # Test public FAQ
        try:
            response = requests.get(f"{self.base_url}/api/faq", timeout=10)
            success = response.status_code == 200
            if success:
                data = response.json()
                success = isinstance(data, list)
            self.log_test("FAQ Public", success, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("FAQ Public", False, str(e))

        # Test admin FAQ
        try:
            response = requests.get(f"{self.base_url}/api/admin/faq", timeout=10)
            success = response.status_code == 200
            self.log_test("FAQ Admin", success, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("FAQ Admin", False, str(e))

    def test_pages_endpoints(self):
        """Test Pages endpoints"""
        # Test admin pages
        try:
            response = requests.get(f"{self.base_url}/api/admin/pages", timeout=10)
            success = response.status_code == 200
            self.log_test("Pages Admin", success, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Pages Admin", False, str(e))

    def test_settings_endpoints(self):
        """Test Settings endpoints"""
        try:
            response = requests.get(f"{self.base_url}/api/settings", timeout=10)
            success = response.status_code == 200
            if success:
                data = response.json()
                success = "whatsapp_number" in data
            self.log_test("Settings", success, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Settings", False, str(e))

    def test_seo_endpoints(self):
        """Test SEO endpoints"""
        # Test sitemap
        try:
            response = requests.get(f"{self.base_url}/api/sitemap", timeout=10)
            success = response.status_code == 200 and "xml" in response.text
            self.log_test("Sitemap", success, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Sitemap", False, str(e))

        # Test robots.txt
        try:
            response = requests.get(f"{self.base_url}/api/robots", timeout=10)
            success = response.status_code == 200 and "User-agent" in response.text
            self.log_test("Robots.txt", success, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Robots.txt", False, str(e))

    def test_crud_operations(self):
        """Test CRUD operations for admin endpoints"""
        # Test creating a PBN site
        pbn_data = {
            "code": "TEST001",
            "domain_real": "test-domain.com",
            "niche": "Technology",
            "dr": 55,
            "da": 45,
            "traffic": 1000,
            "spam_score": 1.2,
            "age": 5,
            "price_per_post": 50000,
            "status": "active"
        }
        
        try:
            response = requests.post(f"{self.base_url}/api/admin/pbn", json=pbn_data, timeout=10)
            success = response.status_code == 200
            if success:
                created_pbn = response.json()
                pbn_id = created_pbn.get("id")
                
                # Test updating the PBN
                update_data = pbn_data.copy()
                update_data["dr"] = 60
                update_response = requests.put(f"{self.base_url}/api/admin/pbn/{pbn_id}", json=update_data, timeout=10)
                update_success = update_response.status_code == 200
                self.log_test("PBN Update", update_success, f"Status: {update_response.status_code}")
                
                # Test deleting the PBN
                delete_response = requests.delete(f"{self.base_url}/api/admin/pbn/{pbn_id}", timeout=10)
                delete_success = delete_response.status_code == 200
                self.log_test("PBN Delete", delete_success, f"Status: {delete_response.status_code}")
                
            self.log_test("PBN Create", success, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("PBN CRUD Operations", False, str(e))

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting DomainPBN API Tests...")
        print(f"📍 Testing endpoint: {self.base_url}")
        print("=" * 50)

        # Test basic connectivity first
        if not self.test_api_root():
            print("❌ API Root test failed - stopping further tests")
            return False

        # Test all endpoints
        self.test_pbn_endpoints()
        self.test_packages_endpoints()
        self.test_blog_endpoints()
        self.test_faq_endpoints()
        self.test_pages_endpoints()
        self.test_settings_endpoints()
        self.test_seo_endpoints()
        self.test_crud_operations()

        # Print summary
        print("=" * 50)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.failed_tests:
            print("\n❌ Failed Tests:")
            for test in self.failed_tests:
                print(f"  - {test['test']}: {test['error']}")
        
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"✅ Success Rate: {success_rate:.1f}%")
        
        return success_rate >= 80

def main():
    tester = DomainPBNAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/test_reports/backend_test_results.json', 'w') as f:
        json.dump({
            'timestamp': datetime.now().isoformat(),
            'total_tests': tester.tests_run,
            'passed_tests': tester.tests_passed,
            'success_rate': (tester.tests_passed / tester.tests_run) * 100 if tester.tests_run > 0 else 0,
            'failed_tests': tester.failed_tests,
            'detailed_results': tester.test_results
        }, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())